import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";
import { dateRangeParamsSchema } from "../shared/date-range-params.validator";
import { nDate, nString } from "@/lib/utils/zod.utils";
import { runwayImageModelIds } from "@/lib/services/shared/runway/models";

export const imageListParamsValidator = z.object({
  ...baseGetParamsSchema,
  ...dateRangeParamsSchema,
});

export const imageGetParamsValidator = z.object({
  id: z.guid(),
});

export const imageReadDtoValidator = z.object({
  id: nString,
  url: nString,
  altUrl: nString,
  title: nString,
  prompt: nString,
  imageServiceType: nString,
  updatedAt: nDate,
  createdAt: nDate,
});

export const runwayImageGenerateValidator = z.object({
  model: z.enum(runwayImageModelIds),
  prompt: z.string().trim().min(1),
  // Exact Runway ratio, e.g. "1024:1024" (see the models endpoint)
  ratio: z.string().optional(),
  // https urls, runway:// uris or data uris
  images: z.array(z.string().min(1)).optional(),
  // Model specific options, e.g. { quality: "high", outputCount: 2 }
  options: z.record(z.string(), z.unknown()).optional(),
});
