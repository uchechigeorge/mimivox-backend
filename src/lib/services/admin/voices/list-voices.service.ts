import voiceRepo from "@/lib/repositories/voice.repo";
import { VoiceListMetaResponse } from "./types";
import { VoiceListParams, VoiceReadDto } from "@/lib/dtos/admin/voice.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { voiceReadDtoValidator } from "@/lib/validators/admin/voice.validator";
import { AdminAuthItems } from "@/lib/types";
import { UnauthorizedError } from "@/lib/utils/error.util";

export const listVoices = async (
  params: VoiceListParams,
  authItems: AdminAuthItems,
): Promise<[VoiceReadDto[], VoiceListMetaResponse]> => {
  const adminId = authItems.adminId;
  if (!adminId) throw new UnauthorizedError();

  const [data, total] = await voiceRepo.query({
    ...params,
  });

  const dto: VoiceReadDto[] = await parseArr(data, voiceReadDtoValidator);

  const meta: VoiceListMetaResponse = {
    total,
  };

  return [dto, meta];
};
