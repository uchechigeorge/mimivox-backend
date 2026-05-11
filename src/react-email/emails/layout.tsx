import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
} from "@react-email/components";

interface EmailLayoutProps {
  children: React.ReactNode;
  appName?: string;
}

export default function EmailLayout({
  children,
  appName = "MyApp", // ✅ default value
}: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={headerText}>{appName}</Text>
          </Section>

          {/* Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
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

const main = { backgroundColor: "#f4f4f7", padding: "20px" };
const container = { backgroundColor: "#ffffff", borderRadius: "8px" };
const header = {
  backgroundColor: "#4b0986",
  padding: "20px",
  textAlign: "center" as const,
};
const headerText = { color: "#ffffff", fontSize: "20px", fontWeight: "bold" };
const content = { padding: "30px", color: "#333" };
const footer = {
  backgroundColor: "#f4f4f7",
  padding: "20px",
  textAlign: "center" as const,
};
const footerText = { fontSize: "12px", color: "#888" };
