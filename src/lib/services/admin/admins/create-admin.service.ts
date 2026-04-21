import { AdminCreateDto, AdminReadDto } from "@/lib/dtos/admin/admin.dto";
import adminRepo from "@/lib/repositories/admin.repo";
import { BadRequestError } from "@/lib/utils/error.util";
import { generateRandomString } from "@/lib/utils/security.utils";
import { hashPassword } from "../auth/auth-helpers.service";
import { adminReadDtoValidator } from "@/lib/validators/admin/admin.validator";
import { AdminCreateResponseMeta } from "./types";

export const createAdmin = async (
  dto: AdminCreateDto,
): Promise<[AdminReadDto, AdminCreateResponseMeta]> => {
  const exists = await adminRepo.getExistsByEmail(dto.email);
  if (exists) throw new BadRequestError("Email already exists");

  const password = dto.password
    ? dto.password
    : generateRandomString(10, { includeSymbols: true, caseSensitive: true });

  const hashedPassword = await hashPassword(password);

  const created = await adminRepo.create({
    ...dto,
    password: hashedPassword,
  });

  const readDto = await adminReadDtoValidator.parseAsync(created);
  const meta: AdminCreateResponseMeta = {
    password,
  };

  return [readDto, meta];
};
