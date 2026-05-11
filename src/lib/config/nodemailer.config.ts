import nodemailer from "nodemailer";
import { env } from "./env.config";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USERNAME,
    pass: env.EMAIL_PASS,
  },
});

export default transporter;
