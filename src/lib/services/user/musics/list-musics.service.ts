import musicRepo from "@/lib/repositories/music.repo";
import { ListMusicsMetaResponse } from "./types";
import { MusicListParams, MusicReadDto } from "@/lib/dtos/user/music.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { musicReadDtoValidator } from "@/lib/validators/user/music.validator";
import { UserAuthItems } from "@/lib/types";
import { UnauthorizedError } from "@/lib/utils/error.util";

export const listMusics = async (
  params: MusicListParams,
  authItems: UserAuthItems,
): Promise<[MusicReadDto[], ListMusicsMetaResponse]> => {
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const [data, total] = await musicRepo.query({
    ...params,
    userId,
  });

  const dto: MusicReadDto[] = await parseArr(data, musicReadDtoValidator);

  const meta: ListMusicsMetaResponse = {
    total,
  };

  return [dto, meta];
};
