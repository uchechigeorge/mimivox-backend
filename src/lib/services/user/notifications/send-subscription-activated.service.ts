import { emailConfig } from "@/lib/config/email.config";
import { sendEmail } from "@/lib/utils/email.util";
import SubscriptionWelcome from "@/react-email/emails/subscription-activated";
import { env } from "@/lib/config/env.config";
import { IntervalType } from "@/generated/prisma/enums";

export const sendSubscriptionActivated = async (
  to: string,
  args: SendSubscriptionActivatedArgs,
) => {
  const { userName, planName, amount, nextBillingDate, intervalType } = args;
  let billingInterval = "Monthly";

  switch (intervalType) {
    case "Day":
      billingInterval = "Daily";
      break;
    case "Week":
      billingInterval = "Weekly";
      break;
    case "Month":
      billingInterval = "Monthly";
      break;
    case "Year":
      billingInterval = "Yearly";
      break;
    default:
      billingInterval = "Monthly";
  }

  const dashboardLink = env.DASHBOARD_LINK;
  return await sendEmail({
    to,
    subject: `Welcome to ${emailConfig.appName} 🎉 Your AI Creative Journey Starts Now`,
    react: SubscriptionWelcome({
      userName,
      planName,
      dashboardLink,
      amount: `₦${amount.toFixed(2)}`,
      nextBillingDate: !nextBillingDate
        ? "-"
        : nextBillingDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
      billingInterval,
      ...emailConfig,
    }),
  });
};

type SendSubscriptionActivatedArgs = {
  userName: string;
  planName: string;
  nextBillingDate: Date | null;
  amount: number;
  intervalType: IntervalType;
};
