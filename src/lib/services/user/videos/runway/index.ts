import { generateVideo } from "./generate-video.service";
import { getVideo } from "./get-video.service";
import { listModels } from "./list-models.service";
import { processVideoStatus } from "./process-video-status.service";
import { syncVideoTask } from "./sync-video-task.service";

const runwayVideoService = {
  generateVideo,
  getVideo,
  listModels,
  processVideoStatus,
  syncVideoTask,
};

export default runwayVideoService;
