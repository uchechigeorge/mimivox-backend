import { AudioGetParams, AudioReadDto } from "@/lib/dtos/user/audio.dto";
import audioRepo from "@/lib/repositories/audio.repo";
import { UserAuthItems } from "@/lib/types";
import { NotFoundError, UnauthorizedError } from "@/lib/utils/error.util";
import { audioReadDtoValidator } from "@/lib/validators/user/audio.validator";

export const getAudio = async (
  params: AudioGetParams,
  authItems: UserAuthItems,
): Promise<AudioReadDto> => {
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const [data, total] = await audioRepo.query(
    {
      id: params.id,
      userId,
    },
    { includeRelations: true },
  );
  if (total < 1) throw new NotFoundError();

  const dto = await audioReadDtoValidator.parseAsync(data[0]);

  return dto;
};
