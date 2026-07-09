import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { pillars, site } from "@/lib/site";
import "./about.css";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Dantam Dental Care in Thane, our story, philosophy, technology and dentist team.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Dentistry, reimagined for your family."
        subtitle="Dantam Dental Care is a modern practice in Thane blending clinical excellence with a warm atmosphere, because a great smile should not require a stressful visit."
      />

      <section className="section">
        <div className="container about-story">
          <div className="story-image">
            <Image src="/images/dantam-reception-area.JPG" alt="Dantam Dental Care reception area" fill sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
          <div>
            <h2 className="section-title">A practice built on trust, technology and time.</h2>
            <div className="story-copy">
              <div className="patient-first">
                <h3>Patient First</h3>
                <p>
                  We understand that healthcare is a significant investment. Our goal is not to be the cheapest option,
                  but to be the safest and most reliable. By maintaining high standards of hygiene and quality, we help
                  protect your health and make your results last as long as possible.
                </p>
                <ul>
                  <li>
                    Our fees reflect a commitment to a zero-risk environment, with advanced sterilization protocols so
                    your safety is never a variable.
                  </li>
                  <li>
                    Our materials, including composites, implants and ceramics, are selected for clinical evidence and
                    long-term durability rather than cost alone.
                  </li>
                  <li>
                    We use advanced, digitally precise equipment for patient procedures at our state-of-the-art clinical
                    facility.
                  </li>
                  <li>
                    We work with elite technicians and labs instead of mass-production facilities to ensure custom,
                    high-precision fits.
                  </li>
                  <li>
                    We believe in doing it once and doing it right, which helps prevent the higher cost of fixing failed
                    treatments later.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="eyebrow">What we stand for</div>
          <h2 className="section-title compact">Six things that shape every visit.</h2>
          <div className="pillars-grid">
            {pillars.map((pillar) => (
              <article className="card" key={pillar.title}>
                <pillar.icon size={28} />
                <h3>{pillar.title}</h3>
                <p>{pillar.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container visit-panel">
          <h2>Come say hello.</h2>
          <p>{site.hours}</p>
          <p>{site.location}</p>
          <div className="hero-actions">
            <Link className="button primary" href="/contact">Book a visit</Link>
            <Link className="button outline" href="/dentists">Meet the team</Link>
          </div>
        </div>
      </section>
    </>
  );
}
