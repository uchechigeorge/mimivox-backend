import { Prisma } from "@/generated/prisma/client";
import { UserAuthItems } from "@/lib/types";
import { BadRequestError, UnauthorizedError } from "@/lib/utils/error.util";
import { runwayVideoGenerateValidator } from "@/lib/validators/user/video.validator";
import runwayService from "@/lib/services/shared/runway";
import {
  describeRatio,
  fitVideoDuration,
  getMinVideoDuration,
  getRunwayVideoModel,
  getVideoModelCreditsPerSecond,
  getVideoModelCreditsPerSecondWithAudio,
  getVideoQualityExtraPerSecond,
  getVideoRequestQuality,
  toVideoSurchargeTier,
  isAudioEnabled,
} from "@/lib/services/shared/runway/models";
import { parseRunwayOptions } from "@/lib/services/shared/runway/options";
import taskRepo from "@/lib/repositories/task.repo";
import { reverseCredits, validate } from "../base.service";
import { RunwayVideoGenerateResponse, RunwayVideoTaskLog } from "./types";

const defaultDuration = 5;

// Prefer 720p 16:9, then any 16:9, then whatever the model lists first
const getDefaultRatio = (ratios: string[]) => {
  const described = ratios.map((e) => describeRatio(e, "video"));
  return (
    described.find((e) => e.aspect === "16:9" && e.quality === "720p") ??
    described.find((e) => e.aspect === "16:9") ??
    described[0]
  )?.value;
};

export const generateVideo = async (
  body: unknown,
  authItems: UserAuthItems,
): Promise<RunwayVideoGenerateResponse> => {
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const dto = runwayVideoGenerateValidator.parse(body);
  const model = getRunwayVideoModel(dto.model);
  if (!model) throw new BadRequestError("Unsupported model");

  const images = dto.images ?? [];
  const useReferences = images.length > 0 && dto.imageMode === "references";
  const endpoint =
    images.length && !useReferences ? "image_to_video" : "text_to_video";
  const spec = endpoint === "image_to_video" ? model.image : model.text;

  if (dto.prompt.length > spec.maxPromptLength) {
    throw new BadRequestError(
      `Prompt is too long for ${model.label} (max ${spec.maxPromptLength} characters)`,
    );
  }

  const maxImages = useReferences
    ? (model.text.maxReferences ?? 0)
    : (model.image.maxImages ?? 1);
  if (useReferences && !maxImages) {
    throw new BadRequestError(
      `${model.label} does not support reference images`,
    );
  }
  if (images.length > maxImages) {
    throw new BadRequestError(
      `${model.label} accepts at most ${maxImages} image(s)`,
    );
  }

  const videos = dto.videos ?? [];
  const maxVideos = spec.maxReferenceVideos ?? 0;
  if (videos.length && !maxVideos) {
    throw new BadRequestError(
      images.length
        ? `${model.label} does not support reference videos together with these images`
        : `${model.label} does not support reference videos`,
    );
  }
  if (videos.length > maxVideos) {
    throw new BadRequestError(
      `${model.label} accepts at most ${maxVideos} reference video(s)`,
    );
  }

  const audios = dto.audios ?? [];
  const maxAudios = spec.maxReferenceAudio ?? 0;
  if (audios.length && !maxAudios) {
    throw new BadRequestError(
      `${model.label} does not support reference audio${images.length ? " together with these images" : ""}`,
    );
  }
  if (audios.length > maxAudios) {
    throw new BadRequestError(
      `${model.label} accepts at most ${maxAudios} reference audio clip(s)`,
    );
  }
  if (audios.length && spec.referenceAudioRequiresImage && !useReferences) {
    throw new BadRequestError(
      `${model.label} needs at least one reference image to use reference audio`,
    );
  }

  let ratio: string | undefined;
  if (spec.ratios.length) {
    ratio = dto.ratio ?? getDefaultRatio(spec.ratios);
    if (!ratio || !spec.ratios.includes(ratio)) {
      throw new BadRequestError(
        `${model.label} does not support the ${dto.ratio} ratio`,
      );
    }
  }

  const options = parseRunwayOptions(spec.options, dto.options, model.label);

  if (!spec.durations) throw new BadRequestError("Unsupported model");
  const withAudio = isAudioEnabled(spec.options, options);
  const baseCreditsPerSecond = withAudio
    ? getVideoModelCreditsPerSecondWithAudio(model.id)
    : getVideoModelCreditsPerSecond(model.id);
  // 1080p and 4K cost extra per second on top of the base rate
  const quality = getVideoRequestQuality(ratio, options);
  const qualityExtraPerSecond = getVideoQualityExtraPerSecond(
    model.id,
    toVideoSurchargeTier(quality),
  );
  const creditsPerSecond = baseCreditsPerSecond + qualityExtraPerSecond;
  let duration = fitVideoDuration(
    spec.durations,
    dto.duration ?? defaultDuration,
  );

  const validation = await validate({
    prompt: dto.prompt,
    authItems,
    duration,
    creditsPerSecond,
  });

  try {
    // validate may shorten the duration when the user is low on credits
    if (validation.duration && validation.duration < duration) {
      if (
        Math.floor(validation.duration) < getMinVideoDuration(spec.durations)
      ) {
        throw new BadRequestError("Not enough credits");
      }
      duration = fitVideoDuration(spec.durations, validation.duration);
    }

    const uris = await Promise.all(images.map(runwayService.resolveMediaUri));

    const videoUris = await Promise.all(
      videos.map(runwayService.resolveMediaUri),
    );

    const audioUris = await Promise.all(
      audios.map(runwayService.resolveMediaUri),
    );

    const imageFields: Record<string, unknown> = {};
    if (audioUris.length) {
      imageFields.referenceAudio = audioUris.map((uri) => ({
        type: "audio",
        uri,
      }));
    }
    if (videoUris.length) {
      imageFields.referenceVideos = videoUris.map((uri) =>
        spec.referenceVideoTyped ? { type: "video", uri } : { uri },
      );
    }
    if (useReferences) {
      imageFields.references = uris.map((uri) => ({ uri }));
    } else if (uris.length === 1) {
      imageFields.promptImage = uris[0];
    } else if (uris.length > 1) {
      imageFields.promptImage =
        model.image.imageMode === "keyframes"
          ? uris.map((uri, i) => ({
              uri,
              position: i === 0 ? "first" : "last",
            }))
          : uris.map((uri) => ({ uri }));
    }

    const requestBody: RunwayVideoTaskLog["body"] = {
      ...options,
      model: model.id,
      promptText: dto.prompt,
      duration,
      ...(ratio && { ratio }),
      ...imageFields,
    };

    const response = await runwayService.createTask(endpoint, requestBody);

    const log: RunwayVideoTaskLog = {
      endpoint,
      model: model.id,
      duration,
      creditsPerSecond,
      withAudio,
      quality,
      qualityExtraPerSecond,
      body: requestBody,
    };

    const task = await taskRepo.create({
      userId: validation.user.id,
      userName: validation.user.fullName,
      referenceId: response.id,
      serviceOption: "Runway",
      type: "Video",
      serviceRequestLog: log as unknown as Prisma.InputJsonObject,
    });

    return {
      id: task.id,
      status: "pending",
      model: model.id,
      duration,
      withAudio,
      credits: duration * creditsPerSecond,
    };
  } catch (err) {
    await reverseCredits(userId);
    throw err;
  }
};
