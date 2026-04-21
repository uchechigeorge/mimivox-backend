import audioRepo from "@/lib/repositories/audio.repo";
import { AudioListResponseMeta } from "./types";
import { AudioListParams, AudioReadDto } from "@/lib/dtos/admin/audio.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { audioReadDtoValidator } from "@/lib/validators/admin/audio.validator";
import { AdminAuthItems } from "@/lib/types";

export const listAudios = async (
  params: AudioListParams,
  authItems: AdminAuthItems,
): Promise<[AudioReadDto[], AudioListResponseMeta]> => {
  const [data, total] = await audioRepo.query({
    ...params,
  });

  const dto: AudioReadDto[] = await parseArr(data, audioReadDtoValidator);

  const meta: AudioListResponseMeta = {
    total,
  };

  return [dto, meta];
};
