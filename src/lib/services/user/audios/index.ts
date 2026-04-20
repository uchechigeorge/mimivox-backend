import { listAudios } from "./list-audios.service";
import textToSpeechService from "./text-to-speech";

const audioService = {
  textToSpeech: textToSpeechService,
  listAudios,
};

export default audioService;
