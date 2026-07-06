import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { consultants, team } from "@/lib/site";
import "./dentists.css";

export const metadata: Metadata = {
  title: "Our Dentists",
  description: "Meet Dr. Krushnakumar Modi and Dr. Blanch Gonsalves Modi at Dantam Dental Care, Thane.",
};

export default function DentistsPage() {
  return (
    <>
      <PageHero
        eyebrow="Meet the Team"
        title="Two dentists. One shared philosophy."
        subtitle="A husband-and-wife team combining implantology and cosmetic dentistry expertise, supported by trusted visiting consultants."
      />

      <section className="section dentists-photo-section">
        <div className="container dentists-photo">
          <Image src="/images/doctors-image.jpeg" alt="Dr. Blanch Gonsalves Modi and Dr. Krushnakumar Modi at Dantam Dental Care" fill sizes="100vw" />
        </div>
      </section>

      <section className="container dentist-grid">
        {team.map((doctor) => (
          <article className="card dentist-card" key={doctor.name}>
            <doctor.icon size={30} />
            <h2>{doctor.name}</h2>
            <strong>{doctor.role}</strong>
            <span>{doctor.credentials}</span>
            <p>{doctor.bio}</p>
            <div>
              {doctor.special.map((item) => (
                <em key={item}>{item}</em>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="eyebrow">Visiting consultants</div>
          <h2 className="section-title compact">Specialists who join us for complex cases.</h2>
          <div className="consultant-grid">
            {consultants.map((doctor) => (
              <article className="card consultant-card" key={doctor.name}>
                <doctor.icon size={28} />
                <div>
                  <h3>{doctor.name}</h3>
                  <strong>{doctor.role}</strong>
                  <span>{doctor.credentials}</span>
                  <p>{doctor.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container dentist-cta">
          <h2>Meet us in person.</h2>
          <p>Book a friendly consultation and we will walk you through your options with zero pressure.</p>
          <Link className="button primary" href="/contact">Book Appointment</Link>
        </div>
      </section>
    </>
  );
}
