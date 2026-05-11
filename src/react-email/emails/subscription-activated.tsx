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
  planName: string;
  dashboardLink: string;
  appName?: string;
  supportEmail?: string;
}

export default function SubscriptionWelcome({
  userName,
  planName,
  dashboardLink,
  appName = "AppName",
  supportEmail = "support@example.com",
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
              Thank you for subscribing to <strong>{planName}</strong> plan on{" "}
              {appName}.
            </Text>

            <Text>
              You now have access to powerful AI tools that help you create:
            </Text>

            <Section style={featureList}>
              <Text style={featureItem}>✍️ Text-to-Speech (TTS)</Text>
              <Text style={featureItem}>🎙️ Voice Creation</Text>
              <Text style={featureItem}>🎨 AI Image Generation</Text>
              <Text style={featureItem}>🎵 AI Music Creation</Text>
              <Text style={featureItem}>🎬 AI Video Generation</Text>
            </Section>

            <Text>
              Your subscription is now active, and you can start creating right
              away.
            </Text>

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
              Need help getting started? Reach out to our support team at{" "}
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
  planName: "Starter Plan",
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

const featureList = {
  margin: "20px 0",
  padding: "16px",
  backgroundColor: "#f9f5ff",
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
