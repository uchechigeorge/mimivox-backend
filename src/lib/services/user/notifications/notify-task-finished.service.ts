import { after } from "next/server";
import { Task } from "@/generated/prisma/client";
import userRepo from "@/lib/repositories/user.repo";
import { sendGenerationFinished } from "./send-generation-finished.service";

const mediaLabels: Record<Task["type"], string> = {
  None: "generation",
  Music: "music",
  Video: "video",
  Image: "image",
};

// Runway logs the prompt as promptText, xAI and Suno as prompt
const getPrompt = (task: Task) => {
  const body = (task.serviceRequestLog as { body?: Record<string, unknown> })
    ?.body;
  const prompt = body?.promptText ?? body?.prompt;
  if (typeof prompt !== "string") return "";
  return prompt.length > 200 ? `${prompt.slice(0, 200)}…` : prompt;
};

// "GENERATE_AUDIO_FAILED" -> "Generate audio failed"; bare statuses add nothing
const toReadableError = (error?: string | null) => {
  if (!error || /^(failed|cancelled)$/i.test(error)) return undefined;
  if (!/^[A-Z_]+$/.test(error)) return error;
  const words = error.toLowerCase().replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
};

const send = async (task: Task, result: TaskResult) => {
  try {
    const user = await userRepo.getById(task.userId!);
    if (!user) return;

    await sendGenerationFinished(user.email, {
      userName: user.firstName || task.userName || "there",
      succeeded: result.succeeded,
      mediaLabel: mediaLabels[task.type],
      prompt: getPrompt(task),
      startedAt: task.createdAt,
      error: toReadableError(result.error),
      refunded: result.refunded,
    });
  } catch (err) {
    // An email problem must never affect the generation itself
    console.error(`Could not send the email for task ${task.id}`, err);
  }
};

// Emails the user that a background generation finished or failed. Callers
// make sure this runs once per task, after the outcome is saved. The email
// goes out after the response so status checks are not slowed down.
export const notifyTaskFinished = (task: Task, result: TaskResult) => {
  if (!task.userId) return;

  try {
    after(() => send(task, result));
  } catch {
    // Outside a request (scripts, tests) there is no response to wait for
    void send(task, result);
  }
};

type TaskResult = {
  succeeded: boolean;
  error?: string | null;
  refunded?: boolean;
};
