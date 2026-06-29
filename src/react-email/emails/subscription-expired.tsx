import { Heading, Section, Text } from "@react-email/components";
import EmailLayout from "./components/_layout";
import { featureItem, summaryBox, summaryTitle } from "./styles";
import { PrimaryButton } from "./components/primary-button";

interface SubscriptionExpiredProps {
  userName: string;
  planName: string;
  buttonLink: string;
  appName: string;
  supportEmail: string;
}

export default function SubscriptionExpired({
  userName,
  buttonLink,
  planName,
  appName,
  supportEmail,
}: SubscriptionExpiredProps) {
  return (
    <EmailLayout
      title="Subscription Ended"
      appName={appName}
      supportEmail={supportEmail}
    >
      <Text>
        Hi <strong>{userName}</strong>,
      </Text>

      <Text>
        Your subscription to <strong>{planName}</strong> has ended.
      </Text>

      <Text>
        You no longer have access to premium features included with your
        subscription.
      </Text>

      <Section style={summaryBox}>
        <Heading as="h3" style={summaryTitle}>
          What You’re Missing
        </Heading>

        <Text style={featureItem}>✍️ AI Content Generation</Text>
        <Text style={featureItem}>🎙️ Voice & Audio Tools</Text>
        <Text style={featureItem}>🎨 AI Image Creation</Text>
        <Text style={featureItem}>🎬 AI Video Features</Text>
      </Section>

      <Text style={{ marginTop: "24px" }}>
        You can reactivate your subscription anytime to continue where you left
        off.
      </Text>

      <PrimaryButton href={buttonLink} text="Reactivate Subscription" />
    </EmailLayout>

    // <Html>
    //   <Head />
    //   <Body style={main}>
    //     <Container style={container}>
    //       <Section style={header}>
    //         <Heading style={headerText}>Subscription Ended</Heading>
    //       </Section>

    //       <Section style={content}>
    //         <Text>
    //           Hi <strong>{userName}</strong>,
    //         </Text>

    //         <Text>
    //           Your subscription to <strong>{planName}</strong> has ended.
    //         </Text>

    //         <Text>
    //           You no longer have access to premium features included with your
    //           subscription.
    //         </Text>

    //         <Section style={summaryBox}>
    //           <Heading as="h3" style={summaryTitle}>
    //             What You’re Missing
    //           </Heading>

    //           <Text style={featureItem}>✍️ AI Content Generation</Text>
    //           <Text style={featureItem}>🎙️ Voice & Audio Tools</Text>
    //           <Text style={featureItem}>🎨 AI Image Creation</Text>
    //           <Text style={featureItem}>🎬 AI Video Features</Text>
    //         </Section>

    //         <Text style={{ marginTop: "24px" }}>
    //           You can reactivate your subscription anytime to continue where you
    //           left off.
    //         </Text>

    //         <Section style={buttonContainer}>
    //           <Button href={buttonLink} style={button}>
    //             Reactivate Subscription
    //           </Button>
    //         </Section>

    //         <Text>
    //           Questions? Reach us at{" "}
    //           <Link href={`mailto:${supportEmail}`} style={supportLink}>
    //             {supportEmail}
    //           </Link>
    //         </Text>

    //         <Text>
    //           — <strong>{appName} Team</strong>
    //         </Text>
    //       </Section>

    //       <Section style={footer}>
    //         <Text style={footerText}>
    //           © {new Date().getFullYear()} {appName}. All rights reserved.
    //         </Text>
    //       </Section>
    //     </Container>
    //   </Body>
    // </Html>
  );
}

SubscriptionExpired.PreviewProps = {
  userName: "John Doe",
  buttonLink: "https://example.com/upgrade",
  planName: "Creator Pro",
  appName: "Nebula AI",
  supportEmail: "support@nebulaai.com",
} as SubscriptionExpiredProps;
