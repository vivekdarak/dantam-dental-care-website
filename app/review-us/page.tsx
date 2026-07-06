import type { Metadata } from "next";
import { ReviewUsClient } from "./review-us-client";

export const metadata: Metadata = {
  title: "Review Dantam Dental Care",
  description: "Share your experience with Dantam Dental Care.",
};

export default function ReviewUsPage() {
  return <ReviewUsClient />;
}
