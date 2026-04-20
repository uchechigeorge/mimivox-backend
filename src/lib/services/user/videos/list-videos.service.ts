import videoRepo from "@/lib/repositories/video.repo";
import { ListVideosMetaResponse } from "./types";
import { VideoListParams, VideoReadDto } from "@/lib/dtos/user/video.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { videoReadDtoValidator } from "@/lib/validators/user/video.validator";
import { UserAuthItems } from "@/lib/types";

export const listVideos = async (
  params: VideoListParams,
  authItems: UserAuthItems,
): Promise<[VideoReadDto[], ListVideosMetaResponse]> => {
  const [data, total] = await videoRepo.query({
    ...params,
    userId: authItems.userId,
  });

  const dto: VideoReadDto[] = await parseArr(data, videoReadDtoValidator);

  const meta: ListVideosMetaResponse = {
    total,
  };

  return [dto, meta];
};
