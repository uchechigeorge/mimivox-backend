import { getAudio } from "./get-audio.service";
import { listAudios } from "./list-audios.service";
import textToSpeechService from "./text-to-speech";

const audioService = {
  textToSpeech: textToSpeechService,
  listAudios,
  getAudio,
};

export default audioService;
