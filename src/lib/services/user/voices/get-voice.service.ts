import { VoiceGetParams, VoiceReadDto } from "@/lib/dtos/user/voice.dto";
import voiceRepo from "@/lib/repositories/voice.repo";
import { UserAuthItems } from "@/lib/types";
import { NotFoundError, UnauthorizedError } from "@/lib/utils/error.util";
import { voiceReadDtoValidator } from "@/lib/validators/user/voice.validator";

export const getVoice = async (
  params: VoiceGetParams,
  authItems: UserAuthItems,
): Promise<VoiceReadDto> => {
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const [data, total] = await voiceRepo.query(
    {
      id: params.id,
      userId,
    },
    { includeRelations: true },
  );
  if (total < 1) throw new NotFoundError();

  const dto = await voiceReadDtoValidator.parseAsync(data[0]);

  return dto;
};
