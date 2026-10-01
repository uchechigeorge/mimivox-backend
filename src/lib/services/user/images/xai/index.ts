import { editImage } from "./edit-image.service";
import { generateImage } from "./generate-image.service";
import { listModels } from "./list-models.service";

const xaiImageService = {
  generateImage,
  editImage,
  listModels,
};

export default xaiImageService;
