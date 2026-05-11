import { ReactNode } from "react";
import { env } from "../config/env.config";
import resend from "../config/resend.config";
import { transporter } from "../config/nodemailer.config";
import { render } from "@react-email/render";

export type SendEmailOptions = {
  to: string;
  subject: string;
  react: ReactNode;
};

export const sendEmail = async (options: SendEmailOptions) => {
  // await sendViaResend(options);
  await sendViaNodemailer(options);
};

const sendViaNodemailer = async (options: SendEmailOptions) => {
  const html = await render(options.react);

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html,
  });
};

const sendViaResend = async (options: SendEmailOptions) => {
  const from = env.EMAIL_FROM;

  const result = await resend.emails.send({
    ...options,
    from,
  });

  return result;
};
