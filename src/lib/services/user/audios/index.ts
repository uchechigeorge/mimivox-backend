import elevenLabService from "./eleven-labs";
import { getAudio } from "./get-audio.service";
import googleService from "./google";
import { listAudios } from "./list-audios.service";
import textToSpeechService from "./text-to-speech";

const audioService = {
  textToSpeech: textToSpeechService,
  elevenLabs: elevenLabService,
  google: googleService,
  listAudios,
  getAudio,
};

export default audioService;
