import {
  adminCreateDtoValidator,
  adminGetParamsValidator,
  adminListParamsValidator,
  adminReadDtoValidator,
} from "@/lib/validators/admin/admin.validator";
import z from "zod";

export type AdminListParams = z.infer<typeof adminListParamsValidator>;
export type AdminGetParams = z.infer<typeof adminGetParamsValidator>;

export type AdminReadDto = z.infer<typeof adminReadDtoValidator>;

export type AdminCreateDto = z.infer<typeof adminCreateDtoValidator>;
