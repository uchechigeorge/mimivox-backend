import videoRepo from "@/lib/repositories/video.repo";
import { ListVideosMetaResponse } from "./types";
import { VideoListParams, VideoReadDto } from "@/lib/dtos/user/video.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { videoReadDtoValidator } from "@/lib/validators/user/video.validator";
import { UserAuthItems } from "@/lib/types";
import { UnauthorizedError } from "@/lib/utils/error.util";

export const listVideos = async (
  params: VideoListParams,
  authItems: UserAuthItems,
): Promise<[VideoReadDto[], ListVideosMetaResponse]> => {
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const [data, total] = await videoRepo.query({
    ...params,
    userId,
  });

  const dto: VideoReadDto[] = await parseArr(data, videoReadDtoValidator);

  const meta: ListVideosMetaResponse = {
    total,
  };

  return [dto, meta];
};
