import { getImage } from "./get-image.service";
import { listImages } from "./list-images.service";
import xaiImageService from "./xai";

const imageService = {
  xai: xaiImageService,
  listImages,
  getImage,
};

export default imageService;
