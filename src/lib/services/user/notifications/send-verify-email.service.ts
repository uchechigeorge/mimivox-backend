import { sendEmail } from "@/lib/config/resend.config";
import VerifyOtp from "../../../../../react-email-starter/emails/verify-email";
import emailConfig from "@/lib/config/email.config";

export const sendVerifyEmail = async (
  to: string,
  token: string,
  userName: string,
) => {
  return await sendEmail({
    to,
    subject: "Welcome",
    react: VerifyOtp({ token, userName, ...emailConfig }),
  });
};
