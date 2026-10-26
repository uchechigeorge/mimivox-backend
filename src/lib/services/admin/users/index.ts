import { getUser } from "./get-user.service";
import { grantUserCredits } from "./grant-credits.service";
import { listUserActivityLogs } from "./list-activity-logs.service";
import { listUsers } from "./list-users.service";
import { updateUserSubscription } from "./update-subscription.service";

const userService = {
  listUsers,
  getUser,
  updateUserSubscription,
  grantUserCredits,
  listUserActivityLogs,
};

export default userService;
