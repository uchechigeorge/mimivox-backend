import { Text } from "@react-email/components";
import EmailLayout from "./components/_layout";
import { PrimaryButton } from "./components/primary-button";
import SummaryTable from "./components/summary-table";

interface GenerationFinishedProps {
  userName: string;
  succeeded: boolean;
  // "video", "image", "music"
  mediaLabel: string;
  prompt: string;
  startedAt: string;
  error?: string;
  refunded?: boolean;
  buttonLink: string;
  appName: string;
  supportEmail: string;
}

export default function GenerationFinished({
  userName,
  succeeded,
  mediaLabel,
  prompt,
  startedAt,
  error,
  refunded,
  buttonLink,
  appName,
  supportEmail,
}: GenerationFinishedProps) {
  const items = [
    { label: "Type", value: capitalize(mediaLabel) },
    { label: "Prompt", value: prompt || "-" },
    { label: "Started", value: startedAt },
  ];
  if (!succeeded && error) items.push({ label: "Reason", value: error });

  return (
    <EmailLayout
      title={
        succeeded
          ? `Your ${mediaLabel} is ready`
          : `Your ${mediaLabel} could not be generated`
      }
      appName={appName}
      supportEmail={supportEmail}
    >
      <Text>
        Hi <strong>{userName}</strong>,
      </Text>

      {succeeded ? (
        <Text>
          Your {mediaLabel} has finished generating and is saved in your
          creative library.
        </Text>
      ) : (
        <Text>
          Unfortunately your {mediaLabel} could not be generated.
          {refunded ? " The credits for it have been returned to your account." : ""}
        </Text>
      )}

      <SummaryTable title="Generation Details" items={items} />

      <PrimaryButton
        href={buttonLink}
        text={succeeded ? `View your ${mediaLabel}` : "Try again"}
      />
    </EmailLayout>
  );
}

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

GenerationFinished.PreviewProps = {
  appName: "Nebula AI",
  userName: "John Doe",
  succeeded: false,
  mediaLabel: "video",
  prompt: "A drone shot over a misty forest at sunrise",
  startedAt: "October 2, 2026, 10:15 AM",
  error: "The prompt was flagged by content moderation.",
  refunded: true,
  buttonLink: "https://example.com/user/creative-library",
  supportEmail: "support@nebulaai.com",
} as GenerationFinishedProps;
