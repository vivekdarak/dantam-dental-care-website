import type { Metadata } from "next";
import { Clock, Mail, MessageCircle, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { patientInstructionSections, type InstructionSection } from "@/lib/patient-instructions";
import { seoMetadata } from "@/lib/seo-metadata";
import { site } from "@/lib/site";
import "./patient-instructions.css";

const title = "Patient Instructions";
const description =
  "Post-treatment dental instructions in English and Marathi from Dantam Dental Care, including extraction, surgery, root canal and general patient guidance.";

export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata({
    title: "Patient Instructions | Dantam Dental Care",
    description,
    image: "/images/hero-clinic.jpg",
    imageAlt: "Dantam Dental Care clinic in Thane",
    path: "/patient-instructions",
  });
}

export default function PatientInstructionsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Patient Instructions", href: "/patient-instructions" }]} />
      <PageHero
        eyebrow="Patient Care"
        title="Patient Instructions"
        subtitle="Please follow these instructions after your dental treatment. For urgent concerns, call or WhatsApp the clinic."
      >
        <a className="button primary" href={site.phones[0].href}>
          <Phone size={18} />
          Call Clinic
        </a>
        <a className="button outline" href={site.whatsapp.href} target="_blank" rel="noreferrer">
          <MessageCircle size={18} />
          WhatsApp
        </a>
      </PageHero>

      <section className="patient-contact-strip">
        <div className="container patient-contact-grid">
          <div>
            <Clock size={20} />
            <span>{site.hours}</span>
          </div>
          <a href={site.phones[0].href}>
            <Phone size={20} />
            <span>{site.phones[0].label}</span>
          </a>
          <a href={site.whatsapp.href} target="_blank" rel="noreferrer">
            <MessageCircle size={20} />
            <span>{site.whatsapp.label}</span>
          </a>
          <a href={site.email.href}>
            <Mail size={20} />
            <span>{site.email.label}</span>
          </a>
        </div>
      </section>

      <section className="section patient-instructions">
        <div className="container instruction-stack">
          {patientInstructionSections.map((section) => (
            <InstructionSectionView key={section.id} section={section} />
          ))}
        </div>
      </section>

      <section className="patient-help-band">
        <div className="container">
          <div>
            <div className="eyebrow">Need Help?</div>
            <h2>Contact the clinic if symptoms feel unusual.</h2>
            <p>
              If you have severe pain, swelling, bleeding, fever, or any concern after treatment, please contact us
              promptly.
            </p>
          </div>
          <div className="patient-help-actions">
            <a className="button primary" href={site.phones[0].href}>
              <Phone size={17} />
              Call Clinic
            </a>
            <a className="button outline light" href={site.whatsapp.href} target="_blank" rel="noreferrer">
              <MessageCircle size={17} />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function InstructionSectionView({ section }: { section: InstructionSection }) {
  return (
    <article className="instruction-section" id={section.id}>
      <h2>{section.title}</h2>
      <div className="instruction-columns">
        <InstructionList title={section.englishTitle} items={section.english} />
        <InstructionList title={section.marathiTitle} items={section.marathi} lang="mr" />
      </div>
    </article>
  );
}

function InstructionList({ title, items, lang }: { title: string; items: string[]; lang?: string }) {
  return (
    <div className="instruction-column" lang={lang}>
      <h3>{title}</h3>
      <ol>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </div>
  );
}
