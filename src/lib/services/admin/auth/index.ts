import auth from "./auth-helpers.service";
import { getAuthenticatedAdmin } from "./get-authenticated-admin.service";
import { login } from "./login.service";

const authService = {
  ...auth,
  getAuthenticatedAdmin,
  login,
};

export default authService;
