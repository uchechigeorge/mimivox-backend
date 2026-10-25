import { $Enums, User, Voice } from "@/generated/prisma/client";
import { env } from "@/lib/config/env.config";
import { prisma } from "@/lib/db/prisma";
import audioRepo from "@/lib/repositories/audio.repo";
import userRepo from "@/lib/repositories/user.repo";
import voiceRepo from "@/lib/repositories/voice.repo";
import { UserAuthItems } from "@/lib/types";
import { BadRequestError, UnauthorizedError } from "@/lib/utils/error.util";
import { getMaxWordsPerRequest } from "../word-limit.service";

export const validate = async (
  options: GenerateValidateOptions,
): Promise<[User, Voice | null]> => {
  const { authItems, content, voiceId, audioServiceType } = options;
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const user = await userRepo.getById(userId);

  if (!user) {
    throw new UnauthorizedError();
  }

  const voice = await voiceRepo.getByAudioServiceReference(
    voiceId,
    audioServiceType,
  );
  if (voice && voice.type === "Cloned" && voice.userId != user.id) {
    throw new BadRequestError("Cannot use voice");
  }

  const noOfCreditsToUse = content.trim().length * env.CREDITS_PER_CHARACTER;
  if (user.noOfCreditsLeft !== null && user.noOfCreditsLeft < noOfCreditsToUse) {
    throw new BadRequestError("Not enough credits");
  }

  const maxWords = getMaxWordsPerRequest(user);
  if (!maxWords || maxWords < content.trim().split(" ").length) {
    throw new BadRequestError("Reached max word quota");
  }

  return [user, voice];
};

export const createAudioAndUpdateUser = async (
  options: CreateAudioAndUpdateUserOptions,
) => {
  const { user, voice, content, languageCode, requestLog, audioUrl } = options;

  await prisma.$transaction(async (tc) => {
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
      tc,
    );

    const noOfCharacters = content.trim().length;
    const creditsPerCharacter = env.CREDITS_PER_CHARACTER;
    const noOfCredits = noOfCharacters * creditsPerCharacter;

    const isPremiumVoice = voice.audioServiceType === "ElevenLabs";

    const noOfCharactersUsed = user.noOfCharactersUsed + noOfCharacters;
    const totalCharactersUsed = user.totalCharactersUsed + noOfCharacters;

    const noOfCreditsUsed = user.noOfCreditsUsed + noOfCredits;
    const totalCreditsUsed = user.totalCreditsUsed + noOfCredits;
    const noOfCreditsLeft =
      user.noOfCreditsAllocated == null || user.noOfCreditsLeft == null
        ? null
        : user.noOfCreditsLeft - noOfCredits;

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
        noOfCreditsUsed,
        totalCreditsUsed,
        noOfCreditsLeft,
        noOfPremiumVoicesUsed,
        totalPremiumVoicesUsed,
        noOfPremiumVoicesLeft,
      },
      tc,
    );
  });
};

export type GenerateValidateOptions = {
  authItems: UserAuthItems;
  content: string;
  voiceId: string;
  audioServiceType: $Enums.AudioServiceType;
};

export type CreateAudioAndUpdateUserOptions = {
  user: User;
  content: string;
  voice: Voice;
  languageCode?: string;
  requestLog?: any;
  audioUrl: string;
};
