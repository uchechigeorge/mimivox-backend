import { getAllAudios } from "./get-all-audios.service";
import textToSpeechService from "./text-to-speech";

const audioService = {
  textToSpeech: textToSpeechService,
  getAllAudios,
};

export default audioService;
