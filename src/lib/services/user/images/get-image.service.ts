import { ImageGetParams, ImageReadDto } from "@/lib/dtos/user/image.dto";
import imageRepo from "@/lib/repositories/image.repo";
import { UserAuthItems } from "@/lib/types";
import { NotFoundError } from "@/lib/utils/error.util";
import { imageReadDtoValidator } from "@/lib/validators/user/image.validator";

export const getImage = async (
  params: ImageGetParams,
  authItems: UserAuthItems,
): Promise<ImageReadDto> => {
  const [data, total] = await imageRepo.query(
    {
      id: params.id,
      userId: authItems.userId,
    },
    { includeRelations: true },
  );
  if (total < 1) throw new NotFoundError();

  const dto = await imageReadDtoValidator.parseAsync(data[0]);

  return dto;
};
