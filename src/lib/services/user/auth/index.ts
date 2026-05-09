import auth from "./auth-helpers.service";
import forgotPassword from "./forgot-password.service";
import { getAuthenticatedUser } from "./get-authenticated-user.service";
import { login } from "./login.service";
import { register } from "./register.service";
import { resetPassword } from "./reset-password.service";
import verifyEmail from "./verify-email.service";

const authService = {
  ...auth,
  verifyEmail,
  forgotPassword,
  register,
  login,
  getAuthenticatedUser,
  resetPassword,
};

export default authService;
