import { locations, services, site } from "@/lib/site";

const siteUrl = "https://dantamdentalcare.com";

export type Location = (typeof locations)[number];

export function locationUrl(location: Location) {
  return `${siteUrl}/locations/${location.slug}`;
}

export function locationImage() {
  return `${siteUrl}/images/hero-clinic.jpg`;
}

function locationManagers(location: Location) {
  if (location.slug === "majiwada") {
    return ["Dr. Krushnakumar Modi", "Dr. Blanch Gonsalves Modi"];
  }

  return [location.manager];
}

function locationCity(location: Location) {
  return location.slug === "nalasopara" ? "Nalasopara" : "Thane";
}

function locationPostalCode(location: Location) {
  if (location.slug === "majiwada") return "400601";
  if (location.slug === "shreenagar") return "400604";
  return "401203";
}

export function dentistLocationSchema(location: Location) {
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": `${locationUrl(location)}#dentist`,
    name: location.name,
    url: locationUrl(location),
    image: locationImage(),
    sameAs: [location.googleBusinessProfile],
    telephone: location.phone.label,
    email: site.email.label,
    address: {
      "@type": "PostalAddress",
      streetAddress: location.address,
      addressLocality: locationCity(location),
      addressRegion: "Maharashtra",
      postalCode: locationPostalCode(location),
      addressCountry: "IN",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:30",
        closes: "21:30",
      },
    ],
    hasMap: location.mapLink,
    parentOrganization: {
      "@type": "Organization",
      name: site.name,
      url: siteUrl,
      logo: `${siteUrl}/images/dantam-logo.png`,
    },
    employee: locationManagers(location).map((name) => ({
      "@type": "Person",
      name,
    })),
    areaServed: [
      {
        "@type": "City",
        name: location.area,
      },
      {
        "@type": "City",
        name: locationCity(location),
      },
    ],
    medicalSpecialty: "Dentistry",
    makesOffer: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        url: `${siteUrl}/services/${service.slug}`,
      },
    })),
  };
}

export function locationsItemListSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/locations#webpage`,
        name: "Dental Clinic Locations",
        url: `${siteUrl}/locations`,
        isPartOf: {
          "@type": "WebSite",
          name: site.name,
          url: siteUrl,
        },
      },
      {
        "@type": "ItemList",
        itemListElement: locations.map((location, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${location.name}, ${location.area}`,
          url: locationUrl(location),
        })),
      },
    ],
  };
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
