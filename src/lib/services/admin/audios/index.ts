import { getAudio } from "./get-audio.service";
import { listAudios } from "./list-audios.service";

const audioService = {
  listAudios,
  getAudio,
};

export default audioService;
