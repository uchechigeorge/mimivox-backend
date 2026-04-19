import imageRepo from "@/lib/repositories/image.repo";
import { ListImagesMetaResponse } from "./types";
import { ImageListParams, ImageReadDto } from "@/lib/dtos/user/image.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { imageReadDtoValidator } from "@/lib/validators/user/image.validator";

export const listImages = async (
  params: ImageListParams,
): Promise<[ImageReadDto[], ListImagesMetaResponse]> => {
  const [data, total] = await imageRepo.query({
    ...params,
  });

  const dto: ImageReadDto[] = await parseArr(data, imageReadDtoValidator);

  const meta: ListImagesMetaResponse = {
    total,
  };

  return [dto, meta];
};
