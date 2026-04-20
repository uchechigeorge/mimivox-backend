import { SunoMusicCallbackRequestBody } from "./types";
import { BadRequestError } from "@/lib/utils/error.util";
import { reverseCredits } from "../base.service";
import taskRepo from "@/lib/repositories/task.repo";
import { saveMusics } from "./save-musics.service";

export const generateMusicCallBack = async (
  body: SunoMusicCallbackRequestBody,
) => {
  const task = await taskRepo.getByReference(
    body.data.task_id,
    "Music",
    "Suno",
  );
  if (!task) throw new BadRequestError("Task not found");

  if (task.status === "Pending") return;

  if (body.data.callbackType === "error") {
    // reverse credits
    await taskRepo.update(task.id, {
      errorMessage: body.msg,
      status: "Completed",
    });

    await reverseCredits(task.userId ?? "");
  } else if (body.data.callbackType === "complete" && body.data.data) {
    saveMusics({
      task,
      musicItems: body.data.data.map((e) => {
        return {
          audioUrl: e.audio_url,
          duration: e.duration,
          id: e.id,
          imageUrl: e.image_url,
          prompt: e.prompt,
          streamAudioUrl: e.stream_audio_url,
          title: e.title,
        };
      }),
    });
  }
};
