import type { Metadata } from "next";
import Link from "next/link";
import { OpeninaryImage } from "@/components/openinary-image";
import { PageHero } from "@/components/page-hero";
import { consultants, team } from "@/lib/site";
import "./dentists.css";

export const metadata: Metadata = {
  title: "Our Dentists",
  description: "Meet the resident dentists and visiting consultants at Dantam Dental Care, Thane.",
};

export default function DentistsPage() {
  return (
    <>
      <PageHero
        eyebrow="Meet the Team"
        title="Experienced doctors for complete dental care."
        subtitle="Meet the resident dentists and trusted visiting consultants who support treatment planning, surgery and specialist care at Dantam Dental Care."
      />

      <section className="section doctors-section">
        <div className="container">
          <div className="section-heading doctors-heading">
            <div>
              <div className="eyebrow">Resident Dentists</div>
              <h2 className="section-title compact">Your primary care team at the clinic.</h2>
            </div>
          </div>
          <div className="doctor-grid">
            {team.map((doctor) => (
              <article className="card doctor-card" key={doctor.name}>
                <div className="doctor-portrait">
                  <OpeninaryImage
                    src={doctor.image}
                    alt={`${doctor.name} at Dantam Dental Care`}
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    aspectRatio="4:5"
                    cropMode="fill"
                  />
                </div>
                <div className="doctor-card-body">
                  <h3>{doctor.name}</h3>
                  <strong>{doctor.role}</strong>
                  <span>{doctor.credentials}</span>
                  <p>{doctor.bio}</p>
                  <div className="doctor-tags">
                    {doctor.special.map((item) => (
                      <em key={item}>{item}</em>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="eyebrow">Visiting consultants</div>
          <h2 className="section-title compact">Specialists who join us for complex cases.</h2>
          <div className="doctor-grid visiting-doctor-grid">
            {consultants.map((doctor) => (
              <article className="card doctor-card" key={doctor.name}>
                <div className="doctor-portrait">
                  <OpeninaryImage
                    src={doctor.image}
                    alt={`${doctor.name} at Dantam Dental Care`}
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    aspectRatio="4:5"
                    cropMode="fill"
                  />
                </div>
                <div className="doctor-card-body">
                  <h3>{doctor.name}</h3>
                  <strong>{doctor.role}</strong>
                  <span>{doctor.credentials}</span>
                  <p>{doctor.bio}</p>
                  <div className="doctor-tags">
                    {doctor.special.map((item) => (
                      <em key={item}>{item}</em>
                    ))}
                  </div>
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
