import { env } from "@/lib/config/env.config";
import { runwayImageModelSpecs, runwayVideoModelSpecs } from "./model-specs";
import {
  RunwayDurations,
  RunwayModelInfo,
  RunwayOptionSpec,
  RunwayRatioOption,
} from "./types";

export const runwayVideoModels: RunwayModelInfo[] = [
  { id: "seedance2_5", label: "Seedance 2.5", family: "Seedance" },
  { id: "seedance2", label: "Seedance 2", family: "Seedance" },
  { id: "seedance2_fast", label: "Seedance 2 Fast", family: "Seedance" },
  { id: "seedance2_mini", label: "Seedance 2 Mini", family: "Seedance" },
  { id: "wan3", label: "Wan 3.0", family: "Wan" },
  { id: "wan3_prime", label: "Wan 3.0 Prime", family: "Wan" },
  { id: "grok_imagine_1_5", label: "Grok Imagine 1.5", family: "Grok Imagine" },
  {
    id: "gemini_omni_flash_1.1",
    label: "Gemini Omni Flash 1.1",
    family: "Gemini",
  },
  { id: "gemini_omni_flash", label: "Gemini Omni Flash", family: "Gemini" },
  { id: "veo3.1", label: "Veo 3.1", family: "Veo" },
  { id: "veo3.1_fast", label: "Veo 3.1 Fast", family: "Veo" },
];

export const runwayImageModels: RunwayModelInfo[] = [
  {
    id: "gpt_image_2_5_sunburst",
    label: "GPT Image 2.5 Sunburst",
    family: "GPT Image",
  },
  {
    id: "gpt_image_2_5_flare",
    label: "GPT Image 2.5 Flare",
    family: "GPT Image",
  },
  { id: "gpt_image_2", label: "GPT Image 2", family: "GPT Image" },
  {
    id: "gemini_image3.1_flash",
    label: "Nano Banana 2",
    family: "Nano Banana",
  },
  { id: "gemini_image3_pro", label: "Nano Banana Pro", family: "Nano Banana" },
  { id: "gemini_2.5_flash", label: "Nano Banana", family: "Nano Banana" },
];

export const runwayVideoModelIds = runwayVideoModels.map((e) => e.id) as [
  string,
  ...string[],
];

export const runwayImageModelIds = runwayImageModels.map((e) => e.id) as [
  string,
  ...string[],
];

export const getRunwayVideoModel = (id: string) => {
  const info = runwayVideoModels.find((e) => e.id === id);
  const spec = runwayVideoModelSpecs[id];
  return info && spec ? { ...info, ...spec } : undefined;
};

export const getRunwayImageModel = (id: string) => {
  const info = runwayImageModels.find((e) => e.id === id);
  const spec = runwayImageModelSpecs[id];
  return info && spec ? { ...info, ...spec } : undefined;
};

// "veo3.1_fast" -> "VEO3_1_FAST"
export const toEnvKey = (modelId: string) =>
  modelId.toUpperCase().replace(/[^A-Z0-9]+/g, "_");

const readNumberEnv = (key: string) => {
  const value = Number(process.env[key]);
  return Number.isFinite(value) && value > 0 ? value : undefined;
};

// CREDITS_PER_VIDEO_<MODEL>_PER_SECOND, falling back to the shared default
export const getVideoModelCreditsPerSecond = (modelId: string) =>
  readNumberEnv(`CREDITS_PER_VIDEO_${toEnvKey(modelId)}_PER_SECOND`) ??
  env.CREDITS_PER_VIDEO_MODEL_PER_SECOND;

// CREDITS_PER_VIDEO_<MODEL>_WITH_AUDIO_PER_SECOND, falling back to the
// model's rate without audio
export const getVideoModelCreditsPerSecondWithAudio = (modelId: string) =>
  readNumberEnv(
    `CREDITS_PER_VIDEO_${toEnvKey(modelId)}_WITH_AUDIO_PER_SECOND`,
  ) ?? getVideoModelCreditsPerSecond(modelId);

