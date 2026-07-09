import type { Metadata } from "next";
import { Cormorant_Garamond, Dancing_Script, Work_Sans } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsappFab } from "@/components/whatsapp-fab";
import { openinaryUrl } from "@/lib/openinary";
import { site } from "@/lib/site";
import "./globals.css";

const openinaryBaseUrl = process.env.NEXT_PUBLIC_OPENINARY_BASE_URL?.replace(/\/$/, "");
const siteUrl = "https://dantamdentalcare.com";
const siteDescription =
  "Modern dental care in Thane for implants, single-sitting root canals, aligners, braces and paediatric dentistry.";
const socialImage = openinaryUrl("/images/photo4-cropped.jpg", "w_1200,h_630,c_fill,q_82,f_jpg");

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-work-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-dancing",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: siteDescription,
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: `${site.name} | ${site.tagline}`,
    description: siteDescription,
    url: siteUrl,
    siteName: site.name,
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: "Dantam Dental Care clinic reception in Thane",
        type: "image/jpeg",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.tagline}`,
    description: siteDescription,
    images: [socialImage],
  },
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
      <body className={`${workSans.variable} ${cormorant.variable} ${dancing.variable}`}>
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
