import { Text } from "@react-email/components";
import { PrimaryButton } from "./components/primary-button";
import EmailLayout from "./components/_layout";
import SummaryTable from "./components/summary-table";

interface SubscriptionCancelledProps {
  userName: string;
  planName: string;
  expirationDate: string;
  dashboardLink: string;
  appName?: string;
  supportEmail?: string;
}

export default function SubscriptionCancelled({
  userName,
  planName,
  expirationDate,
  dashboardLink,
  appName = "AppName",
  supportEmail = "support@example.com",
}: SubscriptionCancelledProps) {
  return (
    <EmailLayout
      title="Subscription Cancelled"
      appName={appName}
      supportEmail={supportEmail}
    >
      <Text>
        Hi <strong>{userName}</strong>,
      </Text>

      <Text>Your subscription renewal has been cancelled.</Text>

      <SummaryTable
        title="Subscription Details"
        items={[
          {
            label: "Plan",
            value: planName,
          },
          {
            label: "Access Until",
            value: expirationDate,
          },
        ]}
      />

      <Text style={{ marginTop: "24px" }}>
        Changed your mind? You can reactivate your subscription anytime before
        it expires.
      </Text>

      <PrimaryButton href={dashboardLink} text="Manage Subscription" />
    </EmailLayout>
  );
}

SubscriptionCancelled.PreviewProps = {
  appName: "Nebula AI",
  userName: "John Doe",
  dashboardLink: "https://example.com/billing",
  supportEmail: "support@nebulaai.com",
  planName: "Pro",
  expirationDate: "June 11, 2026",
} as SubscriptionCancelledProps;
