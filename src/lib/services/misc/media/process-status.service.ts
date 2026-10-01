import runwayImageService from "@/lib/services/user/images/runway";
import musicService from "@/lib/services/user/musics";
import runwayVideoService from "@/lib/services/user/videos/runway";
import xaiVideoService from "@/lib/services/user/videos/xai";
import taskRepo from "@/lib/repositories/task.repo";

// xAI has no status worker of its own; reuse its callback per pending task
const processXaiVideoStatus = async (maxTasksToProcess: number) => {
  const tasks = (await taskRepo.listByStatus("Pending", "Video", "Xai")).slice(
    0,
    maxTasksToProcess,
  );
  const results: { id: string; status: string; error?: string }[] = [];

  for (const task of tasks) {
    try {
      const video = await xaiVideoService.generateVideoCallBack(
        task.referenceId,
        undefined,
        task,
      );
      results.push({ id: task.id, status: video ? "done" : "checked" });
    } catch (err) {
      console.error(err);
      results.push({
        id: task.id,
        status: "error",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return results;
};

// Finishes pending generations nobody is polling for, so they reach the
// library even if the user closed the page. Meant to be hit on a schedule.
export const processStatus = async (params?: {
  maxTasksToProcess?: number;
}) => {
  const maxTasksToProcess = params?.maxTasksToProcess ?? 10;

  // Each job is independent; one failing must not stop the others
  const [videos, images, xaiVideos, musics] = await Promise.allSettled([
    runwayVideoService.processVideoStatus({ maxTasksToProcess }),
    runwayImageService.processImageStatus({ maxTasksToProcess }),
    processXaiVideoStatus(maxTasksToProcess),
    musicService.suno.processMusicStatus({ maxTasksToProcess }),
  ]);

  const summarize = <T>(result: PromiseSettledResult<T>) =>
    result.status === "fulfilled"
      ? result.value
      : {
          error:
            result.reason instanceof Error
              ? result.reason.message
              : String(result.reason),
        };

  return {
    runwayVideos: summarize(videos),
    runwayImages: summarize(images),
    xaiVideos: summarize(xaiVideos),
    sunoMusics: summarize(musics),
  };
};
