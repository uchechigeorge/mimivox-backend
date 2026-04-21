import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";
import {
  nBoolean,
  nDate,
  nString,
  rString,
  stringToOptionalBoolean,
} from "@/lib/utils/zod.utils";

export const adminListParamsValidator = z.object({
  ...baseGetParamsSchema,
  blocked: stringToOptionalBoolean,
});

export const adminGetParamsValidator = z.object({
  id: z.guid(),
});

export const adminReadDtoValidator = z.object({
  id: nString,
  email: nString,
  emailVerified: nBoolean,
  firstName: nString,
  lastName: nString,
  fullName: nString,
  dpUrl: nString,
  blocked: nBoolean,
  updatedAt: nDate,
  createdAt: nDate,
});

export const adminCreateDtoValidator = z.object({
  email: rString,
  password: z.string().optional(),
  firstName: rString,
  lastName: rString,
  phoneNumber: z.string().optional(),
});
