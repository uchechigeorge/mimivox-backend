import { generateVideoCallBack } from "./generate-video-callback.service";
import { generateVideo } from "./generate-video.service";
import { getVideo } from "./get-video.service";

const xaiVideoService = {
  generateVideo,
  generateVideoCallBack,
  getVideo,
};

export default xaiVideoService;
