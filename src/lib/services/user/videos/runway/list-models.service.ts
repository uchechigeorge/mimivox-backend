import {
  describeRatio,
  getRunwayVideoModel,
  getVideoModelCreditsPerSecond,
  getVideoModelCreditsPerSecondWithAudio,
  getVideoModelSurchargeTiers,
  getVideoQualityExtraPerSecond,
  runwayVideoModels,
  videoModelSupportsAudio,
} from "@/lib/services/shared/runway/models";
import { RunwayVideoEndpointSpec } from "@/lib/services/shared/runway/types";

const toEndpoint = (spec: RunwayVideoEndpointSpec) => ({
  maxPromptLength: spec.maxPromptLength,
  durations: spec.durations,
  ratios: spec.ratios.map((e) => describeRatio(e, "video")),
  options: spec.options,
  maxReferenceVideos: spec.maxReferenceVideos ?? 0,
  maxReferenceVideoSeconds: spec.maxReferenceVideoSeconds ?? null,
  maxReferenceAudio: spec.maxReferenceAudio ?? 0,
  maxReferenceAudioSeconds: spec.maxReferenceAudioSeconds ?? null,
  referenceAudioClipSeconds: spec.referenceAudioClipSeconds ?? null,
  referenceAudioRequiresImage: spec.referenceAudioRequiresImage ?? false,
});

export const listModels = () =>
  runwayVideoModels.map(({ id }) => {
    const model = getRunwayVideoModel(id)!;

    return {
      id: model.id,
      label: model.label,
      family: model.family,
      creditsPerSecond: getVideoModelCreditsPerSecond(model.id),
      // null when the model has no audio switch
      creditsPerSecondWithAudio: videoModelSupportsAudio(model.id)
        ? getVideoModelCreditsPerSecondWithAudio(model.id)
        : null,
      // Extra credits per second by quality tier, e.g. { "1080p": 250, "4K": 750 }
      qualityExtraPerSecond: Object.fromEntries(
        getVideoModelSurchargeTiers(model.id).map((tier) => [
          tier,
          getVideoQualityExtraPerSecond(model.id, tier),
        ]),
      ),
      // Settings without images (text_to_video)
      text: toEndpoint(model.text),
      // Settings when images are used as start/end frames (image_to_video)
      image: {
        ...toEndpoint(model.image),
        imageMode: model.image.imageMode,
        maxImages: model.image.maxImages,
      },
      // Images used as style/subject references on text_to_video
      maxReferences: model.text.maxReferences ?? 0,
    };
  });
