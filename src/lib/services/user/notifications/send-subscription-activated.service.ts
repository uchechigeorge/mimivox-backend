import { emailConfig } from "@/lib/config/email.config";
import { sendEmail } from "@/lib/utils/email.util";
import SubscriptionWelcome from "@/react-email/emails/subscription-activated";
import { env } from "@/lib/config/env.config";

export const sendSubscriptionActivated = async (
  to: string,
  args: SendSubscriptionActivatedArgs,
) => {
  const { userName, planName } = args;
  const dashboardLink = env.DASHBOARD_LINK;
  return await sendEmail({
    to,
    subject: `Welcome to ${emailConfig.appName} 🎉 Your AI Creative Journey Starts Now`,
    react: SubscriptionWelcome({
      userName,
      planName,
      dashboardLink,
      ...emailConfig,
    }),
  });
};

type SendSubscriptionActivatedArgs = {
  userName: string;
  planName: string;
};
