import { getTask } from "./get-task.service";
import { listTasks } from "./list-tasks.service";

const taskService = {
  listTasks,
  getTask,
};

export default taskService;
