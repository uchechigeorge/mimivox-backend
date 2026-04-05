import auth from "./auth-helpers.service";
import { getAuthenticatedUser } from "./get-authenticated-user.service";
import { login } from "./login.service";
import { register } from "./register.service";

const authService = {
  ...auth,
  register,
  login,
  getAuthenticatedUser,
};

export default authService;
