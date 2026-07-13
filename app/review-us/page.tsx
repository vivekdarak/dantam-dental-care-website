import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { seoMetadata } from "@/lib/seo-metadata";
import { ReviewUsClient } from "./review-us-client";

const title = "Review Dantam Dental Care";
const description = "Share your experience with Dantam Dental Care.";

export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata({
    title,
    description,
    image: "/images/doctors-image.jpeg",
    imageAlt: "Dr. Blanch Gonsalves Modi and Dr. Krushnakumar Modi at Dantam Dental Care",
    path: "/review-us",
  });
}

export default function ReviewUsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Review Us", href: "/review-us" }]} />
      <ReviewUsClient />
    </>
  );
}
