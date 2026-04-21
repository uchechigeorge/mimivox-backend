import { AudioGetParams, AudioReadDto } from "@/lib/dtos/admin/audio.dto";
import audioRepo from "@/lib/repositories/audio.repo";
import { AdminAuthItems } from "@/lib/types";
import { NotFoundError } from "@/lib/utils/error.util";
import { audioReadDtoValidator } from "@/lib/validators/admin/audio.validator";

export const getAudio = async (
  params: AudioGetParams,
  authItems: AdminAuthItems,
): Promise<AudioReadDto> => {
  const [data, total] = await audioRepo.query(
    {
      id: params.id,
    },
    { includeRelations: true },
  );
  if (total < 1) throw new NotFoundError();

  const dto = await audioReadDtoValidator.parseAsync(data[0]);

  return dto;
};
