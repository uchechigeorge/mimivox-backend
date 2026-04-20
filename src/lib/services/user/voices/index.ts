import cloneVoiceService from "./clone";
import { listVoices } from "./list-voices.service";
import listVoiceService from "./list";

const voiceService = {
  clone: cloneVoiceService,
  list: listVoiceService,
  getAllVoices: listVoices,
};

export default voiceService;
