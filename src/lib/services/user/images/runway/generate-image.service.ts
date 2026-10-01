import { Prisma } from "@/generated/prisma/client";
import { UserAuthItems } from "@/lib/types";
import { BadRequestError, UnauthorizedError } from "@/lib/utils/error.util";
import { runwayImageGenerateValidator } from "@/lib/validators/user/image.validator";
import runwayService from "@/lib/services/shared/runway";
import {
  describeRatio,
  getImageModelCredits,
  getImageQualityExtra,
  toImageSurchargeTier,
  getRunwayImageModel,
} from "@/lib/services/shared/runway/models";
import { parseRunwayOptions } from "@/lib/services/shared/runway/options";
import taskRepo from "@/lib/repositories/task.repo";
import { reverseCredits, validate } from "../base.service";
import { RunwayImageGenerateResponse, RunwayImageTaskLog } from "./types";

// Prefer a 1K square, then any square, then whatever the model lists first
const getDefaultRatio = (ratios: string[]) => {
  const described = ratios.map((e) => describeRatio(e, "image"));
  return (
    described.find((e) => e.aspect === "1:1" && e.quality === "1K") ??
    described.find((e) => e.aspect === "1:1") ??
    described[0]
  )?.value;
};

export const generateImage = async (
  body: unknown,
  authItems: UserAuthItems,
): Promise<RunwayImageGenerateResponse> => {
  if (!authItems.userId) throw new UnauthorizedError();

  const dto = runwayImageGenerateValidator.parse(body);
  const model = getRunwayImageModel(dto.model);
  if (!model) throw new BadRequestError("Unsupported model");

  if (dto.prompt.length > model.maxPromptLength) {
    throw new BadRequestError(
      `Prompt is too long for ${model.label} (max ${model.maxPromptLength} characters)`,
    );
  }

  const images = dto.images ?? [];
  if (images.length > model.maxImages) {
    throw new BadRequestError(
      `${model.label} accepts at most ${model.maxImages} image(s)`,
    );
  }

  const ratio = dto.ratio ?? getDefaultRatio(model.ratios);
  if (!ratio || !model.ratios.includes(ratio)) {
    throw new BadRequestError(
      `${model.label} does not support the ${dto.ratio} ratio`,
    );
  }

  const options = parseRunwayOptions(model.options, dto.options, model.label);
  const supportsOutputCount = model.options.some(
    (e) => e.key === "outputCount",
  );
  if (supportsOutputCount && options.outputCount === undefined) {
    options.outputCount = 1;
  }
  const noOfImages = Number(options.outputCount ?? 1);

  // 2K and 4K images cost extra on top of the base rate
  const quality = describeRatio(ratio, "image").quality;
  const qualityExtraPerImage = getImageQualityExtra(
    model.id,
    toImageSurchargeTier(quality),
  );
  const creditsPerImage = getImageModelCredits(model.id) + qualityExtraPerImage;
  const user = await validate({
    prompt: dto.prompt,
    authItems,
    creditsPerImage,
    noOfImages,
  });

  try {
    const referenceImages = await Promise.all(
      images.map(async (image) => ({
        uri: await runwayService.resolveMediaUri(image),
      })),
    );

    const requestBody: RunwayImageTaskLog["body"] = {
      ...options,
      model: model.id,
      promptText: dto.prompt,
      ratio,
      ...(referenceImages.length && { referenceImages }),
    };

    const response = await runwayService.createTask(
      "text_to_image",
      requestBody,
    );

    const log: RunwayImageTaskLog = {
      endpoint: "text_to_image",
      model: model.id,
      creditsPerImage,
      noOfImages,
      quality,
      qualityExtraPerImage,
      body: requestBody,
    };

    const task = await taskRepo.create({
      userId: user.id,
      userName: user.fullName,
      referenceId: response.id,
      serviceOption: "Runway",
      type: "Image",
      serviceRequestLog: log as unknown as Prisma.InputJsonObject,
    });

    return {
      id: task.id,
      status: "pending",
      model: model.id,
      credits: noOfImages * creditsPerImage,
    };
  } catch (err) {
    await reverseCredits(authItems, undefined, creditsPerImage, noOfImages);
    throw err;
  }
};
