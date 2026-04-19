import { generateMusicCallBack } from "./generate-music-callback.service";
import { generateMusic } from "./generate-music.service";
import { getMusic } from "./get-music.service";

const sunoService = {
  generateMusic,
  generateMusicCallBack,
  getMusic,
};

export default sunoService;
