import { generateMusicCallBack } from "./generate-music-callback.service";
import { generateMusic } from "./generate-music.service";
import { getMusic } from "./get-music.service";
import { processMusicStatus } from "./process-music-status.service";

const sunoService = {
  generateMusic,
  generateMusicCallBack,
  getMusic,
  processMusicStatus,
};

export default sunoService;
