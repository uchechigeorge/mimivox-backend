import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Section,
  Heading,
  Button,
  Link,
} from "@react-email/components";

interface SubscriptionWelcomeProps {
  userName: string;
  dashboardLink: string;
  appName?: string;
  supportEmail?: string;

  // Subscription Details
  planName?: string;
  billingInterval?: string;
  amount?: string;
  nextBillingDate?: string;
}

export default function SubscriptionWelcome({
  userName,
  dashboardLink,
  appName = "AppName",
  supportEmail = "support@example.com",

  // Subscription Details
  planName = "Creator Pro",
  billingInterval = "Monthly",
  amount = "$20",
  nextBillingDate = "June 11, 2026",
}: SubscriptionWelcomeProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerText}>Welcome to {appName} 🚀</Heading>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text>
              Hi <strong>{userName}</strong>,
            </Text>
            <Text>
              Thank you for subscribing to <strong>{planName}</strong> on{" "}
              {appName}.
            </Text>
            <Text>
              Your subscription is now active and you can start creating with
              our AI tools immediately.
            </Text>
            {/* Features */}
            <Text style={{ marginTop: "30px" }}>You now have access to:</Text>
            <Section style={featureList}>
              <Text style={featureItem}>✍️ Text-to-Speech (TTS)</Text>
              <Text style={featureItem}>🎙️ Voice Creation</Text>
              <Text style={featureItem}>🎨 AI Image Generation</Text>
              <Text style={featureItem}>🎵 AI Music Creation</Text>
              <Text style={featureItem}>🎬 AI Video Generation</Text>
            </Section>
            {/* Subscription Summary */}{" "}
            <Section style={summaryBox}>
              {" "}
              <Heading as="h3" style={summaryTitle}>
                {" "}
                Subscription Summary{" "}
              </Heading>{" "}
              <Section style={summaryTable}>
                {" "}
                <Section style={summaryRow}>
                  {" "}
                  <Text style={label}>Plan</Text>{" "}
                  <Text style={value}>{planName}</Text>{" "}
                </Section>{" "}
                <Section style={summaryRow}>
                  {" "}
                  <Text style={label}>Billing</Text>{" "}
                  <Text style={value}>{billingInterval}</Text>{" "}
                </Section>{" "}
                <Section style={summaryRow}>
                  {" "}
                  <Text style={label}>Amount</Text>{" "}
                  <Text style={value}>
                    {" "}
                    {amount}/{billingInterval.toLowerCase()}{" "}
                  </Text>{" "}
                </Section>{" "}
                <Section style={summaryRowNoBorder}>
                  {" "}
                  <Text style={label}>Next Billing</Text>{" "}
                  <Text style={value}>{nextBillingDate}</Text>{" "}
                </Section>{" "}
              </Section>{" "}
            </Section>
            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button href={dashboardLink} style={button}>
                Go to Dashboard
              </Button>
            </Section>
            <Text>
              If the button above does not work, copy and paste the link below
              into your browser:
            </Text>
            <Link href={dashboardLink} style={link}>
              {dashboardLink}
            </Link>
            {/* Support */}
            <Text style={{ marginTop: "30px" }}>
              Need help? Contact our support team at{" "}
              <Link href={`mailto:${supportEmail}`} style={supportLink}>
                {supportEmail}
              </Link>
            </Text>
            <Text>We’re excited to see what you create with {appName}.</Text>
            <Text>
              Cheers,
              <br />
              <strong>{appName} Team</strong>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} {appName}. All rights reserved.
            </Text>

            <Text style={footerSupportText}>
              Support:{" "}
              <Link href={`mailto:${supportEmail}`} style={footerLink}>
                {supportEmail}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

SubscriptionWelcome.PreviewProps = {
  appName: "Nebula AI",
  userName: "John Doe",
  dashboardLink: "https://example.com/dashboard",
  supportEmail: "support@nebulaai.com",

  planName: "Creator Pro",
  billingInterval: "Monthly",
  amount: "$20",
  nextBillingDate: "June 11, 2026",
} as SubscriptionWelcomeProps;

/* Styles */

const main = {
  backgroundColor: "#f4f4f7",
  padding: "20px",
  fontFamily: "Arial, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden",
};

const header = {
  background: "linear-gradient(135deg, #4b0986 0%, #7c3aed 100%)",
  padding: "30px 20px",
  textAlign: "center" as const,
};

const headerText = {
  color: "#ffffff",
  margin: "0",
  fontSize: "28px",
};

const content = {
  padding: "30px",
  color: "#333",
  lineHeight: "1.6",
};

const summaryBox = {
  backgroundColor: "#f9f5ff",
  borderRadius: "8px",
  padding: "18px",
  marginTop: "20px",
};
const summaryTitle = {
  margin: "0 0 14px 0",
  fontSize: "18px",
  color: "#4b0986",
};
const summaryTable = { width: "100%" };
const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0",
  borderBottom: "1px solid #ece7f6",
};
const summaryRowNoBorder = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0 0 0",
};
const label = { margin: "0", color: "#666", fontSize: "14px" };
const value = {
  margin: "0",
  color: "#111",
  fontWeight: "600",
  fontSize: "14px",
  textAlign: "right" as const,
};

const featureList = {
  margin: "20px 0",
  padding: "16px",
  backgroundColor: "#fafafa",
  borderRadius: "8px",
};

const featureItem = {
  margin: "8px 0",
  fontSize: "15px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "35px 0",
};

const button = {
  backgroundColor: "#4b0986",
  color: "#ffffff",
  padding: "14px 28px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "bold",
  display: "inline-block",
};

const link = {
  color: "#4b0986",
  wordBreak: "break-all" as const,
};

const supportLink = {
  color: "#4b0986",
  textDecoration: "none",
};

const footer = {
  backgroundColor: "#f4f4f7",
  padding: "20px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#888",
};

const footerSupportText = {
  fontSize: "12px",
  color: "#888",
  marginTop: "8px",
};

const footerLink = {
  color: "#4b0986",
  textDecoration: "none",
};
// ```
