import { Section, Button } from "@react-email/components";
import { buttonContainer, button } from "../styles";

interface PrimaryButtonProps {
  href: string;
  text: string;
}

export function PrimaryButton({ href, text }: PrimaryButtonProps) {
  return (
    <Section style={buttonContainer}>
      <Button href={href} style={button}>
        {text}
      </Button>
    </Section>
  );
}
