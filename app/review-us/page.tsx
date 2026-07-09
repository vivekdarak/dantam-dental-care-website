import type { Metadata } from "next";
import { socialMetadata } from "@/lib/social-metadata";
import { ReviewUsClient } from "./review-us-client";

const title = "Review Dantam Dental Care";
const description = "Share your experience with Dantam Dental Care.";

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({
    title,
    description,
    image: "/images/doctors-image.jpeg",
    imageAlt: "Dr. Blanch Gonsalves Modi and Dr. Krushnakumar Modi at Dantam Dental Care",
    path: "/review-us",
  }),
};

export default function ReviewUsPage() {
  return <ReviewUsClient />;
}
