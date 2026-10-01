export type RunwayTaskStatus =
  | "PENDING"
  | "THROTTLED"
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELLED";

export interface RunwayTaskCreateResponse {
  id: string;
  estimatedCost?: { credits: number };
}

export interface RunwayTask {
  id: string;
  createdAt: string;
  status: RunwayTaskStatus;
  progress?: number;
  output?: string[];
  failure?: string;
  failureCode?: string;
}

export interface RunwayUploadResponse {
  uploadUrl: string;
  fields: Record<string, string>;
  runwayUri: string;
}

export type RunwayErrorResponse = {
  error: string;
  issues?: unknown[];
  docUrl?: string;
};

// A model parameter we pass through to Runway as-is (audio, seed, quality...)
export type RunwayOptionSpec = {
  key: string;
  description: string;
  type: "boolean" | "select" | "integer" | "text";
  values?: (string | number)[];
  min?: number;
  max?: number;
  maxLength?: number;
  default?: unknown;
};

export type RunwayDurations = { min: number; max: number } | number[];

export type RunwayVideoEndpointSpec = {
  maxPromptLength: number;
  ratios: string[];
  durations: RunwayDurations | null;
  options: RunwayOptionSpec[];
  // text_to_video: reference images accepted via `references`
  maxReferences?: number;
  // Reference videos accepted via `referenceVideos`
  maxReferenceVideos?: number;
  // Whether each reference video needs `type: "video"`
  referenceVideoTyped?: boolean;
  // Combined length limit for all reference videos
  maxReferenceVideoSeconds?: number;
  // Reference audio accepted via `referenceAudio`
  maxReferenceAudio?: number;
  // Combined length limit for all reference audio
  maxReferenceAudioSeconds?: number;
  // Per clip length limits
  referenceAudioClipSeconds?: { min: number; max: number };
  // Audio references only work together with reference images
  referenceAudioRequiresImage?: boolean;
  // image_to_video: how prompt images are used and how many are accepted
  imageMode?: "single" | "keyframes" | "references";
  maxImages?: number;
};

export type RunwayVideoModelSpec = {
  text: RunwayVideoEndpointSpec;
  image: RunwayVideoEndpointSpec;
};

export type RunwayImageModelSpec = {
  maxPromptLength: number;
  ratios: string[];
  durations: null;
  options: RunwayOptionSpec[];
  maxImages: number;
};

export type RunwayModelInfo = {
  id: string;
  label: string;
  family: string;
};

export type RunwayRatioOption = {
  value: string;
  aspect: string;
  quality: string | null;
};
