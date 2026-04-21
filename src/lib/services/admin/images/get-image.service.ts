import { ImageGetParams, ImageReadDto } from "@/lib/dtos/admin/image.dto";
import imageRepo from "@/lib/repositories/image.repo";
import { AdminAuthItems } from "@/lib/types";
import { NotFoundError } from "@/lib/utils/error.util";
import { imageReadDtoValidator } from "@/lib/validators/admin/image.validator";

export const getImage = async (
  params: ImageGetParams,
  authItems: AdminAuthItems,
): Promise<ImageReadDto> => {
  const [data, total] = await imageRepo.query(
    {
      id: params.id,
    },
    { includeRelations: true },
  );
  if (total < 1) throw new NotFoundError();

  const dto = await imageReadDtoValidator.parseAsync(data[0]);

  return dto;
};
