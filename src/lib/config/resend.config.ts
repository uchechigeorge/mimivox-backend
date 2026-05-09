import { Resend } from "resend";
import { env } from "./env.config";
import { ReactNode } from "react";

const resend = new Resend(env.RESEND_API_KEY);

type SendEmailOptions = {
  to: string;
  subject: string;
  react: ReactNode;
};

export const sendEmail = async (options: SendEmailOptions) => {
  const from = env.EMAIL_FROM;

  const result = await resend.emails.send({
    ...options,
    from,
  });

  console.log("Email sent:", result);
  return result;
};

export default resend;