// Whether the model has an audio switch on either endpoint
export const videoModelSupportsAudio = (modelId: string) => {
  const spec = runwayVideoModelSpecs[modelId];
  return [spec?.text, spec?.image].some((e) =>
    e?.options.some((o) => o.key === "audio"),
  );
};

// Audio is on when requested, otherwise when the model generates it by default
export const isAudioEnabled = (
  specOptions: RunwayOptionSpec[],
  options: Record<string, unknown>,
) => {
  const audio = specOptions.find((o) => o.key === "audio");
  if (!audio) return false;
  return Boolean(options.audio ?? audio.default ?? false);
};

// CREDITS_PER_IMAGE_<MODEL>, falling back to the shared default
export const getImageModelCredits = (modelId: string) =>
  readNumberEnv(`CREDITS_PER_IMAGE_${toEnvKey(modelId)}`) ??
  env.CREDITS_PER_IMAGE_MODEL;

// Snap a requested duration to the closest value the model accepts
export const fitVideoDuration = (
  durations: RunwayDurations,
  duration: number,
) => {
  const seconds = Math.floor(duration);

  if (Array.isArray(durations)) {
    const allowed = [...durations].sort((a, b) => a - b);
    const lower = allowed.filter((e) => e <= seconds);
    return lower.length ? lower[lower.length - 1] : allowed[0];
  }

  return Math.min(Math.max(seconds, durations.min), durations.max);
};

export const getMinVideoDuration = (durations: RunwayDurations) =>
  Array.isArray(durations) ? Math.min(...durations) : durations.min;

const aspects: [string, number][] = [
  ["8:1", 8],
  ["4:1", 4],
  ["21:9", 21 / 9],
  ["2:1", 2],
  ["16:9", 16 / 9],
  ["3:2", 3 / 2],
  ["4:3", 4 / 3],
  ["5:4", 5 / 4],
  ["1:1", 1],
  ["4:5", 4 / 5],
  ["3:4", 3 / 4],
  ["2:3", 2 / 3],
  ["9:16", 9 / 16],
  ["1:2", 1 / 2],
  ["9:21", 9 / 21],
  ["1:4", 1 / 4],
  ["1:8", 1 / 8],
];

const closestAspect = (ratio: number) =>
  aspects.reduce((best, current) =>
    Math.abs(Math.log(current[1] / ratio)) < Math.abs(Math.log(best[1] / ratio))
      ? current
      : best,
  )[0];

// Video quality tiers by pixel count
const videoTiers: [string, number][] = [
  ["480p", 854 * 480],
  ["720p", 1280 * 720],
  ["1080p", 1920 * 1080],
  ["1440p", 2560 * 1440],
  ["4K", 3840 * 2160],
];

const closestVideoTier = (pixels: number) =>
  videoTiers.reduce((best, current) =>
    Math.abs(Math.log(current[1] / pixels)) <
    Math.abs(Math.log(best[1] / pixels))
      ? current
      : best,
  )[0];

// Image quality tiers by the longest side
const imageTier = (longSide: number) =>
  longSide <= 768
    ? "0.5K"
    : longSide <= 1536
      ? "1K"
      : longSide <= 3072
        ? "2K"
        : "4K";

// "1280:720" -> { aspect: "16:9", quality: "720p" }; "16:9" -> { aspect: "16:9", quality: null }
export const describeRatio = (
  value: string,
  kind: "video" | "image",
): RunwayRatioOption => {
  const [w, h] = value.split(":").map(Number);
  const isPixels = w > 32 && h > 32;

  if (!isPixels) return { value, aspect: value, quality: null };

  return {
    value,
    aspect: closestAspect(w / h),
    quality:
      kind === "video" ? closestVideoTier(w * h) : imageTier(Math.max(w, h)),
  };
};

