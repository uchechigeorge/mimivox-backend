import { sendForgotPassword } from "./send-forgot-password.service";
import { sendSubscriptionActivated } from "./send-subscription-activated.service";
import { sendVerifyEmail } from "./send-verify-email.service";

const notificationService = {
  sendVerifyEmail,
  sendForgotPassword,
  sendSubscriptionActivated,
};

export default notificationService;
