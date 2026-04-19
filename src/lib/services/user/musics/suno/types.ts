import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

export type SunoMusicGenerateRequestBody = {
  prompt: string;
  title: string;
  model: string;
  customMode: boolean;
  instrumental: boolean;
  callBackUrl: string;
  style: string;
  personaId: string;
  personaModel: string;
  negativeTags: string;
  vocalGender: string;
  styleWeight: number;
  weirdnessConstraint: number;
  audioWeight: number;
};

export type SunoMusicGenerateResponse = {
  code: number;
  msg: string;
  data: {
    taskId: string;
  };
};

export type SunoMusicItem = {
  id: string;
  audio_url: string;
  source_audio_url: string;
  stream_audio_url: string;
  source_stream_audio_url: string;
  image_url: string;
  source_image_url: string;
  prompt: string;
  model_name: string;
  title: string;
  tags: string;
  createTime: string;
  duration: number;
};

export type SunoMusicCallbackRequestBody = {
  code: number;
  msg: string;
  data: {
    callbackType: "complete" | "error";
    task_id: string;
    data: SunoMusicItem[] | null;
  };
};

export type UploadResult =
  | {
      success: true;
      inputData: SunoMusicItem;
      uploadData: {
        audio: UploadApiResponse;
        image: UploadApiResponse;
        stream?: UploadApiResponse;
      };
    }
  | { success: false; inputData: SunoMusicItem; err: UploadApiErrorResponse };
