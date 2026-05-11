import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Section,
  Heading,
} from "@react-email/components";

interface VerifyOtpProps {
  userName: string;
  token: string;
  appName?: string;
}

export default function VerifyOtp({
  userName,
  token,
  appName,
}: VerifyOtpProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerText}>Verify Your Email</Heading>
          </Section>

          <Section style={content}>
            <Text>
              Hi <strong>{userName}</strong>,
            </Text>

            <Text>
              Use the verification code below to complete your sign up:
            </Text>

            <Section style={otpBox}>
              <Text style={otpText}>{token}</Text>
            </Section>

            <Text>
              This code will expire shortly. Do not share it with anyone.
            </Text>

            <Text style={{ marginTop: "30px" }}>
              If you didn’t request this, ignore this email.
            </Text>

            <Text>
              Regards,
              <br />
              <strong>{appName} Team</strong>
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} {appName}. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

VerifyOtp.PreviewProps = {
  appName: "AppName",
  token: "123456",
  userName: "John Doe",
} as VerifyOtpProps;

const main = { backgroundColor: "#f4f4f7", padding: "20px" };
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
const headerText = { color: "#ffffff" };
const content = { padding: "30px", color: "#333" };

const otpBox = {
  textAlign: "center" as const,
  margin: "30px 0",
  padding: "20px",
  border: "1px dashed #4b0986",
  borderRadius: "8px",
};

const otpText = {
  fontSize: "28px",
  fontWeight: "bold",
  letterSpacing: "6px",
  color: "#4b0986",
};

const footer = {
  backgroundColor: "#f4f4f7",
  padding: "20px",
  textAlign: "center" as const,
};

const footerText = { fontSize: "12px", color: "#888" };
