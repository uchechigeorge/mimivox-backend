import { upload } from "@/lib/utils/cloudinary.utils";
import { UploadResult } from "./types";
import { UploadApiErrorResponse } from "cloudinary";
import { prisma } from "@/lib/db/prisma";
import musicRepo from "@/lib/repositories/music.repo";
import { Task } from "@/generated/prisma/client";
import { isNotNullOrWhitespace } from "@/lib/utils/type.utils";
import { notifyTaskFinished } from "@/lib/services/user/notifications/notify-task-finished.service";

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

  const completedNow = await prisma.$transaction(async (tx) => {
    // Only the call that completes the task sends the email
    const completed = await tx.task.updateMany({
      where: { id: task.id, status: { not: "Completed" } },
      data: {
        status: "Completed",
        completedAt: new Date(),
      },
    });

    for (let i = 0; i < uploadedMusics.length; i++) {
      const uploadedMusic = uploadedMusics[i];
      if (!uploadedMusic.success) continue;

      const musicData = uploadedMusic.inputData;
      const existingMusic = await musicRepo.getByReference(
        musicData.id,
        "Suno",
        tx,
      );
      if (existingMusic) continue;

      let title = musicData.title;
      if (!isNotNullOrWhitespace(title)) {
        let fallbackTitle: string | null | undefined;

        try {
          const log =
            typeof task.serviceRequestLog === "string"
              ? JSON.parse(task.serviceRequestLog)
              : task.serviceRequestLog;

          fallbackTitle = log?.body?.title;
        } catch {
          fallbackTitle = undefined;
        }

        title = isNotNullOrWhitespace(fallbackTitle)
          ? fallbackTitle
          : "Untitled Music";
      }

      await musicRepo.create(
        {
          userId: task.userId,
          userName: task.userName,
          prompt: musicData.prompt,
          title,
          durationInSeconds: musicData.duration,
          streamAudioUrl: musicData.streamAudioUrl,
          audioUrl: uploadedMusic.uploadData.audio.secure_url,
          audioAltUrl: musicData.audioUrl,
          imageUrl: uploadedMusic.uploadData.image.secure_url,
          imageAltUrl: musicData.imageUrl,
          musicServiceType: "Suno",
          musicServiceReferenceId: musicData.id,
          musicServiceRequestLog: task.serviceRequestLog!,
          taskId: task.id,
        },
        tx,
      );
    }

    return completed.count > 0;
  });

  if (completedNow) notifyTaskFinished(task, { succeeded: true });
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
