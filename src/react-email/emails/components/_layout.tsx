import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Link,
} from "@react-email/components";
import {
  main,
  container,
  header,
  headerText,
  content,
  footer,
  footerText,
  footerSupportText,
  footerLink,
} from "../styles";

interface EmailLayoutProps {
  title: string;
  children: React.ReactNode;
  appName: string;
  supportEmail: string;
}

export default function EmailLayout({
  title,
  children,
  appName,
  supportEmail,
}: EmailLayoutProps) {
  return (
    <Html>
      <Head />

      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerText}>{title}</Heading>
          </Section>

          <Section style={content}>{children}</Section>

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
