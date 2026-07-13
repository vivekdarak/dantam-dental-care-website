import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { ServiceCard } from "@/components/service-card";
import { seoMetadata } from "@/lib/seo-metadata";
import { JsonLd, servicesPageSchema } from "@/lib/service-schema";
import { services } from "@/lib/site";
import "./services.css";

const title = "Dental Services in Thane";
const description =
  "Explore tooth extraction, root canal treatments, braces, aligners, implants, intraoral scanning, smile designing, child dental care, gum surgery, teeth whitening and dentures.";

export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata({
    title,
    description,
    image: "/images/hero-clinic.jpg",
    imageAlt: "Dantam Dental Care clinic interior in Thane",
    path: "/services",
  });
}

export default function ServicesPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }]} />
      <JsonLd data={servicesPageSchema()} />
      <PageHero
        eyebrow="Our Services"
        title="Modern dentistry, delivered gently."
        subtitle="Eleven core treatments, each performed with current technology and a calm, patient-first approach."
      />
      <section className="section">
        <div className="container services-list">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>
    </>
  );
}
