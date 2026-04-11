import { $Enums, User } from "@/generated/prisma/client";
import userRepo from "@/lib/repositories/user.repo";
import voiceRepo from "@/lib/repositories/voice.repo";
import { UserAuthItems } from "@/lib/types";
import { BadRequestError, UnauthorizedError } from "@/lib/utils/error.util";

export const validate = async (
  options: CloneValidateOptions,
): Promise<User> => {
  const { authItems } = options;
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const user = await userRepo.getById(userId);

  if (!user) {
    throw new UnauthorizedError();
  }

  if (!user.noOfVoicesLeft || user.noOfVoicesLeft < 1) {
    throw new BadRequestError("Reached max voice quota");
  }

  return user;
};

export const createVoiceAndUpdateUser = async (
  options: CreateVoiceAndUpdateUserOptions,
) => {
  const {
    user,
    audioServiceType,
    name,
    voiceId,
    gender,
    description,
    sampleUrl,
    requestLog,
  } = options;

  const userId = user.id;

  const sequence = Math.max(
    10000,
    (await voiceRepo.getMaxSequence({ userId })) + 1,
  );
  //TODO: Add request log
  await voiceRepo.create({
    name,
    type: "Cloned",
    audioServiceType,
    audioServiceReferenceId: voiceId,
    description,
    gender,
    sampleUrl,
    sequence,
    userId,
    userName: user.fullName,
  });

  await userRepo.update(user.id, {
    noOfVoicesUsed: user.noOfVoicesUsed + 1,
    noOfVoicesLeft:
      user.noOfVoicesLeft == null || user.noOfVoicesLeft == null
        ? null
        : user.noOfVoicesLeft - 1,
  });
};

export type CloneValidateOptions = {
  authItems: UserAuthItems;
};

export type CreateVoiceAndUpdateUserOptions = {
  user: User;
  name: string;
  voiceId: string;
  sampleUrl?: string;
  requestLog?: any;
  description?: string;
  gender?: string;
  audioServiceType: $Enums.AudioServiceType;
};
