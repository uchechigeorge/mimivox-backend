import { env } from "@/lib/config/env.config";

export const listModels = () => [
  {
    id: "grok-imagine-image",
    label: "Grok Imagine",
    creditsPerImage: env.CREDITS_PER_IMAGE,
  },
];
