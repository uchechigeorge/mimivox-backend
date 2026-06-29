import { emailConfig } from "@/lib/config/email.config";
import { sendEmail } from "@/lib/utils/email.util";
import { env } from "@/lib/config/env.config";
import SubscriptionPaymentFailed from "@/react-email/emails/subscription-payment-failed";

export const sendSubscriptionPaymentFailed = async (
  to: string,
  args: SendSubscriptionActivatedArgs,
) => {
  const { userName, planName, amount, retryDate, actionLink } = args;

  return await sendEmail({
    to,
    subject: `Your Payment Failed`,
    react: SubscriptionPaymentFailed({
      userName,
      planName,
      buttonLink: actionLink ?? "",
      amount: `₦${amount.toFixed(2)}`,
      retryDate: !retryDate
        ? "-"
        : retryDate.toLocaleDateString("en-US", {
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
  amount: number;
  actionLink?: string;
  retryDate: Date | null;
};
