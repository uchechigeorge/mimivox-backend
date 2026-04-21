import musicRepo from "@/lib/repositories/music.repo";
import { ListMusicsMetaResponse } from "./types";
import { MusicListParams, MusicReadDto } from "@/lib/dtos/admin/music.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { musicReadDtoValidator } from "@/lib/validators/admin/music.validator";
import { AdminAuthItems } from "@/lib/types";

export const listMusics = async (
  params: MusicListParams,
  authItems: AdminAuthItems,
): Promise<[MusicReadDto[], ListMusicsMetaResponse]> => {
  const [data, total] = await musicRepo.query({
    ...params,
  });

  const dto: MusicReadDto[] = await parseArr(data, musicReadDtoValidator);

  const meta: ListMusicsMetaResponse = {
    total,
  };

  return [dto, meta];
};
