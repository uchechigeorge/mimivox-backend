import { getImage } from "./get-image.service";
import { listImages } from "./list-images.service";

const imageService = {
  listImages,
  getImage,
};

export default imageService;
