import { XaiVideoGenerateResponse } from "./types";
import { User } from "@/generated/prisma/client";
import taskRepo from "@/lib/repositories/task.repo";

export const createTask = async (
  response: XaiVideoGenerateResponse,
  user: User,
  log?: any,
) => {
  await taskRepo.create({
    userId: user.id,
    userName: user.fullName,
    referenceId: response.request_id,
    serviceOption: "Xai",
    type: "Video",
    serviceRequestLog: log,
  });
};
