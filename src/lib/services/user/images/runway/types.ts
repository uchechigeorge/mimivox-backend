import { RunwayGenerationStatus } from "../../videos/runway/types";

export type RunwayImageTaskLog = {
  endpoint: string;
  model: string;
  creditsPerImage: number;
  noOfImages?: number;
  quality?: string | null;
  qualityExtraPerImage?: number;
  body: Record<string, unknown> & { promptText?: string };
};

export interface RunwayImageGenerateResponse {
  id: string;
  status: RunwayGenerationStatus;
  model: string;
  credits: number;
}

export interface RunwayImageStatusResponse {
  id: string;
  status: RunwayGenerationStatus;
  progress: number;
  error?: string | null;
  data: { url: string | null }[];
}
