import { MusicGetParams, MusicReadDto } from "@/lib/dtos/user/music.dto";
import MusicRepo from "@/lib/repositories/music.repo";
import { UserAuthItems } from "@/lib/types";
import { NotFoundError, UnauthorizedError } from "@/lib/utils/error.util";
import { musicReadDtoValidator } from "@/lib/validators/user/music.validator";

export const getMusic = async (
  params: MusicGetParams,
  authItems: UserAuthItems,
): Promise<MusicReadDto> => {
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const [data, total] = await MusicRepo.query(
    {
      id: params.id,
      userId,
    },
    { includeRelations: true },
  );
  if (total < 1) throw new NotFoundError();

  const dto = await musicReadDtoValidator.parseAsync(data[0]);

  return dto;
};
