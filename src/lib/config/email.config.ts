import { env } from "./env.config";

const emailConfig = {
  appName: env.APP_NAME,
  supportEmail: env.SUPPORT_EMAIL,
};

export default emailConfig;
