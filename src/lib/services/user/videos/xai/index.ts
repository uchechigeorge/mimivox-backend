import { generateVideoCallBack } from "./generate-video-callback.service";
import { generateVideo } from "./generate-video.service";
import { getVideo } from "./get-video.service";
import { listModels } from "./list-models.service";

const xaiVideoService = {
  generateVideo,
  generateVideoCallBack,
  getVideo,
  listModels,
};

export default xaiVideoService;
