import {
  describeRatio,
  getImageModelCredits,
  getImageModelSurchargeTiers,
  getImageQualityExtra,
  getRunwayImageModel,
  runwayImageModels,
} from "@/lib/services/shared/runway/models";

export const listModels = () =>
  runwayImageModels.map(({ id }) => {
    const model = getRunwayImageModel(id)!;

    return {
      id: model.id,
      label: model.label,
      family: model.family,
      creditsPerImage: getImageModelCredits(model.id),
      // Extra credits per image by quality tier, e.g. { "2K": 100, "4K": 250 }
      qualityExtraPerImage: Object.fromEntries(
        getImageModelSurchargeTiers(model.id).map((tier) => [
          tier,
          getImageQualityExtra(model.id, tier),
        ]),
      ),
      maxPromptLength: model.maxPromptLength,
      maxImages: model.maxImages,
      ratios: model.ratios.map((e) => describeRatio(e, "image")),
      options: model.options,
    };
  });
