import { VoiceGetParams, VoiceReadDto } from "@/lib/dtos/admin/voice.dto";
import voiceRepo from "@/lib/repositories/voice.repo";
import { AdminAuthItems } from "@/lib/types";
import { NotFoundError, UnauthorizedError } from "@/lib/utils/error.util";
import { voiceReadDtoValidator } from "@/lib/validators/admin/voice.validator";

export const getVoice = async (
  params: VoiceGetParams,
  authItems: AdminAuthItems,
): Promise<VoiceReadDto> => {
  const adminId = authItems.adminId;
  if (!adminId) throw new UnauthorizedError();

  const [data, total] = await voiceRepo.query(
    {
      id: params.id,
    },
    { includeRelations: true },
  );
  if (total < 1) throw new NotFoundError();

  const dto = await voiceReadDtoValidator.parseAsync(data[0]);

  return dto;
};
