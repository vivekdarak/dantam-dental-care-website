import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { seoMetadata } from "@/lib/seo-metadata";
import { GoogleReviewGrid } from "@/components/google-review-grid";
import { getPublishedGoogleReviews } from "@/lib/directus-reviews";

const title = "Testimonials";
const description =
  "Stories from patients at Dantam Dental Care in Thane covering implants, root canals, aligners, kids dentistry and more.";

export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata({
    title: "Dantam Dental Care Testimonials",
    description,
    image: "/images/hero-clinic.jpg",
    imageAlt: "Dantam Dental Care clinic interior in Thane",
    path: "/testimonials",
  });
}

export default async function TestimonialsPage() {
  const reviews = await getPublishedGoogleReviews();

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Testimonials", href: "/testimonials" }]} />
      <PageHero
        eyebrow="Kind Words"
        title="Stories from smiles we have cared for."
        subtitle="A few of the many patients who have trusted us with their care."
      />
      <section className="section">
        <div className="container">
          <GoogleReviewGrid reviews={reviews} />
          <div style={{ marginTop: 56, textAlign: "center" }}>
            <p className="lead">Ready to write your own story?</p>
            <Link className="button primary" style={{ marginTop: 18 }} href="/contact">
              Book an appointment
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
