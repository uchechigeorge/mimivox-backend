import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";
import { nDate, nNumber, nString } from "@/lib/utils/zod.utils";
import { runwayVideoModelIds } from "@/lib/services/shared/runway/models";

export const videoListParamsValidator = z.object({
  ...baseGetParamsSchema,
});

export const videoGetParamsValidator = z.object({
  id: z.guid(),
});

export const videoReadDtoValidator = z.object({
  id: nString,
  url: nString,
  altUrl: nString,
  title: nString,
  prompt: nString,
  durationInSeconds: nNumber,
  videoServiceType: nString,
  updatedAt: nDate,
  createdAt: nDate,
});

export const runwayVideoGenerateValidator = z.object({
  model: z.enum(runwayVideoModelIds),
  prompt: z.string().trim().min(1),
  duration: z.coerce.number().int().positive().optional(),
  // Exact Runway ratio, e.g. "1280:720" (see the models endpoint)
  ratio: z.string().optional(),
  // How uploaded images are used: start/end frames or style references
  imageMode: z.enum(["frames", "references"]).optional(),
  // https urls, runway:// uris or data uris
  images: z.array(z.string().min(1)).optional(),
  // Reference videos: https urls or runway:// uris from the uploads endpoint
  videos: z.array(z.string().min(1)).optional(),
  // Reference audio: https urls or runway:// uris from the uploads endpoint
  audios: z.array(z.string().min(1)).optional(),
  // Model specific options, e.g. { audio: true, seed: 42, resolution: "720p" }
  options: z.record(z.string(), z.unknown()).optional(),
});
