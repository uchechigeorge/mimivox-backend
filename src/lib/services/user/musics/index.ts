import { getMusic } from "./get-music.service";
import { listMusics } from "./list-musics.service";
import sunoService from "./suno";

const musicService = {
  suno: sunoService,
  listMusics,
  getMusic,
};

export default musicService;
