import { Section, Text } from "@react-email/components";
import {
  summaryBox,
  summaryTitle,
  summaryRow,
  summaryRowNoBorder,
  label,
  value,
} from "../styles";

interface SummaryItem {
  label: string;
  value: string;
}

interface SummaryTableProps {
  title: string;
  items: SummaryItem[];
}

export default function SummaryTable({ title, items }: SummaryTableProps) {
  return (
    <Section style={summaryBox}>
      <Text style={summaryTitle}>{title}</Text>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <Section
            key={item.label}
            style={isLast ? summaryRowNoBorder : summaryRow}
          >
            <Text style={label}>{item.label}</Text>

            <Text style={value}>{item.value}</Text>
          </Section>
        );
      })}
    </Section>
  );
}
