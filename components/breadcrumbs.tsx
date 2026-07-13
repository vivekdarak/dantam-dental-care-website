import Link from "next/link";
import "./breadcrumbs.css";

const siteUrl = "https://dantamdentalcare.com";

export type BreadcrumbItem = {
  label: string;
  href: string;
};

export function Breadcrumbs({ items, variant = "bar" }: { items: BreadcrumbItem[]; variant?: "inline" | "bar" }) {
  if (items.length < 2) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${siteUrl}${item.href}`,
    })),
  };

  const content = (
    <>
      <nav className={variant === "bar" ? "container breadcrumbs" : "breadcrumbs"} aria-label="Breadcrumb">
        <ol>
          {items.map((item, index) => {
            const isCurrent = index === items.length - 1;

            return (
              <li key={item.href}>
                {isCurrent ? (
                  <span aria-current="page">{item.label}</span>
                ) : (
                  <Link href={item.href}>{item.label}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
    </>
  );

  if (variant === "bar") {
    return <div className="breadcrumb-bar">{content}</div>;
  }

  return (
    <div className="breadcrumb-inline">
      {content}
    </div>
  );
}
