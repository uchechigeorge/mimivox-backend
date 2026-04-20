import { getVideo } from "./get-video.service";
import { listVideos } from "./list-videos.service";
import xaiVideoService from "./xai";

const videoService = {
  xai: xaiVideoService,
  listVideos,
  getVideo,
};

export default videoService;
