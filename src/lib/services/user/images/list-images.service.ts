import imageRepo from "@/lib/repositories/image.repo";
import { ListImagesMetaResponse } from "./types";
import { ImageListParams, ImageReadDto } from "@/lib/dtos/user/image.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { imageReadDtoValidator } from "@/lib/validators/user/image.validator";
import { UserAuthItems } from "@/lib/types";
import { UnauthorizedError } from "@/lib/utils/error.util";

export const listImages = async (
  params: ImageListParams,
  authItems: UserAuthItems,
): Promise<[ImageReadDto[], ListImagesMetaResponse]> => {
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const [data, total] = await imageRepo.query({
    ...params,
    userId,
  });

  const dto: ImageReadDto[] = await parseArr(data, imageReadDtoValidator);

  const meta: ListImagesMetaResponse = {
    total,
  };

  return [dto, meta];
};
