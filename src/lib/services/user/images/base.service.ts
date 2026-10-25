import { Prisma } from "@/generated/prisma/client";
import { env } from "@/lib/config/env.config";
import { prisma } from "@/lib/db/prisma";
import userRepo from "@/lib/repositories/user.repo";
import { UserAuthItems } from "@/lib/types";
import { BadRequestError, UnauthorizedError } from "@/lib/utils/error.util";
import { isNullOrWhitespace } from "@/lib/utils/type.utils";
import { GenerateImageValidationOptions } from "./types";

export const validate = async (options: GenerateImageValidationOptions) => {
  const { prompt, authItems } = options;

  if (isNullOrWhitespace(prompt))
    throw new BadRequestError("No prompt provided");

  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const user = await prisma.$transaction(async (tx) => {
    const user = await userRepo.getByIdWithLock(userId, tx);
    if (!user) throw new UnauthorizedError();

    const noOfImages = options.noOfImages ?? 1;
    const creditsPerImage = options.creditsPerImage ?? env.CREDITS_PER_IMAGE;
    const noOfCreditsToUse = noOfImages * creditsPerImage;
    let noOfCreditsLeft = user.noOfCreditsLeft;

    if (noOfCreditsLeft !== null && noOfCreditsLeft < noOfCreditsToUse) {
      throw new BadRequestError("Not enough credits");
    }

    noOfCreditsLeft =
      user.noOfCreditsAllocated == null || noOfCreditsLeft == null
        ? null
        : noOfCreditsLeft - noOfCreditsToUse;
    const noOfCreditsUsed = user.noOfCreditsUsed + noOfCreditsToUse;
    const totalCreditsUsed = user.totalCreditsUsed + noOfCreditsToUse;

    const noOfImagesUsed = user.noOfImagesUsed + noOfImages;
    const totalImagesUsed = user.totalImagesUsed + noOfImages;

    await userRepo.update(
      userId,
      {
        noOfCreditsUsed,
        totalCreditsUsed,
        noOfCreditsLeft,
        noOfImagesUsed,
        totalImagesUsed,
      },
      tx,
    );

    return user;
  });

  return user;
};

export const reverseCredits = async (
  authItems: UserAuthItems,
  tc?: Prisma.TransactionClient,
  creditsPerImage: number = env.CREDITS_PER_IMAGE,
  noOfImages: number = 1,
) => {
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const user = await userRepo.getById(userId);
  if (!user) throw new UnauthorizedError();

  const noOfCreditsToUse = noOfImages * creditsPerImage;
  let noOfCreditsLeft = user.noOfCreditsLeft;

  noOfCreditsLeft =
    user.noOfCreditsAllocated == null || noOfCreditsLeft == null
      ? null
      : noOfCreditsLeft + noOfCreditsToUse;
  const noOfCreditsUsed = user.noOfCreditsUsed - noOfCreditsToUse;
  const totalCreditsUsed = user.totalCreditsUsed - noOfCreditsToUse;

  const noOfImagesUsed = user.noOfImagesUsed - noOfImages;
  const totalImagesUsed = user.totalImagesUsed - noOfImages;

  await userRepo.update(
    userId,
    {
      noOfCreditsUsed,
      totalCreditsUsed,
      noOfCreditsLeft,
      noOfImagesUsed,
      totalImagesUsed,
    },
    tc,
  );
};
