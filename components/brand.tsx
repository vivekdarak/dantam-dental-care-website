import Image from "next/image";
import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className={compact ? "brand brand-compact" : "brand"} aria-label="Dantam Dental Care home">
      <Image
        src="/images/dantam-logo.png"
        alt="Dantam - Smile for lifetime"
        width={420}
        height={132}
        priority={!compact}
        unoptimized
      />
    </Link>
  );
}
