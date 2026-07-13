import { consultants, team, site } from "@/lib/site";

const siteUrl = "https://dantamdentalcare.com";

type Doctor = (typeof team)[number] | (typeof consultants)[number];

export function doctorAnchorId(name: string) {
  return name
    .toLowerCase()
    .replace(/^dr\.\s*/, "dr-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function credentialParts(credentials: string) {
  const match = credentials.match(/^(BDS \(MUHS\))\s+(A-\d+)$/);

  return {
    credential: match ? match[1] : credentials,
    identifier: match ? match[2] : undefined,
  };
}

function personSchema(doctor: Doctor, isResident: boolean) {
  const id = doctorAnchorId(doctor.name);
  const credentials = credentialParts(doctor.credentials);

  return {
    "@type": "Person",
    "@id": `${siteUrl}/dentists#${id}`,
    name: doctor.name,
    url: `${siteUrl}/dentists#${id}`,
    image: `${siteUrl}${doctor.image}`,
    honorificPrefix: "Dr.",
    jobTitle: doctor.role,
    description: doctor.bio,
    hasCredential: credentials.credential,
    ...(credentials.identifier ? { identifier: credentials.identifier } : {}),
    knowsAbout: doctor.special,
    worksFor: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: site.name,
      url: siteUrl,
    },
    affiliation: {
      "@type": "Organization",
      name: isResident ? site.name : "Dantam Dental Care visiting consultants",
      url: siteUrl,
    },
    ...(isResident
      ? {
          founderOf: {
            "@type": "Organization",
            "@id": `${siteUrl}/#organization`,
            name: site.name,
            url: siteUrl,
          },
        }
      : {}),
  };
}

export function dentistsPageSchema() {
  const residentPeople = team.map((doctor) => personSchema(doctor, true));
  const consultantPeople = consultants.map((doctor) => personSchema(doctor, false));
  const people = [...residentPeople, ...consultantPeople];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/dentists#webpage`,
        name: "Our Dentists",
        url: `${siteUrl}/dentists`,
        description: "Meet the resident dentists and visiting consultants at Dantam Dental Care, Thane.",
        isPartOf: {
          "@type": "WebSite",
          name: site.name,
          url: siteUrl,
        },
        about: people.map((person) => ({ "@id": person["@id"] })),
        mainEntity: {
          "@type": "ItemList",
          itemListElement: people.map((person, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: { "@id": person["@id"] },
          })),
        },
      },
      ...people,
    ],
  };
}

export function DentistsPageJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dentistsPageSchema()).replace(/</g, "\\u003c") }}
    />
  );
}
