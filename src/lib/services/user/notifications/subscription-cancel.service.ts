import { emailConfig } from "@/lib/config/email.config";
import { sendEmail } from "@/lib/utils/email.util";
import { env } from "@/lib/config/env.config";
import SubscriptionCancelled from "@/react-email/emails/subscription-cancelled";

export const sendSubscriptionCancelled = async (
  to: string,
  args: SendSubscriptionActivatedArgs,
) => {
  const { userName, planName, expirationDate } = args;

  const dashboardLink = env.DASHBOARD_LINK;
  return await sendEmail({
    to,
    subject: `Subscription Cancelled`,
    react: SubscriptionCancelled({
      userName,
      planName,
      dashboardLink,
      expirationDate: !expirationDate
        ? "-"
        : expirationDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
      ...emailConfig,
    }),
  });
};

type SendSubscriptionActivatedArgs = {
  userName: string;
  planName: string;
  expirationDate: Date | null;
};
