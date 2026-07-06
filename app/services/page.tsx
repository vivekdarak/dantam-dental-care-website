import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ServiceCard } from "@/components/service-card";
import { services } from "@/lib/site";
import "./services.css";

export const metadata: Metadata = {
  title: "Dental Services in Thane",
  description: "Explore dental implants, single-sitting RCT, aligners, braces, paediatric dentistry, zirconia caps, wisdom teeth removal and 3D scanning.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="Modern dentistry, delivered gently."
        subtitle="Eight core treatments, each performed with current technology and a calm, patient-first approach."
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