// Surcharges may be 0, so unlike rates they accept any non-negative number
const readSurchargeEnv = (key: string) => {
  const raw = process.env[key];
  if (raw === undefined || raw.trim() === "") return undefined;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : undefined;
};

export type VideoSurchargeTier = "1080p" | "4K";
export type ImageSurchargeTier = "2K" | "4K";

// Maps a quality label ("1080p", "1440p", "4K", "720p"...) to the tier we charge extra for
export const toVideoSurchargeTier = (
  quality: string | null | undefined,
): VideoSurchargeTier | null => {
  const value = quality?.toLowerCase();
  if (value === "1080p" || value === "1440p") return "1080p";
  if (value === "4k" || value === "2160p") return "4K";
  return null;
};

export const toImageSurchargeTier = (
  quality: string | null | undefined,
): ImageSurchargeTier | null =>
  quality === "2K" || quality === "4K" ? quality : null;

// Quality of a video request: from the ratio size, or the resolution option
export const getVideoRequestQuality = (
  ratio: string | undefined,
  options: Record<string, unknown>,
) =>
  (ratio && describeRatio(ratio, "video").quality) ||
  (typeof options.resolution === "string" ? options.resolution : null);

// CREDITS_PER_VIDEO_<MODEL>_<1080P|4K>_EXTRA_PER_SECOND, added to the per second rate
export const getVideoQualityExtraPerSecond = (
  modelId: string,
  tier: VideoSurchargeTier | null,
) => {
  if (!tier) return 0;
  const suffix = tier === "1080p" ? "1080P" : "4K";

  return (
    readSurchargeEnv(
      `CREDITS_PER_VIDEO_${toEnvKey(modelId)}_${suffix}_EXTRA_PER_SECOND`,
    ) ??
    (tier === "1080p"
      ? env.CREDITS_PER_VIDEO_MODEL_1080P_EXTRA_PER_SECOND
      : env.CREDITS_PER_VIDEO_MODEL_4K_EXTRA_PER_SECOND)
  );
};

// CREDITS_PER_IMAGE_<MODEL>_<2K|4K>_EXTRA, added to the per image rate
export const getImageQualityExtra = (
  modelId: string,
  tier: ImageSurchargeTier | null,
) => {
  if (!tier) return 0;

  return (
    readSurchargeEnv(`CREDITS_PER_IMAGE_${toEnvKey(modelId)}_${tier}_EXTRA`) ??
    (tier === "2K"
      ? env.CREDITS_PER_IMAGE_MODEL_2K_EXTRA
      : env.CREDITS_PER_IMAGE_MODEL_4K_EXTRA)
  );
};

// Surcharged tiers a video model can produce
export const getVideoModelSurchargeTiers = (modelId: string) => {
  const spec = runwayVideoModelSpecs[modelId];
  const tiers = new Set<VideoSurchargeTier>();

  for (const endpoint of [spec?.text, spec?.image]) {
    if (!endpoint) continue;
    endpoint.ratios.forEach((ratio) => {
      const tier = toVideoSurchargeTier(describeRatio(ratio, "video").quality);
      if (tier) tiers.add(tier);
    });
    endpoint.options
      .find((o) => o.key === "resolution")
      ?.values?.forEach((value) => {
        const tier = toVideoSurchargeTier(String(value));
        if (tier) tiers.add(tier);
      });
  }

  return (["1080p", "4K"] as const).filter((e) => tiers.has(e));
};

// Surcharged tiers an image model can produce
export const getImageModelSurchargeTiers = (modelId: string) => {
  const spec = runwayImageModelSpecs[modelId];
  const tiers = new Set(
    spec?.ratios.map((ratio) =>
      toImageSurchargeTier(describeRatio(ratio, "image").quality),
    ),
  );

  return (["2K", "4K"] as const).filter((e) => tiers.has(e));
};
