import musicRepo from "@/lib/repositories/music.repo";
import {
  SunoMusicCallbackRequestBody,
  SunoMusicItem,
  UploadResult,
} from "./types";
import { BadRequestError } from "@/lib/utils/error.util";
import { upload } from "@/lib/utils/cloudinary.utils";
import { UploadApiErrorResponse } from "cloudinary";
import { reverseCredits } from "../base.service";
import taskRepo from "@/lib/repositories/task.repo";
import { prisma } from "@/lib/db/prisma";

export const generateMusicCallBack = async (
  body: SunoMusicCallbackRequestBody,
) => {
  const task = await taskRepo.getByReference(
    body.data.task_id,
    "Music",
    "Suno",
  );
  if (!task) throw new BadRequestError("Task not found");

  if (body.data.callbackType === "error") {
    // TODO: delete music on db
    // reverse credits
    await reverseCredits(task.userId ?? "xxx");
  } else if (body.data.callbackType === "complete") {
    // Upload
    const uploadMusics = async (
      musics: SunoMusicItem[],
    ): Promise<UploadResult[]> => {
      const uploads: Promise<UploadResult>[] = musics.map(async (music) => {
        try {
          const musicRes = await upload(
            music.audio_url,
            "generated-music/audios",
          );
          const imageRes = await upload(
            music.image_url,
            "generated-music/images",
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
      });

      return await Promise.all(uploads);
    };

    const uploadedMusics = await uploadMusics(body.data?.data ?? []);

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
            streamAudioUrl: musicData.stream_audio_url,
            audioUrl: uploadedMusic.uploadData.audio.url,
            audioAltUrl: uploadedMusic.inputData.audio_url,
            imageUrl: uploadedMusic.uploadData.image.url,
            imageAltUrl: uploadedMusic.inputData.image_url,
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
  }
};
