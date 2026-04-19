import voiceRepo from "@/lib/repositories/voice.repo";
import { GetAllVoicesMetaResponse } from "./types";
import { VoiceListParams, VoiceReadDto } from "@/lib/dtos/user/voice.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { voiceReadDtoValidator } from "@/lib/validators/user/voice.validator";
import { UserAuthItems } from "@/lib/types";
import { UnauthorizedError } from "@/lib/utils/error.util";

export const getAllVoices = async (
  params: VoiceListParams,
  authItems: UserAuthItems,
): Promise<[VoiceReadDto[], GetAllVoicesMetaResponse]> => {
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const [data, total] = await voiceRepo.query({
    ...params,
    userId,
  });

  const dto: VoiceReadDto[] = await parseArr(data, voiceReadDtoValidator);

  const meta: GetAllVoicesMetaResponse = {
    total,
  };

  return [dto, meta];
};
