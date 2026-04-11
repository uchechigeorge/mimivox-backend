import { UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.config";

export const uploadAudioStream = async (
  buffer: Buffer,
  folder: string,
): Promise<UploadApiResponse> => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video", // for audio files
        folder: `mimivox/${folder}`,
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

export const uploadAudio = async (file: string, folder: string) => {
  const response = await cloudinary.uploader.upload(file, {
    resource_type: "video", // for audio files
    folder: `mimivox/${folder}`,
    format: "mp3",
  });

  return response;
};
