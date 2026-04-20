import imageRepo from "@/lib/repositories/image.repo";
import { ListImagesMetaResponse } from "./types";
import { ImageListParams, ImageReadDto } from "@/lib/dtos/user/image.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { imageReadDtoValidator } from "@/lib/validators/user/image.validator";
import { UserAuthItems } from "@/lib/types";

export const listImages = async (
  params: ImageListParams,
  authItems: UserAuthItems,
): Promise<[ImageReadDto[], ListImagesMetaResponse]> => {
  const [data, total] = await imageRepo.query({
    ...params,
    userId: authItems.userId,
  });

  const dto: ImageReadDto[] = await parseArr(data, imageReadDtoValidator);

  const meta: ListImagesMetaResponse = {
    total,
  };

  return [dto, meta];
};
