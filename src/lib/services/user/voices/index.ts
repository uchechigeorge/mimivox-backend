import cloneService from "./clone";
import { getAllVoices } from "./get-all-voices.service";

const voiceService = {
  clone: cloneService,
  getAllVoices,
};

export default voiceService;
