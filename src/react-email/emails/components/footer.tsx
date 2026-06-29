import { Section, Text, Link } from "@react-email/components";
import { footer, footerText, footerSupportText, footerLink } from "../styles";

export interface FooterProps {
  appName: string;
  supportEmail: string;
}

export function Footer({ appName, supportEmail }: FooterProps) {
  return (
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
  );
}
