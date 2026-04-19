import { env } from "@/lib/config/env.config";
import { prisma } from "@/lib/db/prisma";
import userRepo from "@/lib/repositories/user.repo";
import { UserAuthItems } from "@/lib/types";
import { BadRequestError, UnauthorizedError } from "@/lib/utils/error.util";
import { isNullOrWhitespace } from "@/lib/utils/type.utils";

export const validate = async (options: GenerateMusicValidationOptions) => {
  const { prompt, authItems } = options;
  if (isNullOrWhitespace(prompt))
    throw new BadRequestError("No prompt provided");

  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const user = await prisma.$transaction(async (tx) => {
    const user = await userRepo.getByIdWithLock(userId, tx);
    if (!user) throw new UnauthorizedError();

    const noOfMusic = 1;
    const creditsPerMusic = env.CREDITS_PER_MUSIC;
    const noOfCreditsToUse = noOfMusic * creditsPerMusic;
    let noOfCreditsLeft = user.noOfCreditsLeft;
    let noOfMusicLeft = user.noOfMusicLeft;

    if (
      noOfCreditsLeft &&
      noOfCreditsLeft > noOfCreditsToUse &&
      noOfMusicLeft &&
      noOfMusicLeft < 1
    ) {
      throw new BadRequestError("Reached max quota");
    }

    noOfCreditsLeft =
      user.noOfCreditsAllocated == null || noOfCreditsLeft == null
        ? null
        : noOfCreditsLeft - noOfCreditsToUse;
    noOfMusicLeft =
      user.noOfMusicAllocated == null || noOfMusicLeft == null
        ? null
        : noOfMusicLeft - 1;

    const noOfCreditsUsed = user.noOfCreditsUsed + noOfCreditsToUse;
    const totalCreditsUsed = user.totalCreditsUsed + noOfCreditsToUse;

    const noOfMusicUsed = user.noOfMusicUsed + noOfMusic;
    const totalMusicUsed = user.totalMusicUsed + noOfMusic;

    await userRepo.update(
      userId,
      {
        noOfCreditsUsed,
        totalCreditsUsed,
        noOfCreditsLeft,
        noOfMusicUsed,
        noOfMusicLeft,
        totalMusicUsed,
      },
      tx,
    );

    return user;
  });

  return user;
};

export const reverseCredits = async (userId?: string) => {
  if (!userId) throw new UnauthorizedError();

  const user = await userRepo.getById(userId);
  if (!user) throw new UnauthorizedError();

  const noOfMusic = 1;
  const creditsPerMusic = env.CREDITS_PER_MUSIC;
  const noOfCreditsToUse = noOfMusic * creditsPerMusic;
  let noOfCreditsLeft = user.noOfCreditsLeft;
  let noOfMusicLeft = user.noOfMusicLeft;

  noOfCreditsLeft =
    user.noOfCreditsAllocated == null || noOfCreditsLeft == null
      ? null
      : noOfCreditsLeft + noOfCreditsToUse;
  noOfMusicLeft =
    user.noOfMusicAllocated == null || noOfMusicLeft == null
      ? null
      : noOfMusicLeft + 1;

  const noOfCreditsUsed = user.noOfCreditsUsed - noOfCreditsToUse;
  const totalCreditsUsed = user.totalCreditsUsed - noOfCreditsToUse;

  const noOfMusicUsed = user.noOfMusicUsed - noOfMusic;
  const totalMusicUsed = user.totalMusicUsed - noOfMusic;

  await userRepo.update(userId, {
    noOfCreditsUsed,
    totalCreditsUsed,
    noOfCreditsLeft,
    noOfMusicUsed,
    noOfMusicLeft,
    totalMusicUsed,
  });
};

export type GenerateMusicValidationOptions = {
  prompt: string;
  authItems: UserAuthItems;
};
