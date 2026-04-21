import { getVideo } from "./get-video.service";
import { listVideos } from "./list-videos.service";

const videoService = {
  listVideos,
  getVideo,
};

export default videoService;
