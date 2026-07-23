import { serviceContent, services, site, type ServiceSlug } from "@/lib/site";

const siteUrl = "https://dantamdentalcare.com";

type Service = (typeof services)[number];

function serviceUrl(service: Service) {
  return `${siteUrl}/services/${service.slug}`;
}

function serviceImage(service: Service) {
  return `${siteUrl}${service.image}`;
}

export function serviceDetailSchema(service: Service) {
  const detail = serviceContent[service.slug as ServiceSlug];

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${serviceUrl(service)}#service`,
    name: service.title,
    url: serviceUrl(service),
    mainEntityOfPage: serviceUrl(service),
    description: detail.hero,
    image: serviceImage(service),
    serviceType: service.title,
    provider: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: site.name,
      url: siteUrl,
    },
    areaServed: [
      { "@type": "City", name: "Thane" },
      { "@type": "City", name: "Nalasopara" },
      { "@type": "AdministrativeArea", name: "Maharashtra" },
    ],
    providerMobility: "static",
    availableChannel: [
      {
        "@type": "ServiceChannel",
        serviceUrl: `${siteUrl}/contact`,
        name: "Book consultation",
      },
      {
        "@type": "ServiceChannel",
        servicePhone: site.phones[0].label,
        name: "Call clinic",
      },
      {
        "@type": "ServiceChannel",
        serviceUrl: site.whatsapp.href,
        name: "WhatsApp appointment support",
      },
    ],
    audience: {
      "@type": "Audience",
      audienceType: detail.who.join(", "),
    },
  };
}

export function servicesPageSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/services#webpage`,
        name: "Dental Services in Thane",
        url: `${siteUrl}/services`,
        description:
          "Explore tooth extraction, root canal treatments, braces, aligners, implants, intraoral scanning, smile designing, child dental care, gum surgery, teeth whitening and dentures.",
        isPartOf: {
          "@type": "WebSite",
          name: site.name,
          url: siteUrl,
        },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: services.map((service, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Service",
              "@id": `${serviceUrl(service)}#service`,
              name: service.title,
              url: serviceUrl(service),
              description: service.short,
              image: serviceImage(service),
              provider: {
                "@type": "Organization",
                "@id": `${siteUrl}/#organization`,
                name: site.name,
              },
            },
          })),
        },
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
