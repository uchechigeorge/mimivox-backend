import audioRepo from "@/lib/repositories/audio.repo";
import { AudioListResponseMeta } from "./types";
import { AudioListParams, AudioReadDto } from "@/lib/dtos/user/audio.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { audioReadDtoValidator } from "@/lib/validators/user/audio.validator";
import { UserAuthItems } from "@/lib/types";
import { UnauthorizedError } from "@/lib/utils/error.util";

export const listAudios = async (
  params: AudioListParams,
  authItems: UserAuthItems,
): Promise<[AudioReadDto[], AudioListResponseMeta]> => {
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const [data, total] = await audioRepo.query({
    ...params,
    userId,
  });

  const dto: AudioReadDto[] = await parseArr(data, audioReadDtoValidator);

  const meta: AudioListResponseMeta = {
    total,
  };

  return [dto, meta];
};
