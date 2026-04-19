import { upload } from "@/lib/utils/cloudinary.utils";
import { UploadImageResult, XaiImageData, XaiImageResponse } from "./types";
import { UploadApiErrorResponse } from "cloudinary";
import imageRepo from "@/lib/repositories/image.repo";
import { User } from "@/generated/prisma/client";

export const createImages = async (
  response: XaiImageResponse,
  user: User,
  prompt: string,
  log?: any,
) => {
  // Upload images
  const uploadImages = async (
    images: XaiImageData[],
  ): Promise<UploadImageResult[]> => {
    const uploads: Promise<UploadImageResult>[] = images.map(async (image) => {
      try {
        const res = await upload(image.url, "generated-images");
        return {
          success: true as const,
          image,
          data: res,
        };
      } catch (err) {
        return {
          success: false as const,
          image,
          err: err as UploadApiErrorResponse,
        };
      }
    });

    return await Promise.all(uploads);
  };

  const uploadedImages = await uploadImages(response.data);
  for (let i = 0; i < uploadedImages.length; i++) {
    const uploadedImage = uploadedImages[i];
    if (!uploadedImage.success) continue;

    await imageRepo.create({
      prompt: prompt ?? "",
      title: uploadedImage.image.revised_prompt ?? "",
      url: uploadedImage.image.url,
      altUrl: uploadedImage.data.url,
      imageServiceType: "Xai",
      userId: user.id,
      userName: user.fullName,
      imageServiceRequestLog: log,
    });
  }
};
