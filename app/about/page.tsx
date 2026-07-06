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
            <Image src="/images/gallery-5.jpg" alt="Dantam Dental Care reception area" fill sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
          <div>
            <div className="eyebrow">Our Story</div>
            <h2 className="section-title">A practice built on trust, technology and time.</h2>
            <div className="story-copy">
              <p>
                Founded by Dr. Krushnakumar Modi and Dr. Blanch Gonsalves Modi, Dantam brings together over a decade of
                clinical experience in implantology, cosmetic dentistry and paediatric care.
              </p>
              <p>
                Our name, Dantam, is Sanskrit for tooth, and our promise is simple: to help you smile for a lifetime.
                Whether it is your child's first check-up or a full-mouth rehabilitation, you receive honest advice,
                transparent pricing and calm attention.
              </p>
              <p>
                We invest continuously in technology, from intraoral 3D scanning to rotary endodontics and digital
                implant planning, so outcomes are precise, comfortable and long-lasting.
              </p>
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
