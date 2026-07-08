import { User, Voice } from "@/generated/prisma/client";
import { env } from "@/lib/config/env.config";
import { prisma } from "@/lib/db/prisma";
import audioRepo from "@/lib/repositories/audio.repo";
import userRepo from "@/lib/repositories/user.repo";
import voiceRepo from "@/lib/repositories/voice.repo";
import { BadRequestError, UnauthorizedError } from "@/lib/utils/error.util";
import {
  TTSCreateAudioOptions,
  TTSReverseOptions,
  TTSValidateOptions,
} from "./types";

export const validate = async (
  options: TTSValidateOptions,
): Promise<[User, Voice | null]> => {
  const { userId, content, voiceId, audioServiceType } = options;

  const voice = await voiceRepo.getByAudioServiceReference(
    voiceId,
    audioServiceType,
  );
  if (voice && voice.type === "Cloned" && voice.userId !== userId) {
    throw new BadRequestError("Cannot use voice");
  }

  const user = await prisma.$transaction(async (tx) => {
    const user = await userRepo.getByIdWithLock(userId, tx);
    if (!user) {
      throw new UnauthorizedError();
    }

    const noOfCharacters = content.trim().length;
    const isPremiumVoice = audioServiceType === "ElevenLabs";
    const creditsPerCharacter = isPremiumVoice
      ? env.CREDITS_PER_CHARACTER_PREMIUM
      : env.CREDITS_PER_CHARACTER;

    const noOfCreditsToUse = noOfCharacters * creditsPerCharacter;
    let noOfCreditsLeft = user.noOfCreditsLeft;
    let noOfCharactersLeft = user.noOfCharactersLeft;

    if (
      (noOfCreditsLeft && noOfCreditsLeft < noOfCreditsToUse) ||
      (noOfCharactersLeft && noOfCharactersLeft < noOfCharacters)
    ) {
      throw new BadRequestError("Reached max quota");
    }

    if (
      !user.noOfWordsAllowed ||
      user.noOfWordsAllowed < content.trim().split(" ").length
    ) {
      throw new BadRequestError("Reached max word quota");
    }

    if (
      isPremiumVoice &&
      user.noOfPremiumVoicesLeft !== null &&
      user.noOfPremiumVoicesLeft <= 0
    ) {
      throw new BadRequestError("No premium voices left");
    }

    const noOfCharactersUsed = user.noOfCharactersUsed + noOfCharacters;
    const totalCharactersUsed = user.totalCharactersUsed + noOfCharacters;
    noOfCharactersLeft =
      user.noOfCharactersAllocated == null || user.noOfCharactersLeft == null
        ? null
        : user.noOfCharactersLeft - noOfCharacters;

    const noOfCreditsUsed = user.noOfCreditsUsed + noOfCreditsToUse;
    const totalCreditsUsed = user.totalCreditsUsed + noOfCreditsToUse;
    noOfCreditsLeft =
      user.noOfCreditsAllocated == null || user.noOfCreditsLeft == null
        ? null
        : user.noOfCreditsLeft - noOfCreditsToUse;

    const noOfPremiumVoicesUsed = isPremiumVoice
      ? user.noOfPremiumVoicesUsed + 1
      : undefined;
    const totalPremiumVoicesUsed = isPremiumVoice
      ? user.totalPremiumVoicesUsed + 1
      : undefined;
    const noOfPremiumVoicesLeft =
      user.noOfPremiumVoicesLeft == null ||
      user.noOfPremiumVoicesAllocated == null
        ? null
        : isPremiumVoice
          ? user.noOfPremiumVoicesLeft - 1
          : undefined;

    await userRepo.update(
      user.id,
      {
        noOfCharactersUsed,
        totalCharactersUsed,
        noOfCharactersLeft,
        noOfCreditsUsed,
        totalCreditsUsed,
        noOfCreditsLeft,
        noOfPremiumVoicesUsed,
        totalPremiumVoicesUsed,
        noOfPremiumVoicesLeft,
      },
      tx,
    );

    return user;
  });

  return [user, voice];
};

export const reverseCredits = async (data: TTSReverseOptions) => {
  const { userId, content, audioServiceType } = data;

  const user = await userRepo.getById(userId);
  if (!user) throw new UnauthorizedError();

  const noOfCharacters = content.trim().length;
  const creditsPerCharacter =
    data.audioServiceType === "ElevenLabs"
      ? env.CREDITS_PER_CHARACTER_PREMIUM
      : env.CREDITS_PER_CHARACTER;
  const noOfCreditsToUse = noOfCharacters * creditsPerCharacter;
  let noOfCreditsLeft = user.noOfCreditsLeft;
  let noOfCharactersLeft = user.noOfCharactersLeft;

  const isPremiumVoice = audioServiceType === "ElevenLabs";

  const noOfCharactersUsed = user.noOfCharactersUsed - noOfCharacters;
  const totalCharactersUsed = user.totalCharactersUsed - noOfCharacters;
  noOfCharactersLeft =
    user.noOfCharactersAllocated == null || user.noOfCharactersLeft == null
      ? null
      : user.noOfCharactersLeft + noOfCharacters;

  const noOfCreditsUsed = user.noOfCreditsUsed - noOfCreditsToUse;
  const totalCreditsUsed = user.totalCreditsUsed - noOfCreditsToUse;
  noOfCreditsLeft =
    user.noOfCreditsAllocated == null || user.noOfCreditsLeft == null
      ? null
      : user.noOfCreditsLeft + noOfCreditsToUse;

  const noOfPremiumVoicesUsed = isPremiumVoice
    ? user.noOfPremiumVoicesUsed - 1
    : undefined;
  const totalPremiumVoicesUsed = isPremiumVoice
    ? user.totalPremiumVoicesUsed - 1
    : undefined;
  const noOfPremiumVoicesLeft =
    user.noOfPremiumVoicesLeft == null ||
    user.noOfPremiumVoicesAllocated == null
      ? null
      : isPremiumVoice
        ? user.noOfPremiumVoicesLeft + 1
        : undefined;

  await userRepo.update(user.id, {
    noOfCharactersUsed,
    totalCharactersUsed,
    noOfCharactersLeft,
    noOfCreditsUsed,
    totalCreditsUsed,
    noOfCreditsLeft,
    noOfPremiumVoicesUsed,
    totalPremiumVoicesUsed,
    noOfPremiumVoicesLeft,
  });
};

export const createAudio = async (options: TTSCreateAudioOptions) => {
  const { user, voice, content, languageCode, requestLog, audioUrl } = options;

  await prisma.$transaction(async (tx) => {
    await audioRepo.create(
      {
        content,
        languageCode,
        userId: user.id,
        userName: user.fullName,
        voiceId: voice.id,
        voiceName: voice.name,
        audioServiceType: voice.audioServiceType,
        audioServiceRequestLog: requestLog,
        audioUrl,
      },
      tx,
    );
  });
};
