import {
  taskGetParamsValidator,
  taskListParamsValidator,
  taskReadDtoValidator,
} from "@/lib/validators/user/task.validator";
import z from "zod";

export type TaskListParams = z.infer<typeof taskListParamsValidator>;
export type TaskGetParams = z.infer<typeof taskGetParamsValidator>;

export type TaskReadDto = z.infer<typeof taskReadDtoValidator>;
