import { Text } from "@react-email/components";
import EmailLayout from "./components/_layout";
import { PrimaryButton } from "./components/primary-button";
import SummaryTable from "./components/summary-table";

interface SubscriptionPaymentFailedProps {
  userName: string;
  buttonLink: string;
  planName: string;
  amount: string;
  retryDate: string;
  appName: string;
  supportEmail: string;
}

export default function SubscriptionPaymentFailed({
  userName,
  buttonLink,
  planName,
  amount,
  retryDate,
  appName,
  supportEmail,
}: SubscriptionPaymentFailedProps) {
  return (
    <EmailLayout
      title="Payment Failed"
      appName={appName}
      supportEmail={supportEmail}
    >
      <Text>
        Hi <strong>{userName}</strong>,
      </Text>

      <Text>
        We were unable to process your subscription payment for{" "}
        <strong>{planName}</strong>.
      </Text>

      <SummaryTable
        title="Payment Details"
        items={[
          {
            label: "Plan",
            value: planName,
          },
          {
            label: "Amount",
            value: amount,
          },
          {
            label: "Retry Date",
            value: retryDate,
          },
        ]}
      />

      <Text style={{ marginTop: "24px" }}>
        Please update your payment method to avoid interruption to your
        subscription.
      </Text>

      <PrimaryButton href={buttonLink} text="Update Payment Method" />

    </EmailLayout>
  );
}

SubscriptionPaymentFailed.PreviewProps = {
  appName: "Nebula AI",
  userName: "John Doe",
  buttonLink: "https://example.com/billing",
  supportEmail: "support@nebulaai.com",
  planName: "Creator Pro",
  amount: "$20",
  retryDate: "June 11, 2026",
} as SubscriptionPaymentFailedProps;
