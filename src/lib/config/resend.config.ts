import { Resend } from "resend";
import { env } from "./env.config";

const resend = new Resend(env.RESEND_API_KEY);

export default resend;
