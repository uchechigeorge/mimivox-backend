import { env } from "@/lib/config/env.config";

export const listModels = () => [
  {
    id: "grok-imagine-video",
    label: "Grok Imagine",
    creditsPerSecond: env.CREDITS_PER_VIDEO_PER_SECOND,
  },
];
