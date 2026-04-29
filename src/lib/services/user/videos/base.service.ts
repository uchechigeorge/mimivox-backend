import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import userRepo from "@/lib/repositories/user.repo";
import { UserAuthItems } from "@/lib/types";
import { BadRequestError, UnauthorizedError } from "@/lib/utils/error.util";
import { isNullOrWhitespace } from "@/lib/utils/type.utils";
import {
  GenerateVideoValidationOptions,
  GenerateVideoValidationResponse,
} from "./types";
import { env } from "@/lib/config/env.config";

export const validate = async (
  options: GenerateVideoValidationOptions,
): Promise<GenerateVideoValidationResponse> => {
  const { prompt, authItems } = options;

  if (isNullOrWhitespace(prompt))
    throw new BadRequestError("No prompt provided");

  if (options.duration && options.duration < 10) {
    throw new BadRequestError("Minimum duration is 10 seconds");
  }

  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const user = await prisma.$transaction(async (tx) => {
    const user = await userRepo.getByIdWithLock(userId, tx);
    if (!user) throw new UnauthorizedError();

    const noOfCreditsLeft = user.noOfCreditsLeft;
    if (
      noOfCreditsLeft &&
      noOfCreditsLeft <= env.CREDITS_PER_VIDEO_PER_SECOND * 10
    ) {
      throw new BadRequestError("Not enough credits left");
    }

    const noOfVideos = 1;
    let noOfVideosLeft = user.noOfVideosLeft;

    if (noOfVideosLeft && noOfVideosLeft < 1) {
      throw new BadRequestError("Reached max quota");
    }

    noOfVideosLeft =
      user.noOfVideosAllocated == null || noOfVideosLeft == null
        ? null
        : noOfVideosLeft - 1;

    const noOfVideosUsed = user.noOfVideosUsed + noOfVideos;
    const totalVideosUsed = user.totalVideosUsed + noOfVideos;

    await userRepo.update(
      userId,
      {
        noOfVideosUsed,
        noOfVideosLeft: noOfVideosLeft,
        totalVideosUsed,
      },
      tx,
    );

    return user;
  });

  let duration = options.duration;
  // Modify duration if user is nearing credit limit
  const noOfVideoSecondsLeft = user.noOfCreditsLeft
    ? user.noOfCreditsLeft / env.CREDITS_PER_VIDEO_PER_SECOND
    : user.noOfCreditsLeft;
  if (noOfVideoSecondsLeft && noOfVideoSecondsLeft <= 60) {
    duration = Math.min(duration ?? 60, noOfVideoSecondsLeft);
  }

  return { user, duration };
};

export const reverseCredits = async (
  authItems: UserAuthItems,
  tc?: Prisma.TransactionClient,
) => {
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const user = await userRepo.getById(userId);
  if (!user) throw new UnauthorizedError();

  const noOfVideos = 1;
  let noOfVideosLeft = user.noOfVideosLeft;

  noOfVideosLeft =
    user.noOfVideosAllocated == null || noOfVideosLeft == null
      ? null
      : noOfVideosLeft + 1;

  const noOfVideosUsed = user.noOfVideosUsed - noOfVideos;
  const totalVideosUsed = user.totalVideosUsed - noOfVideos;

  await userRepo.update(userId, {
    noOfVideosUsed,
    noOfVideosLeft,
    totalVideosUsed,
  });
};

export const applyCredits = async (
  userId: string,
  videoDurationInSeconds: number,
) => {
  if (!userId) throw new UnauthorizedError();

  const user = await userRepo.getById(userId);
  if (!user) throw new UnauthorizedError();

  // const noOfVideos = 1;
  const creditsPerVideoPerSecond = env.CREDITS_PER_VIDEO_PER_SECOND;
  const noOfCreditsToUse = videoDurationInSeconds * creditsPerVideoPerSecond;
  let noOfCreditsLeft = user.noOfCreditsLeft;

  // if (
  //   // noOfCreditsLeft &&
  //   // noOfCreditsLeft > noOfCreditsToUse
  // ) {
  //   throw new BadRequestError("Reached max quota");
  // }

  noOfCreditsLeft =
    user.noOfCreditsAllocated == null || noOfCreditsLeft == null
      ? null
      : noOfCreditsLeft - noOfCreditsToUse;

  const noOfCreditsUsed = user.noOfCreditsUsed + noOfCreditsToUse;
  const totalCreditsUsed = user.totalCreditsUsed + noOfCreditsToUse;

  await userRepo.update(userId, {
    noOfCreditsUsed,
    totalCreditsUsed,
    noOfCreditsLeft,
  });

  return user;
};
