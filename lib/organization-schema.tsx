import { locations, site } from "@/lib/site";

const siteUrl = "https://dantamdentalcare.com";

export function organizationSchema() {
  const serviceNames = [
    "Dental implants",
    "Root canal treatment",
    "Cosmetic dentistry",
    "Braces",
    "Aligners",
    "Paediatric dentistry",
    "Teeth whitening",
    "Dentures",
  ];

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: site.name,
    description:
      "Dantam Dental Care is a modern dental practice offering implantology, cosmetic dentistry, single-sitting root canal treatments, aligners, braces and paediatric dental care across Thane and Nalasopara.",
    url: siteUrl,
    logo: `${siteUrl}/images/dantam-logo.png`,
    email: site.email.label,
    telephone: site.phones[0].label,
    slogan: site.tagline,
    founder: [
      {
        "@type": "Person",
        name: "Dr. Krushnakumar Modi",
      },
      {
        "@type": "Person",
        name: "Dr. Blanch Gonsalves Modi",
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phones[0].label,
      contactType: "appointments",
      areaServed: ["Thane 400601", "Thane 400604", "Nalasopara 401203"],
      availableLanguage: ["English", "Hindi", "Marathi"],
    },
    knowsAbout: serviceNames,
    department: locations.map((location) => ({
      "@type": "Dentist",
      "@id": `${siteUrl}/locations/${location.slug}#dentist`,
      name: location.name,
      url: `${siteUrl}/locations/${location.slug}`,
    })),
  };
}

export function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()).replace(/</g, "\\u003c") }}
    />
  );
}
