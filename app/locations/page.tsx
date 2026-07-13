import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClinicLocationCards } from "@/components/clinic-location-cards";
import { PageHero } from "@/components/page-hero";
import { JsonLd, locationsItemListSchema } from "@/lib/location-schema";
import { seoMetadata } from "@/lib/seo-metadata";
import "./locations.css";

const title = "Dental Clinic Locations";
const description =
  "Find Dantam Dental Care clinic locations in Majiwada, Shreenagar and Nalasopara, with address, phone, timings and map directions.";

export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata({
    title: "Dental Clinic Locations | Dantam Dental Care",
    description,
    image: "/images/dantam-clinic-centers.jpg",
    imageAlt: "Dantam Dental Care clinic centers",
    path: "/locations",
  });
}

export default function LocationsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Locations", href: "/locations" }]} />
      <JsonLd data={locationsItemListSchema()} />
      <PageHero
        eyebrow="Our Clinics"
        title="Choose the Dantam clinic closest to you."
        subtitle="Visit our dental clinics in Majiwada, Shreenagar and Nalasopara for complete dental care, clear guidance and convenient appointment support."
      />

      <section className="section">
        <div className="container location-hub-grid">
          <ClinicLocationCards showDetailsLink />
        </div>
      </section>
    </>
  );
}
