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

export type UploadResult<TInput> =
  | {
      success: true;
      inputData: TInput;
      uploadData: {
        audio: UploadApiResponse;
        image: UploadApiResponse;
        stream?: UploadApiResponse;
      };
    }
  | { success: false; inputData: TInput; err: UploadApiErrorResponse };

export type SunoMusicGenerateResponseItem = {
  id: string;
  audioUrl: string;
  sourceAudioUrl: string;
  streamAudioUrl: string;
  sourceStreamAudioUrl: string;
  imageUrl: string;
  sourceImageUrl: string;
  prompt: string;
  modelName: string;
  title: string;
  tags: string;
  createTime: number;
  duration: number;
};

export type SunoMusicGenerateResponsePayload = {
  taskId: string;
  parentMusicId: string;
  param: string;
  response: {
    taskId: string;
    sunoData: SunoMusicGenerateResponseItem[];
  };
  status: string;
  type: string;
  operationType: string;
  errorCode: string | null;
  errorMessage: string | null;
  createTime: number;
};

export type SunoMusicGenerateStatusResponse = {
  code: number;
  msg: string;
  data: SunoMusicGenerateResponsePayload;
};
