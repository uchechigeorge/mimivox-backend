import { emailConfig } from "@/lib/config/email.config";
import { env } from "@/lib/config/env.config";
import { sendEmail } from "@/lib/utils/email.util";
import ForgotPassword from "@/react-email/emails/forgot-password";

export const sendForgotPassword = async (
  to: string,
  token: string,
  userName: string,
) => {
  const resetLink = env.USER_FORGOT_PASSWORD_URL.replace("{{TOKEN}}", token);
  return await sendEmail({
    to,
    subject: "Forgot Password",
    react: ForgotPassword({ userName, resetLink, ...emailConfig }),
  });
};
