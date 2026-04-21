import { MusicGetParams, MusicReadDto } from "@/lib/dtos/admin/music.dto";
import MusicRepo from "@/lib/repositories/music.repo";
import { AdminAuthItems } from "@/lib/types";
import { NotFoundError } from "@/lib/utils/error.util";
import { musicReadDtoValidator } from "@/lib/validators/admin/music.validator";

export const getMusic = async (
  params: MusicGetParams,
  authItems: AdminAuthItems,
): Promise<MusicReadDto> => {
  const [data, total] = await MusicRepo.query(
    {
      id: params.id,
    },
    { includeRelations: true },
  );
  if (total < 1) throw new NotFoundError();

  const dto = await musicReadDtoValidator.parseAsync(data[0]);

  return dto;
};
