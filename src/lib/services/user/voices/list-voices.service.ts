import voiceRepo from "@/lib/repositories/voice.repo";
import { VoiceListMetaResponse } from "./types";
import { VoiceListParams, VoiceReadDto } from "@/lib/dtos/user/voice.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { voiceReadDtoValidator } from "@/lib/validators/user/voice.validator";
import { UserAuthItems } from "@/lib/types";
import { UnauthorizedError } from "@/lib/utils/error.util";

export const listVoices = async (
  params: VoiceListParams,
  authItems: UserAuthItems,
): Promise<[VoiceReadDto[], VoiceListMetaResponse]> => {
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const [data, total] = await voiceRepo.query({
    ...params,
    userId,
  });

  const dto: VoiceReadDto[] = await parseArr(data, voiceReadDtoValidator);

  const meta: VoiceListMetaResponse = {
    total,
  };

  return [dto, meta];
};
