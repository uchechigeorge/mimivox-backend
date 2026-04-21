import { getMusic } from "./get-music.service";
import { listMusics } from "./list-musics.service";

const musicService = {
  listMusics,
  getMusic,
};

export default musicService;
