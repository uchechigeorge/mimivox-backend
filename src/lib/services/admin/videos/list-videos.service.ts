import videoRepo from "@/lib/repositories/video.repo";
import { ListVideosMetaResponse } from "./types";
import { VideoListParams, VideoReadDto } from "@/lib/dtos/admin/video.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { videoReadDtoValidator } from "@/lib/validators/admin/video.validator";
import { AdminAuthItems } from "@/lib/types";

export const listVideos = async (
  params: VideoListParams,
  authItems: AdminAuthItems,
): Promise<[VideoReadDto[], ListVideosMetaResponse]> => {
  const [data, total] = await videoRepo.query({
    ...params,
  });

  const dto: VideoReadDto[] = await parseArr(data, videoReadDtoValidator);

  const meta: ListVideosMetaResponse = {
    total,
  };

  return [dto, meta];
};
