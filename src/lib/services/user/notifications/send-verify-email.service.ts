import { emailConfig } from "@/lib/config/email.config";
import { sendEmail } from "@/lib/utils/email.util";
import VerifyOtp from "@/react-email/emails/verify-email";

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
