import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

export interface XaiVideoGenerateRequestBody {
  prompt: string;
  model: string;
  duration?: number;
}

export interface XaiVideoData {
  url: string;
  duration: number;
  respect_moderation: boolean;
}

export interface XaiVideoUsage {
  cost_in_usd_ticks: number;
}

export interface XaiVideoGetResponse {
  status: string;
  video: XaiVideoData;
  model: string;
  usage: XaiVideoUsage;
  progress: number;
}

export interface XaiVideoGenerateResponse {
  request_id: string;
}

export type UploadVideoResult =
  | { success: true; input: XaiVideoData; upload: { video: UploadApiResponse } }
  | { success: false; input: XaiVideoData; err: UploadApiErrorResponse };
