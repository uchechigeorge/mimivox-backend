import { sendEmail } from "@/lib/config/resend.config";
import ForgotPassword from "../../../../../react-email-starter/emails/forgot-password";
import { env } from "@/lib/config/env.config";
import emailConfig from "@/lib/config/email.config";

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
