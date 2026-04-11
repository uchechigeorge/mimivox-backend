import cloneVoiceService from "./clone";
import { getAllVoices } from "./get-all-voices.service";
import listVoiceService from "./list";

const voiceService = {
  clone: cloneVoiceService,
  list: listVoiceService,
  getAllVoices,
};

export default voiceService;
