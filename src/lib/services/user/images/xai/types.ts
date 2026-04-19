import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

export interface XaiImageRequestBody {
  model: "grok-imagine-image";
  prompt: string;
}

export interface XaiImageData {
  url: string;
  mime_type: string;
  revised_prompt: string;
}

export interface XaiUsage {
  cost_in_usd_ticks: number;
}

export interface XaiImageResponse {
  data: XaiImageData[];
  usage: XaiUsage;
}

export type UploadImageResult =
  | { success: true; image: XaiImageData; data: UploadApiResponse }
  | { success: false; image: XaiImageData; err: UploadApiErrorResponse };
