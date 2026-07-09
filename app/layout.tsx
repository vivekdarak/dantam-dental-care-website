import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsappFab } from "@/components/whatsapp-fab";
import { site } from "@/lib/site";
import "./globals.css";

const openinaryBaseUrl = process.env.NEXT_PUBLIC_OPENINARY_BASE_URL?.replace(/\/$/, "");

export const metadata: Metadata = {
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: "Modern dental care in Thane for implants, single-sitting root canals, aligners, braces and paediatric dentistry.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {openinaryBaseUrl && (
          <>
            <link rel="preconnect" href={openinaryBaseUrl} crossOrigin="" />
            <link rel="dns-prefetch" href={openinaryBaseUrl} />
          </>
        )}
      </head>
      <body>
        <div className="site-shell">
          <SiteHeader />
          <main className="site-main">{children}</main>
          <SiteFooter />
          <WhatsappFab />
        </div>
      </body>
    </html>
  );
}
