import { VideoGetParams, VideoReadDto } from "@/lib/dtos/user/video.dto";
import videoRepo from "@/lib/repositories/video.repo";
import { UserAuthItems } from "@/lib/types";
import { NotFoundError } from "@/lib/utils/error.util";
import { videoReadDtoValidator } from "@/lib/validators/user/video.validator";

export const getVideo = async (
  params: VideoGetParams,
  authItems: UserAuthItems,
): Promise<VideoReadDto> => {
  const [data, total] = await videoRepo.query(
    {
      id: params.id,
      userId: authItems.userId,
    },
    { includeRelations: true },
  );
  if (total < 1) throw new NotFoundError();

  const dto = await videoReadDtoValidator.parseAsync(data[0]);

  return dto;
};
