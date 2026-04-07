import { getAllUsers } from "./get-all-users.service";
import { updateUserSubscription } from "./update-subscription.service";

const userService = {
  getAllUsers,
  updateUserSubscription,
};

export default userService;
