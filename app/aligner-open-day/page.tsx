import type { Metadata } from "next";
import { ArrowRight, BriefcaseBusiness, Calendar, Camera, Check, Clock, HeartHandshake, ScanLine, Smile } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { OpeninaryImage } from "@/components/openinary-image";
import { seoMetadata } from "@/lib/seo-metadata";
import { site } from "@/lib/site";
import { AlignerOpenDayForm, UpcomingOpenDays } from "./aligner-open-day-form";
import "./aligner-open-day.css";

const title = "Open Day for Aligners in Thane";
const description =
  "Book a free Open Day for Aligners consultation at Dantam Dental Care in Thane on the 1st and 3rd Saturday of every month, 4:00 PM to 6:00 PM.";

const audience = [
  {
    icon: Camera,
    title: "Before weddings",
    desc: "Plan your smile before engagement photos, wedding events, and family celebrations.",
    image: "/images/aligners-for-bride.png",
  },
  {
    icon: BriefcaseBusiness,
    title: "Corporate professionals",
    desc: "Explore discreet smile correction for meetings, presentations, and client-facing work.",
    image: "/images/aligners-for-corporate.png",
  },
  {
    icon: Smile,
    title: "Old braces relapse",
    desc: "If your teeth shifted after earlier braces, understand whether aligners can help.",
    image: "/images/old-braces-relapse.png",
  },
  {
    icon: HeartHandshake,
    title: "Adults and teens",
    desc: "Compare aligners and braces before choosing a treatment path for your lifestyle.",
    image: "/images/adult-and-teens-aligners.png",
  },
];

const features = [
  "Nearly invisible in daily life",
  "Removable for meals, brushing, and photos",
  "Digitally planned in stages",
  "Designed around work and social routines",
];

const steps = [
  "Smile and bite check",
  "Discuss gaps, crowding, relapse, wedding timelines, or professional confidence",
  "Understand whether aligners are suitable for your case",
  "Discuss digital scanning or smile preview where needed",
  "Compare aligners, braces, and other smile options",
  "Get clear next steps with no pressure",
];

const faqs = [
  {
    q: "Is the Open Day for Aligners consultation really free?",
    a: "Yes. The consultation fee is waived during Open Day for Aligners hours. Any scan, treatment, or next-step cost will be discussed before you decide.",
  },
  {
    q: "Are aligners painful?",
    a: "Aligners can create mild pressure or soreness when a new tray starts moving teeth. This usually settles as your mouth adapts.",
  },
  {
    q: "Can I remove aligners for meals and photos?",
    a: "Yes. Aligners are removable for eating, drinking anything other than water, brushing, flossing, and important photos.",
  },
  {
    q: "How long does aligner treatment take?",
    a: "Timelines depend on crowding, spacing, bite, and how consistently the trays are worn. The consultation helps estimate what is realistic for your case.",
  },
  {
    q: "What if aligners are not right for me?",
    a: "We will explain the better option clearly, whether that means braces, smile designing, whitening, or no treatment at this stage.",
  },
  {
    q: "Do I need retainers after aligners?",
    a: "Yes. Retainers help maintain the corrected position after aligner or orthodontic treatment.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata({
    title,
    description,
    image: "/images/open-aligners-hero-image.png",
    imageAlt: "Clear aligners consultation at Dantam Dental Care",
    path: "/aligner-open-day",
  });
}

