import { env } from "@/lib/config/env.config";
import { Prisma, User } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import userRepo from "@/lib/repositories/user.repo";
import { BadRequestError, UnauthorizedError } from "@/lib/utils/error.util";
import { isNullOrWhitespace } from "@/lib/utils/type.utils";
import { GenerateMusicValidationOptions } from "./types";

export const validate = async (options: GenerateMusicValidationOptions) => {
  const { prompt, authItems } = options;
  if (isNullOrWhitespace(prompt))
    throw new BadRequestError("No prompt provided");

  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const user = await prisma.$transaction(async (tx) => {
    const user = await userRepo.getByIdWithLock(userId, tx);
    if (!user) throw new UnauthorizedError();

    if (
      user.noOfCreditsLeft !== null &&
      user.noOfCreditsLeft < env.CREDITS_PER_MUSIC
    ) {
      throw new BadRequestError("Not enough credits");
    }

    if (user.noOfMusicLeft !== null && user.noOfMusicLeft < 1) {
      throw new BadRequestError("Reached max quota");
    }

    await applyCredits(user, tx);

    return user;
  });

  return user;
};

export const reverseCredits = async (
  userId?: string,
  tc?: Prisma.TransactionClient,
) => {
  if (!userId) throw new UnauthorizedError();

  const reverse = async (tx: Prisma.TransactionClient) => {
    const user = await userRepo.getByIdWithLock(userId, tx);
    if (!user) throw new UnauthorizedError();

    const creditsPerMusic = env.CREDITS_PER_MUSIC;
    const noOfCreditsLeft =
      user.noOfCreditsAllocated == null || user.noOfCreditsLeft == null
        ? null
        : user.noOfCreditsLeft + creditsPerMusic;
    const noOfMusicLeft =
      user.noOfMusicAllocated == null || user.noOfMusicLeft == null
        ? null
        : user.noOfMusicLeft + 1;

    await userRepo.update(
      userId,
      {
        noOfCreditsUsed: user.noOfCreditsUsed - creditsPerMusic,
        totalCreditsUsed: user.totalCreditsUsed - creditsPerMusic,
        noOfCreditsLeft,
        noOfMusicUsed: user.noOfMusicUsed - 1,
        noOfMusicLeft,
        totalMusicUsed: user.totalMusicUsed - 1,
      },
      tx,
    );
  };

  if (tc) {
    await reverse(tc);
    return;
  }

  await prisma.$transaction(reverse);
};

export const applyCredits = async (
  user: User,
  tx: Prisma.TransactionClient,
) => {
  const creditsPerMusic = env.CREDITS_PER_MUSIC;
  const noOfCreditsLeft =
    user.noOfCreditsAllocated == null || user.noOfCreditsLeft == null
      ? null
      : user.noOfCreditsLeft - creditsPerMusic;
  const noOfMusicLeft =
    user.noOfMusicAllocated == null || user.noOfMusicLeft == null
      ? null
      : user.noOfMusicLeft - 1;

  await userRepo.update(
    user.id,
    {
      noOfCreditsUsed: user.noOfCreditsUsed + creditsPerMusic,
      totalCreditsUsed: user.totalCreditsUsed + creditsPerMusic,
      noOfCreditsLeft,
      noOfMusicUsed: user.noOfMusicUsed + 1,
      noOfMusicLeft,
      totalMusicUsed: user.totalMusicUsed + 1,
    },
    tx,
  );
};
