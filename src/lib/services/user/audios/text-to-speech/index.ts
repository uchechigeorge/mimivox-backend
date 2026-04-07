import { generateViaElevenLabs } from "./generate-via-eleven-labs.service";
import { generateViaGoogle } from "./generate-via-google.service";

const textToSpeechService = {
  generateViaGoogle,
  generateViaElevenLabs,
};

export default textToSpeechService;
