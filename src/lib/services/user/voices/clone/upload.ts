import { env } from "@/lib/config/env.config";
import { UploadApiResponse } from "cloudinary";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const uploadStreamToCloudinary = async (
  buffer: Buffer,
): Promise<UploadApiResponse> => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video", // IMPORTANT for audio files
        folder: "mimivox/clone-samples",
        format: "mp3", // optional but recommended
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const uploadToCloudinary = async (file: string) => {
  const response = await cloudinary.uploader.upload(file, {
    resource_type: "video", // IMPORTANT for audio files
    folder: "mimivox/clone-samples",
    format: "mp3", // optional but recommended
  });

  return response;
};
