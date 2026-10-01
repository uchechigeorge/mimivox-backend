import taskRepo from "@/lib/repositories/task.repo";
import { syncVideoTask } from "./sync-video-task.service";

// Finalizes pending Runway video tasks whose users stopped polling
export const processVideoStatus = async (params?: {
  maxTasksToProcess?: number;
}) => {
  const results: { id: string; status: string; error?: unknown }[] = [];

  const tasks = (
    await taskRepo.listByStatus("Pending", "Video", "Runway")
  ).splice(0, params?.maxTasksToProcess ?? 10);

  for (const task of tasks) {
    try {
      const result = await syncVideoTask(task);
      results.push({ id: task.id, status: result.status });
    } catch (err) {
      console.error(err);
      results.push({
        id: task.id,
        status: "error",
        error: err instanceof Error ? err.message : err,
      });
    }
  }

  return results;
};
