import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { seoMetadata } from "@/lib/seo-metadata";
import { ReviewUs2Client } from "../review-us2/review-us2-client";

const title = "Share Feedback for Dantam Dental Care";
const description = "Share private clinic feedback and prepare your own Google review for Dantam Dental Care.";

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await seoMetadata({
    title,
    description,
    image: "/images/doctors-image.jpeg",
    imageAlt: "Doctors at Dantam Dental Care",
    path: "/review-us",
  });

  return {
    ...metadata,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function ReviewUsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Feedback", href: "/review-us" }]} />
      <ReviewUs2Client />
    </>
  );
}
