import type { CSSProperties, ReactNode } from "react";
import { openinaryUrl } from "@/lib/openinary";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section
      className="page-hero"
      style={{ "--page-hero-image": `url("${openinaryUrl("/images/hero-clinic.jpg", "w_1600,q_75,f_webp")}")` } as CSSProperties}
    >
      <div className="container">
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p className="lead">{subtitle}</p>
        {children && <div className="hero-actions">{children}</div>}
      </div>
    </section>
  );
}
