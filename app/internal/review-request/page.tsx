import type { Metadata } from "next";
import { hasInternalReviewSession } from "@/lib/internal-review-auth";
import { locations } from "@/lib/site";
import { InternalReviewRequestClient } from "./review-request-client";
import "./review-request.css";

export const metadata: Metadata = {
  title: "Internal Review Request",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function InternalReviewRequestPage() {
  const authenticated = await hasInternalReviewSession();
  const branchOptions = locations.map((location) => ({
    value: location.slug,
    label: `${location.name} - ${location.area}`,
    description: location.shortAddress,
  }));

  return <InternalReviewRequestClient authenticated={authenticated} branches={branchOptions} />;
}
