import auth from "./auth-helpers.service";
import { getAuthenticatedUser } from "./get-authenticated-user.service";
import { login } from "./login.service";
import { register } from "./register.service";
import { resetPassword } from "./reset-password.service";

const authService = {
  ...auth,
  register,
  login,
  getAuthenticatedUser,
  resetPassword,
};

export default authService;
