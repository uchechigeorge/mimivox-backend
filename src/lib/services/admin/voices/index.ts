import { getVoice } from "./get-voice.service";
import { listVoices } from "./list-voices.service";

const voiceService = {
  listVoices,
  getVoice,
};

export default voiceService;
