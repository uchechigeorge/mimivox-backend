import { sendForgotPassword } from "./send-forgot-password.service";
import { sendVerifyEmail } from "./send-verify-email.service";

const notificationService = {
  sendVerifyEmail,
  sendForgotPassword,
};

export default notificationService;
