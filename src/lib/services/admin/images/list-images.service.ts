import imageRepo from "@/lib/repositories/image.repo";
import { ImageListMetaResponse } from "./types";
import { ImageListParams, ImageReadDto } from "@/lib/dtos/admin/image.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { imageReadDtoValidator } from "@/lib/validators/admin/image.validator";
import { AdminAuthItems } from "@/lib/types";

export const listImages = async (
  params: ImageListParams,
  authItems: AdminAuthItems,
): Promise<[ImageReadDto[], ImageListMetaResponse]> => {
  const [data, total] = await imageRepo.query({
    ...params,
  });

  const dto: ImageReadDto[] = await parseArr(data, imageReadDtoValidator);

  const meta: ImageListMetaResponse = {
    total,
  };

  return [dto, meta];
};
