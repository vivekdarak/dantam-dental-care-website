import { site } from "@/lib/site";

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
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: site.name,
    url: siteUrl,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function OrganizationJsonLd() {
  return <JsonLd data={organizationSchema()} />;
}

export function WebsiteJsonLd() {
  return <JsonLd data={websiteSchema()} />;
}
