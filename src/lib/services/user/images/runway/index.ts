import { generateImage } from "./generate-image.service";
import { getImage } from "./get-image.service";
import { listModels } from "./list-models.service";
import { processImageStatus } from "./process-image-status.service";
import { syncImageTask } from "./sync-image-task.service";

const runwayImageService = {
  generateImage,
  getImage,
  listModels,
  processImageStatus,
  syncImageTask,
};

export default runwayImageService;
