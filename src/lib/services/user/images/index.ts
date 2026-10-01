import { getImage } from "./get-image.service";
import { listImages } from "./list-images.service";
import runwayImageService from "./runway";
import xaiImageService from "./xai";

const imageService = {
  xai: xaiImageService,
  runway: runwayImageService,
  listImages,
  getImage,
};

export default imageService;
