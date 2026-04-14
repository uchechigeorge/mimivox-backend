import { getUser } from "./get-user.service";
import { listUsers } from "./list-users.service";
import { updateUserSubscription } from "./update-subscription.service";

const userService = {
  listUsers,
  getUser,
  updateUserSubscription,
};

export default userService;
