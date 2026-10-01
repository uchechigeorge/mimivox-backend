import taskRepo from "@/lib/repositories/task.repo";
import { syncImageTask } from "./sync-image-task.service";

// Finalizes pending Runway image tasks whose users stopped polling
export const processImageStatus = async (params?: {
  maxTasksToProcess?: number;
}) => {
  const results: { id: string; status: string; error?: unknown }[] = [];

  const tasks = (
    await taskRepo.listByStatus("Pending", "Image", "Runway")
  ).splice(0, params?.maxTasksToProcess ?? 10);

  for (const task of tasks) {
    try {
      const result = await syncImageTask(task);
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
