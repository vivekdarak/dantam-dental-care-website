import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type { FaqItem } from "@/lib/faqs";
import "./faq-section.css";

type FaqSectionProps = {
  items: FaqItem[];
  eyebrow?: string;
  title?: string;
  lead?: string;
  className?: string;
};

export function FaqSection({
  items,
  eyebrow = "FAQ",
  title = "Questions patients ask us often.",
  lead = "Clear answers to common dental care, appointment, and treatment questions.",
  className = "",
}: FaqSectionProps) {
  const sectionClassName = ["section", "faq-section", className].filter(Boolean).join(" ");

  return (
    <section className={sectionClassName}>
      <div className="container">
        <div className="section-heading faq-heading">
          <div>
            <div className="eyebrow">{eyebrow}</div>
            <h2 className="section-title">{title}</h2>
          </div>
          {lead ? <p className="lead">{lead}</p> : null}
        </div>

        <div className="faq-list">
          {items.map((item, index) => (
            <details className="faq-item" key={item.question} open={index === 0}>
              <summary>
                <span>{item.question}</span>
                <ChevronDown aria-hidden="true" size={20} />
              </summary>
              <div className="faq-answer">
                <p>{renderAnswer(item.answer)}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderAnswer(answer: FaqItem["answer"]) {
  if (typeof answer === "string") {
    return answer;
  }

  return answer.map((part, index) => {
    if (!part.href) {
      return part.text;
    }

    if (part.external || part.href.startsWith("tel:") || part.href.startsWith("mailto:")) {
      return (
        <a key={`${part.text}-${index}`} href={part.href} target={part.external ? "_blank" : undefined} rel={part.external ? "noreferrer" : undefined}>
          {part.text}
        </a>
      );
    }

    return (
      <Link key={`${part.text}-${index}`} href={part.href}>
        {part.text}
      </Link>
    );
  });
}
