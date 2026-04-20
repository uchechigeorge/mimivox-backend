import { upload } from "@/lib/utils/cloudinary.utils";
import { UploadResult } from "./types";
import { UploadApiErrorResponse } from "cloudinary";
import { prisma } from "@/lib/db/prisma";
import musicRepo from "@/lib/repositories/music.repo";
import { Task } from "@/generated/prisma/client";
import taskRepo from "@/lib/repositories/task.repo";

export const saveMusics = async (data: SaveMusicData) => {
  const { musicItems, task } = data;

  // Upload
  const uploadMusics = async (
    musics: MusicItem[],
  ): Promise<UploadResult<MusicItem>[]> => {
    const uploads: Promise<UploadResult<MusicItem>>[] = musics.map(
      async (music) => {
        try {
          const musicRes = await upload(
            music.audioUrl,
            "generated-music/audios",
            {
              resource_type: "video",
              format: "mp3",
            },
          );
          const imageRes = await upload(
            music.imageUrl,
            "generated-music/images",
            {
              resource_type: "image",
            },
          );
          return {
            success: true as const,
            inputData: music,
            uploadData: {
              audio: musicRes,
              image: imageRes,
            },
          };
        } catch (err) {
          return {
            success: false as const,
            inputData: music,
            err: err as UploadApiErrorResponse,
          };
        }
      },
    );

    return await Promise.all(uploads);
  };

  const uploadedMusics = await uploadMusics(musicItems);

  await prisma.$transaction(async (tx) => {
    for (let i = 0; i < uploadedMusics.length; i++) {
      const uploadedMusic = uploadedMusics[i];
      if (!uploadedMusic.success) continue;

      const musicData = uploadedMusic.inputData;
      await musicRepo.create(
        {
          userId: task.userId,
          userName: task.userName,
          prompt: musicData.prompt,
          title: musicData.title,
          durationInSeconds: musicData.duration,
          musicServiceType: "Suno",
          musicServiceReferenceId: musicData.id,
          streamAudioUrl: musicData.streamAudioUrl,
          audioUrl: uploadedMusic.uploadData.audio.url,
          audioAltUrl: musicData.audioUrl,
          imageUrl: uploadedMusic.uploadData.image.url,
          imageAltUrl: musicData.imageUrl,
          musicServiceRequestLog: task.serviceRequestLog!,
          taskId: task.id,
        },
        tx,
      );
    }

    await taskRepo.update(
      task.id,
      {
        status: "Completed",
      },
      tx,
    );
  });
};

type SaveMusicData = {
  musicItems: MusicItem[];
  task: Task;
};

type MusicItem = {
  id: string;
  audioUrl: string;
  streamAudioUrl: string;
  imageUrl: string;
  prompt: string;
  title: string;
  duration: number;
};
