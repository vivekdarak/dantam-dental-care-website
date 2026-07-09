import Link from "next/link";
import { OpeninaryImage } from "@/components/openinary-image";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className={compact ? "brand brand-compact" : "brand"} aria-label="Dantam Dental Care home">
      <OpeninaryImage
        src="/images/dantam-logo.png"
        alt="Dantam - Smile for lifetime"
        width={420}
        height={132}
        loading={compact ? "lazy" : "eager"}
        fetchPriority="low"
        quality={85}
        sizes={compact ? "174px" : "(max-width: 700px) 44vw, 188px"}
      />
    </Link>
  );
}
