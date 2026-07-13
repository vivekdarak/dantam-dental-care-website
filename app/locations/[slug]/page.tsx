import type { Metadata } from "next";
import { Clock, MapPin, Navigation, Phone, UserRound } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { JsonLd, dentistLocationSchema } from "@/lib/location-schema";
import { seoMetadata } from "@/lib/seo-metadata";
import { locations, services, site } from "@/lib/site";
import "../locations.css";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function getLocation(slug: string) {
  return locations.find((location) => location.slug === slug);
}

export function generateStaticParams() {
  return locations.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) return {};

  const title = `${location.name} ${location.area}`;
  const description = `${location.name} in ${location.area}: address, phone, timings, directions and dental services. ${location.managerDescription}`;

  return seoMetadata({
    title: `${title} | Dantam Dental Care`,
    description,
    image: "/images/hero-clinic.jpg",
    imageAlt: `${location.name} dental clinic in ${location.area}`,
    path: `/locations/${location.slug}`,
  });
}

export default async function LocationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) notFound();

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Locations", href: "/locations" },
          { label: location.area, href: `/locations/${location.slug}` },
        ]}
      />
      <JsonLd data={dentistLocationSchema(location)} />
      <PageHero
        eyebrow="Clinic Location"
        title={`${location.name}, ${location.area}`}
        subtitle={location.managerDescription}
      />

      <section className="section">
        <div className="container location-detail-grid">
          <article className="location-detail-card">
            <div className="location-detail-map">
              <iframe
                src={location.mapEmbed}
                title={`${location.name} ${location.area} map`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="location-detail-body">
              <section>
                <h2>Visit the {location.area} clinic.</h2>
                <p>
                  {location.name} serves patients around {location.shortAddress}. The clinic is open for complete dental
                  care, appointment consultations and follow-up visits during regular clinic hours.
                </p>
              </section>

              <ul className="location-detail-list">
                <li>
                  <MapPin size={20} />
                  <span>{location.address}</span>
                </li>
                <li>
                  <Clock size={20} />
                  <span>{site.hours}</span>
                </li>
                <li>
                  <Phone size={20} />
                  <a href={location.phone.href}>{location.phone.label}</a>
                </li>
                <li>
                  <UserRound size={20} />
                  <span>Managed by {location.manager}</span>
                </li>
              </ul>
            </div>
          </article>

          <aside className="location-info-card">
            <div>
              <h2>Book this branch.</h2>
              <p>Call the clinic or get directions before visiting {location.name} in {location.area}.</p>
            </div>
            <a className="button primary" href={location.phone.href}>
              <Phone size={17} />
              Call {location.area}
            </a>
            <a className="button outline" href={location.mapLink} target="_blank" rel="noreferrer">
              <Navigation size={17} />
              Get Directions
            </a>
          </aside>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Services</div>
              <h2 className="section-title">Dental care available at this clinic.</h2>
            </div>
            <p className="lead">
              Our team can guide you on the right treatment plan for your needs and coordinate specialist care where
              required.
            </p>
          </div>
          <div className="location-service-links">
            {services.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`}>
                {service.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
