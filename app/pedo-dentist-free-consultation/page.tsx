import type { Metadata } from "next";
import { ArrowRight, Baby, Calendar, Check, Clock, HeartPulse, MapPin, MessageCircle, ShieldCheck, Sparkles, Utensils } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { OpeninaryImage } from "@/components/openinary-image";
import { seoMetadata } from "@/lib/seo-metadata";
import { locations, site } from "@/lib/site";
import { PedoDentistCampaignForm } from "./pedo-dentist-campaign-form";
import "./pedo-dentist-campaign.css";

const title = "Free Pediatric Dental Consultation in Majiwada";
const description =
  "Register for a free pediatric dental consultation for kids at Dantam Dental Care, Majiwada from 26 September to 3 October 2026.";

const campaignDates = "26 September 2026 - 3 October 2026";
const majiwada = locations.find((location) => location.slug === "majiwada");

const parentConcerns = [
  {
    icon: ShieldCheck,
    title: "Black spots or cavities",
    desc: "Understand whether it can be monitored or needs early treatment.",
  },
  {
    icon: Utensils,
    title: "Pain while eating",
    desc: "Check sensitivity, chewing discomfort, food lodgement, or one-side chewing.",
  },
  {
    icon: Baby,
    title: "Milk teeth concerns",
    desc: "Review shaking teeth, delayed falling, or new teeth coming behind milk teeth.",
  },
  {
    icon: Sparkles,
    title: "New teeth coming oddly",
    desc: "Get guidance on crowding, delayed eruption, spacing, or irregular tooth position.",
  },
  {
    icon: HeartPulse,
    title: "Brushing and food habits",
    desc: "Learn what routine is practical for your child's age and daily habits.",
  },
  {
    icon: MessageCircle,
    title: "First dental check-up",
    desc: "Bring your child before pain starts and understand what is normal.",
  },
];

const preventionPoints = [
  "Easier to manage small issues early",
  "Helps avoid pain-led emergency visits",
  "Supports better eating and brushing habits",
  "Gives parents a clear home-care routine",
  "Monitors growth and tooth development",
  "Reduces guesswork around cavities and black spots",
];

const audience = [
  "Parents of children aged 2 to 12",
  "Parents noticing cavities, black spots, or food getting stuck",
  "Parents whose child has tooth pain, swelling, or sensitivity",
  "Parents seeing milk teeth fall or new teeth erupt",
  "Parents who want brushing and diet guidance",
  "Parents planning their child's first dental visit",
];

const steps = [
  "Child's teeth and gums are checked gently",
  "Cavities, black spots, pain, swelling, or sensitivity are reviewed",
  "Milk teeth and new teeth development is assessed where relevant",
  "Brushing, food habits, and preventive care are explained to parents",
  "The dentist explains whether treatment is needed now or monitoring is enough",
  "You receive clear next steps with no pressure",
];

const whyDantam = [
  ["Majiwada only", "Campaign consultation at Dantam Dental Care, Majiwada"],
  ["Free consultation", "Available during 26 September to 3 October 2026"],
  ["Parent-focused", "Clear explanations for what parents should watch for"],
  ["Prevention first", "Guidance before small dental concerns become painful"],
  ["Clear next steps", "Treatment is recommended only when it is needed"],
];

const faqs = [
  {
    q: "Is the pediatric dental consultation really free?",
    a: "Yes. The consultation fee is waived during the campaign dates. If any treatment, X-ray, or next step is advised, the cost will be explained before you decide.",
  },
  {
    q: "What age group is this campaign for?",
    a: "The campaign is mainly for parents of children aged 2 to 12, including toddlers, school-going children, and kids in the milk teeth or mixed teeth stage.",
  },
  {
    q: "Should I bring my child if there is only a small black spot?",
    a: "Yes. Small spots are easier to understand early. The consultation helps you know whether it is staining, early decay, or something that needs care.",
  },
  {
    q: "Do milk tooth cavities need treatment?",
    a: "Sometimes they do. Milk teeth help with chewing, comfort, speech, and guiding permanent teeth, so the dentist will explain whether treatment or monitoring is better for your child's case.",
  },
  {
    q: "What if my child is scared of dentists?",
    a: "The visit is planned as a gentle check and parent guidance session. Please tell us while registering if your child is anxious so the team can prepare accordingly.",
  },
  {
    q: "Is this available at both clinics?",
    a: "No. This campaign is available only at Dantam Dental Care, Majiwada during the campaign week.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata({
    title,
    description,
    image: "/images/pedo-dentist-campaign-hero-image.png",
    imageAlt: "Parent and child during a gentle pediatric dental consultation at Dantam Dental Care",
    path: "/pedo-dentist-free-consultation",
  });
}

export default function PedoDentistFreeConsultationPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Free Pediatric Dental Consultation", href: "/pedo-dentist-free-consultation" },
        ]}
      />

      <section className="pedo-campaign-hero">
        <div className="container pedo-hero-single">
          <div className="pedo-hero-copy">
            <div className="eyebrow">Free pediatric dental consultation</div>
            <h1>Free Pediatric Dental Consultation for Kids</h1>
            <p className="lead">
              A parent-focused consultation to understand your child's oral health, spot early concerns, and learn the
              right preventive dental care before small problems become painful or complicated.
            </p>
            <div className="pedo-hero-location-details">
              <p className="pedo-hero-date">
                <Clock size={16} />
                <span>{campaignDates}</span>
              </p>
              <p className="pedo-hero-address">
                <span>2nd floor (P3), I-Wing Retail, Rustomjee Azziano, near Rustomjee Cambridge School, Majiwada, Thane (W) - 400 601.</span>
                <a href={majiwada?.mapLink || site.mapLink} target="_blank" rel="noreferrer" aria-label="Open Majiwada clinic on Google Maps">
                  <MapPin size={16} />
                </a>
              </p>
            </div>
            <div className="hero-actions pedo-hero-actions">
              <Link className="button primary" href="#book-free-slot">
                <Calendar size={17} />
                Register for free consultation
              </Link>
              <a className="button outline" href={site.whatsapp.href} target="_blank" rel="noreferrer">
                WhatsApp us
                <ArrowRight size={17} />
              </a>
            </div>

          </div>
        </div>
      </section>

      <section className="section">
        <div className="container pedo-registration-module">
          <div className="pedo-promise-card">
            <div className="eyebrow">The promise</div>
            <div className="pedo-promise-image">
              <OpeninaryImage
                src="/images/pedo-dentist-campaign-hero-image.png"
                alt="Parent and child during a gentle pediatric dental consultation"
                fill
                aspectRatio="4:3"
                cropMode="fill"
                sizes="(max-width: 900px) 100vw, 48vw"
              />
            </div>
            <h2>Understand your child's dental health early.</h2>
            <p>
              Parents often track height, weight, diet, and school health, but dental concerns are noticed only after
              pain, cavities, black spots, swelling, or eating difficulty. This consultation helps you know what is
              normal, what needs attention, and what can be prevented.
            </p>
            <div className="pedo-promise-points">
              {["Free consultation during campaign week", "Parent-focused guidance", "Early cavity and gum check", "Clear next steps, no pressure"].map((item) => (
                <span key={item}>
                  <Check size={17} />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="pedo-form-container" id="book-free-slot">
            <PedoDentistCampaignForm />
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="section-heading-narrow">
            <div className="eyebrow">Common parent questions</div>
            <h2 className="section-title">What should you get checked?</h2>
          </div>
          <div className="pedo-concern-grid">
            {parentConcerns.map((item) => {
              const Icon = item.icon;

              return (
                <article className="pedo-concern-card" key={item.title}>
                  <Icon size={24} />
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container pedo-info-grid">
          <div>
            <div className="eyebrow">Prevention first</div>
            <h2 className="section-title">Children's dental care is part of overall health.</h2>
            <p>
              Healthy teeth help children chew comfortably, speak clearly, build better food habits, and avoid dental
              pain. The goal is not to create fear. The goal is to help parents know what to watch for and when to act.
            </p>
          </div>
          <div className="pedo-feature-grid">
            {preventionPoints.map((point) => (
              <div key={point}>
                <Check size={18} />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="section-heading-narrow">
            <div className="eyebrow">Who should attend?</div>
            <h2 className="section-title">For parents of kids aged 2 to 12.</h2>
          </div>
          <div className="pedo-audience-grid">
            {audience.map((item) => (
              <article className="pedo-audience-card" key={item}>
                <Check size={18} />
                <p>{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container pedo-consultation-grid">
          <div>
            <div className="eyebrow">What happens during the visit?</div>
            <h2 className="section-title">A focused consultation for parents, not a sales pitch.</h2>
            <p>
              The visit is meant to give you clarity about your child's current oral health, daily care, and whether
              anything needs attention now.
            </p>
          </div>
          <ol className="pedo-step-list">
            {steps.map((step, index) => (
              <li key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section pedo-why-dantam-section">
        <div className="container pedo-why-dantam-grid">
          <div className="pedo-why-dantam-copy">
            <div className="eyebrow">Why Dantam?</div>
            <h2 className="section-title">Pediatric dental guidance at Dantam Dental Care, Majiwada.</h2>
            <p>2nd floor (P3), I-Wing Retail, Rustomjee Azziano, near Rustomjee Cambridge School, Majiwada, Thane (W) - 400 601.</p>
            <a className="button outline light" href={majiwada?.mapLink || site.mapLink} target="_blank" rel="noreferrer">
              <MapPin size={17} />
              Open map
            </a>
          </div>
          <div className="pedo-why-dantam-points">
            {whyDantam.map(([label, text]) => (
              <div key={label}>
                <ShieldCheck size={19} />
                <strong>{label}</strong>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container pedo-faq-section-grid">
          <div>
            <div className="eyebrow">Common questions</div>
            <h2 className="section-title">Before you register</h2>
          </div>
          <div className="pedo-faq-list">
            {faqs.map((faq) => (
              <details key={faq.q}>
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section pedo-final-cta">
        <div className="container">
          <div className="pedo-final-card">
            <h2>Ready to understand your child's dental health?</h2>
            <p>
              Register for a free pediatric dental consultation at Dantam Dental Care, Majiwada from 26 September to 3
              October 2026.
            </p>
            <div className="hero-actions">
              <Link className="button primary" href="#book-free-slot">
                Register for free consultation
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
