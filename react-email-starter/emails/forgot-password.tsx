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

interface ForgotPasswordProps {
  userName: string;
  resetLink: string;
  appName?: string;
  supportEmail?: string;
}

export default function ForgotPassword({
  userName,
  resetLink,
  appName = "AppName",
  supportEmail = "support@example.com",
}: ForgotPasswordProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerText}>Reset Your Password</Heading>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text>
              Hi <strong>{userName}</strong>,
            </Text>

            <Text>
              We received a request to reset your password. Click the button
              below to create a new password.
            </Text>

            {/* Reset Button */}
            <Section style={buttonContainer}>
              <Button href={resetLink} style={button}>
                Reset Password
              </Button>
            </Section>

            <Text>
              This password reset link will expire shortly for security reasons.
            </Text>

            <Text>
              If the button above does not work, copy and paste the link below
              into your browser:
            </Text>

            <Link href={resetLink} style={link}>
              {resetLink}
            </Link>

            <Text style={{ marginTop: "30px" }}>
              If you did not request a password reset, you can safely ignore
              this email.
            </Text>

            {/* Support */}
            <Text>
              Need help? Contact our support team at{" "}
              <Link href={`mailto:${supportEmail}`} style={supportLink}>
                {supportEmail}
              </Link>
            </Text>

            <Text>
              Regards,
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

ForgotPassword.PreviewProps = {
  appName: "AppName",
  userName: "John Doe",
  resetLink: "https://example.com/reset-password?token=abc123",
  supportEmail: "support@appname.com",
} as ForgotPasswordProps;

/* Styles */

const main = {
  backgroundColor: "#f4f4f7",
  padding: "20px",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden",
};

const header = {
  backgroundColor: "#4b0986",
  padding: "20px",
  textAlign: "center" as const,
};

const headerText = {
  color: "#ffffff",
};

const content = {
  padding: "30px",
  color: "#333",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#4b0986",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "bold",
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
