import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import userRepo from "@/lib/repositories/user.repo";
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

  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();
  const _user = await userRepo.getByIdWithLock(userId);
  if (!_user) throw new UnauthorizedError();

  if (
    options.duration &&
    _user.maxVideoDurationInSeconds &&
    options.duration > _user.maxVideoDurationInSeconds
  ) {
    throw new BadRequestError("Video duration exceeds maximum allowed");
  }

  const defaultDuration = 5;

  const user = await prisma.$transaction(async (tx) => {
    const user = await userRepo.getByIdWithLock(userId, tx);
    if (!user) throw new UnauthorizedError();

    const noOfVideo = 1;
    const creditsPerVideoPerSecond = env.CREDITS_PER_VIDEO_PER_SECOND;
    const noOfCreditsToUse =
      noOfVideo *
      creditsPerVideoPerSecond *
      (options.duration ?? defaultDuration);
    const noOfCreditsLeft = user.noOfCreditsLeft;

    if (noOfCreditsLeft !== null && noOfCreditsLeft < noOfCreditsToUse) {
      throw new BadRequestError("Not enough credits");
    }

    const noOfVideos = 1;
    let noOfVideosLeft = user.noOfVideosLeft;

    if (noOfVideosLeft && noOfVideosLeft < 1) {
      throw new BadRequestError("Reached max video quota");
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
        noOfVideosLeft,
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
    : 0;
  if (noOfVideoSecondsLeft && noOfVideoSecondsLeft <= defaultDuration) {
    duration = Math.min(duration ?? defaultDuration, noOfVideoSecondsLeft);
  }

  return { user, duration };
};

export const reverseCredits = async (
  userId: string,
  tc?: Prisma.TransactionClient,
) => {
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

  await userRepo.update(
    userId,
    {
      noOfVideosUsed,
      noOfVideosLeft,
      totalVideosUsed,
    },
    tc,
  );
};

export const applyCredits = async (
  userId: string,
  videoDurationInSeconds: number,
  tc?: Prisma.TransactionClient,
) => {
  if (!userId) throw new UnauthorizedError();

  const user = await userRepo.getById(userId);
  if (!user) throw new UnauthorizedError();

  // const noOfVideos = 1;
  const creditsPerVideoPerSecond = env.CREDITS_PER_VIDEO_PER_SECOND;
  const noOfCreditsToUse = videoDurationInSeconds * creditsPerVideoPerSecond;
  let noOfCreditsLeft = user.noOfCreditsLeft;

  noOfCreditsLeft =
    user.noOfCreditsAllocated == null || noOfCreditsLeft == null
      ? null
      : noOfCreditsLeft - noOfCreditsToUse;

  const noOfCreditsUsed = user.noOfCreditsUsed + noOfCreditsToUse;
  const totalCreditsUsed = user.totalCreditsUsed + noOfCreditsToUse;

  await userRepo.update(
    userId,
    {
      noOfCreditsUsed,
      totalCreditsUsed,
      noOfCreditsLeft,
    },
    tc,
  );

  return user;
};
