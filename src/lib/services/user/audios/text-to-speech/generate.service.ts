import { $Enums, User, Voice } from "@/generated/prisma/client";
import audioRepo from "@/lib/repositories/audio.repo";
import userRepo from "@/lib/repositories/user.repo";
import voiceRepo from "@/lib/repositories/voice.repo";
import { UserAuthItems } from "@/lib/types";
import { BadRequestError, UnauthorizedError } from "@/lib/utils/error.util";

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

  if (
    !user.noOfCharactersLeft ||
    user.noOfCharactersLeft < content.trim().length
  ) {
    throw new BadRequestError("Reached max character quota");
  }

  if (
    !user.noOfWordsAllowed ||
    user.noOfWordsAllowed < content.trim().split(" ").length
  ) {
    throw new BadRequestError("Reached max word quota");
  }

  return [user, voice];
};

export const createAudioAndUpdateUser = async (
  options: CreateAudioAndUpdateUserOptions,
) => {
  const { user, voice, content, languageCode, requestLog, audioUrl } = options;
  await audioRepo.create({
    content,
    languageCode,
    userId: user.id,
    userName: user.fullName,
    voiceId: voice.id,
    voiceName: voice.name,
    audioServiceType: voice.audioServiceType,
    audioServiceRequestLog: requestLog,
    audioUrl,
  });

  const noOfCharacters = content.trim().length;

  await userRepo.update(user.id, {
    noOfCharactersUsed: user.noOfCharactersUsed + noOfCharacters,
    noOfCharactersLeft:
      user.noOfCharactersAllocated == null || user.noOfCharactersLeft == null
        ? null
        : user.noOfCharactersLeft - noOfCharacters,
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
