export type GoogleTTSDto = {
  audioConfig: {
    audioEncoding: string;
    pitch: number;
    speakingRate: number;
  };
  input: {
    text: string;
  };
  voice: {
    languageCode: string;
    name: string;
  };
};

export type ElevenLabsTTSDto = {
  text: string;
};
