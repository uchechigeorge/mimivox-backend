import auth from "./auth-helpers.service";
import { getAuthenticatedAdmin } from "./get-authenticated-admin.service";
import { login } from "./login.service";
import { resetPassword } from "./reset-password.service";

const authService = {
  ...auth,
  getAuthenticatedAdmin,
  login,
  resetPassword,
};

export default authService;
