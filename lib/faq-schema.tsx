import type { FaqItem } from "@/lib/faqs";

type BasicFaqItem = {
  question: string;
  answer: string;
};

function answerToText(answer: FaqItem["answer"] | string) {
  if (typeof answer === "string") return answer;

  return answer.map((part) => part.text).join("");
}

export function faqPageSchema(items: Array<FaqItem | BasicFaqItem>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answerToText(item.answer),
      },
    })),
  };
}

export function FaqJsonLd({ items }: { items: Array<FaqItem | BasicFaqItem> }) {
  if (!items.length) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(items)).replace(/</g, "\\u003c") }}
    />
  );
}
