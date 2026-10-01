export type RunwayVideoTaskLog = {
  endpoint: string;
  model: string;
  duration: number;
  creditsPerSecond: number;
  withAudio?: boolean;
  quality?: string | null;
  qualityExtraPerSecond?: number;
  body: Record<string, unknown> & { promptText?: string };
};

export type RunwayGenerationStatus = "pending" | "running" | "done" | "failed";

export interface RunwayVideoGenerateResponse {
  id: string;
  status: RunwayGenerationStatus;
  model: string;
  duration: number;
  withAudio: boolean;
  credits: number;
}

export interface RunwayVideoStatusResponse {
  id: string;
  status: RunwayGenerationStatus;
  progress: number;
  error?: string | null;
  video?: { url: string | null; duration: number | null } | null;
}
