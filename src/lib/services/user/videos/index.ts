import { getVideo } from "./get-video.service";
import { listVideos } from "./list-videos.service";
import runwayVideoService from "./runway";
import xaiVideoService from "./xai";

const videoService = {
  xai: xaiVideoService,
  runway: runwayVideoService,
  listVideos,
  getVideo,
};

export default videoService;