export default function AlignerOpenDayPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Open Day for Aligners", href: "/aligner-open-day" }]} />

      <section className="aligner-campaign-hero">
        <div className="container aligner-hero-single">
          <div className="aligner-hero-copy">
            <div className="eyebrow">Free aligner consultation</div>
            <h1>Open Day for Aligners</h1>
            <p className="lead">
              Visit Dantam Dental Care on the 1st and 3rd Saturday of every month, from 4:00 PM to 6:00 PM, for a free
              consultation to understand if clear aligners are right for your smile, lifestyle, timeline, and budget.
            </p>
            <div className="hero-actions aligner-hero-actions">
              <Link className="button primary" href="#book-free-slot">
                <Calendar size={17} />
                Book your free slot
              </Link>
              <a className="button outline" href={site.whatsapp.href} target="_blank" rel="noreferrer">
                WhatsApp us
                <ArrowRight size={17} />
              </a>
            </div>
            <div className="open-day-time">
              <Clock size={18} />
              <span>1st and 3rd Saturday every month, 4:00 PM - 6:00 PM</span>
            </div>
            <UpcomingOpenDays />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container open-day-intro-grid">
          <div className="promise-card">
            <div className="eyebrow">The promise</div>
            <h2>Find out if clear aligners are right for you without paying a consultation fee.</h2>
            <p>
              Open Day for Aligners is designed as a no-pressure discovery session. We check your smile, understand your
              concerns, explain your options, and help you decide whether aligners, braces, smile designing, or another
              treatment path makes sense for you.
            </p>
            <div className="promise-points">
              {["Free consultation during Open Day hours", "Honest suitability assessment", "Digital planning discussion where needed", "Clear next steps before you decide"].map((item) => (
                <span key={item}>
                  <Check size={17} />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="aligner-hero-image">
            <OpeninaryImage
              src="/images/open-aligners-hero-image.png"
              alt="Clear aligners for smile correction"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 48vw"
            />
          </div>
        </div>
        <div className="container open-day-form-container" id="book-free-slot">
          <AlignerOpenDayForm />
        </div>
      </section>

      <section className="section section-muted">
        <div className="container aligner-info-grid">
          <div>
            <div className="eyebrow">What are aligners?</div>
            <h2 className="section-title">Clear trays that gradually move your teeth into better alignment.</h2>
            <p>
              Clear aligners are transparent, removable trays custom-made for your mouth. They are changed in stages as
              your teeth move closer to the planned result, making them a discreet option for many adults and teens who
              want smile correction without traditional braces.
            </p>
          </div>
          <div className="aligner-feature-grid">
            {features.map((feature) => (
              <div key={feature}>
                <Check size={18} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading-narrow">
            <div className="eyebrow">Who should attend?</div>
            <h2 className="section-title">For people planning a more confident smile without obvious braces.</h2>
          </div>
          <div className="audience-grid">
            {audience.map((item) => {
              const Icon = item.icon;

              return (
                <article className="audience-card" key={item.title}>
                  {"image" in item && item.image ? (
                    <div className="audience-card-image">
                      <OpeninaryImage
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 760px) 100vw, 50vw"
                      />
                    </div>
                  ) : (
                    <Icon size={24} />
                  )}
                  <div className="audience-card-body">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container consultation-grid">
          <div>
            <div className="eyebrow">What happens during the visit?</div>
            <h2 className="section-title">A focused consultation, not a sales pitch.</h2>
            <p>
              The aim is to give you clarity: whether aligners are suitable, what alternatives exist, and what the next
              step would look like if you choose to continue.
            </p>
          </div>
          <ol className="campaign-step-list">
            {steps.map((step, index) => (
              <li key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container comparison-grid">
          <div>
            <div className="eyebrow">Aligners vs braces</div>
            <h2 className="section-title">The better choice depends on your teeth, bite, and habits.</h2>
          </div>
          <div className="comparison-table" role="table" aria-label="Clear aligners compared with braces">
            <div role="row">
              <strong role="columnheader">Factor</strong>
              <strong role="columnheader">Clear aligners</strong>
              <strong role="columnheader">Braces</strong>
            </div>
            {[
              ["Visibility", "Very discreet", "Visible"],
              ["Eating", "Remove trays", "Food care needed"],
              ["Cleaning", "Easier brushing", "More effort"],
              ["Discipline", "High", "Lower"],
              ["Complex cases", "Case-dependent", "Often suitable"],
            ].map(([factor, aligners, braces]) => (
              <div role="row" key={factor}>
                <span role="cell">{factor}</span>
                <span role="cell">{aligners}</span>
                <span role="cell">{braces}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section why-dantam-section">
        <div className="container why-dantam-grid">
          <div className="why-dantam-copy">
            <div className="eyebrow">Why Dantam?</div>
            <h2 className="section-title">Modern, ethical dental care for smile planning in Thane.</h2>
            <p>
              Dantam Dental Care combines resident dentist guidance, orthodontic and Invisalign expertise, 3D intraoral
              scanning, and a clear recommendation process so you can decide with confidence.
            </p>
          </div>
          <div className="why-dantam-points">
            {[
              ["13+ years", "Clinical experience with complete dental care"],
              ["3D scans", "Digital planning support for aligners and smile previews"],
              ["Thane clinics", "Convenient care in Majiwada and Shreenagar"],
              ["No pressure", "Recommendations explained before any next step"],
            ].map(([label, text]) => (
              <div key={label}>
                <ScanLine size={19} />
                <strong>{label}</strong>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container faq-section-grid">
          <div>
            <div className="eyebrow">Common questions</div>
            <h2 className="section-title">Before you book</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.q}>
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section final-open-day-cta">
        <div className="container">
          <div className="final-open-day-card">
            <h2>Ready to understand your smile alignment options?</h2>
            <p>Join Dantam's Open Day for Aligners on the 1st or 3rd Saturday of the month, 4:00 PM to 6:00 PM.</p>
            <div className="hero-actions">
              <Link className="button primary" href="#book-free-slot">
                Book your free slot
              </Link>
              <a className="button outline light" href={site.whatsapp.href} target="_blank" rel="noreferrer">
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
