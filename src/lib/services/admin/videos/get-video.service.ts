import { VideoGetParams, VideoReadDto } from "@/lib/dtos/admin/video.dto";
import videoRepo from "@/lib/repositories/video.repo";
import { AdminAuthItems } from "@/lib/types";
import { NotFoundError } from "@/lib/utils/error.util";
import { videoReadDtoValidator } from "@/lib/validators/admin/video.validator";

export const getVideo = async (
  params: VideoGetParams,
  authItems: AdminAuthItems,
): Promise<VideoReadDto> => {
  const [data, total] = await videoRepo.query(
    {
      id: params.id,
    },
    { includeRelations: true },
  );
  if (total < 1) throw new NotFoundError();

  const dto = await videoReadDtoValidator.parseAsync(data[0]);

  return dto;
};
