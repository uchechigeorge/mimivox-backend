import auth from "../auth/auth-helpers.service";
import { getAdmin } from "./get-admin.service";
import { listAdmins } from "./list-admins.service";

const userService = {
  auth,
  listAdmins,
  getAdmin,
};

export default userService;
