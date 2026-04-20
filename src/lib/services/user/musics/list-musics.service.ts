import musicRepo from "@/lib/repositories/music.repo";
import { ListMusicsMetaResponse } from "./types";
import { MusicListParams, MusicReadDto } from "@/lib/dtos/user/music.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { musicReadDtoValidator } from "@/lib/validators/user/music.validator";
import { UserAuthItems } from "@/lib/types";

export const listMusics = async (
  params: MusicListParams,
  authItems: UserAuthItems,
): Promise<[MusicReadDto[], ListMusicsMetaResponse]> => {
  const [data, total] = await musicRepo.query({
    ...params,
    userId: authItems.userId,
  });

  const dto: MusicReadDto[] = await parseArr(data, musicReadDtoValidator);

  const meta: ListMusicsMetaResponse = {
    total,
  };

  return [dto, meta];
};
