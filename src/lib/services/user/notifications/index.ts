import { notifyTaskFinished } from "./notify-task-finished.service";
import { sendForgotPassword } from "./send-forgot-password.service";
import { sendGenerationFinished } from "./send-generation-finished.service";
import { sendSubscriptionActivated } from "./send-subscription-activated.service";
import { sendVerifyEmail } from "./send-verify-email.service";

const notificationService = {
  sendVerifyEmail,
  sendForgotPassword,
  sendSubscriptionActivated,
  sendGenerationFinished,
  notifyTaskFinished,
};

export default notificationService;
