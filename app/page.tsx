import { ArrowRight, Baby, Calendar, Phone, Star } from "lucide-react";
import Link from "next/link";
import { ClinicLocationCards } from "@/components/clinic-location-cards";
import { OpeninaryImage } from "@/components/openinary-image";
import { ServiceCard } from "@/components/service-card";
import { services, site, stats, testimonials, team, whyChoose } from "@/lib/site";
import "./home.css";

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1>
              Smile for <span>lifetime.</span>
            </h1>
            <p className="lead">
              Modern Implantology, Single-Sitting Root Canals, Cosmetic Dentistry, Children Dental Care,
              Braces and Aligners delivered with warmth by Dr. Krushnakumar Modi and Dr. Blanch Gonsalves Modi.
            </p>
            <div className="hero-actions">
              <Link className="button primary" href="/contact">
                <Calendar size={18} />
                Book Appointment
              </Link>
              <a className="button outline" href={site.phones[0].href}>
                <Phone size={18} />
                {site.phones[0].label}
              </a>
            </div>
            <div className="trust-line">
              <span>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={16} fill="currentColor" />
                ))}
              </span>
              Trusted by 20,000+ patients across Thane and Mumbai
            </div>
          </div>

          <div className="hero-media">
            <OpeninaryImage src="/images/photo4-cropped.jpg" alt="Entrance and reception wall at Dantam Dental Care in Thane" fill priority sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      <section className="stats-strip">
        <div className="container stats-grid">
          {stats.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Our Services</div>
              <h2 className="section-title">Complete dental care, in one calm place.</h2>
            </div>
            <p className="lead">
              From your child's first check-up to full-mouth rehabilitation, every treatment
              is delivered with modern technology and a light touch.
            </p>
          </div>
          <div className="services-grid">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split-section">
          <div className="doctor-visual">
            <OpeninaryImage src="/images/doctors-image.jpeg" alt="Dr. Blanch Gonsalves Modi and Dr. Krushnakumar Modi at Dantam Dental Care" fill sizes="(max-width: 900px) 100vw, 48vw" />
          </div>
          <div>
            <div className="eyebrow">Meet Your Dentists</div>
            <h2 className="section-title">A husband-and-wife team behind every smile.</h2>
            <div className="doctor-list">
              {team.map((doctor) => (
                <article key={doctor.name}>
                  <h3>{doctor.name}</h3>
                  <span>{doctor.role} | {doctor.credentials}</span>
                  <p>{doctor.bio}</p>
                </article>
              ))}
            </div>
            <Link className="button dark" href="/dentists">
              Meet the team <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Why Dantam</div>
              <h2 className="section-title">Care that feels considered, not clinical.</h2>
            </div>
          </div>
          <div className="why-grid">
            {whyChoose.map((item) => (
              <article key={item.title}>
                <item.icon size={28} />
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Our Clinics</div>
              <h2 className="section-title">Choose the clinic closest to you.</h2>
            </div>
            <p className="lead">
              Visit Dantam Dental Care and our associated clinics across Thane and Nalasopara
              for complete dental care under one trusted team.
            </p>
          </div>
          <ClinicLocationCards />
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Kind Words</div>
              <h2 className="section-title">From smiles we have cared for.</h2>
            </div>
          </div>
          <div className="home-testimonials">
            {testimonials.slice(0, 3).map((item) => (
              <article className="card" key={item.name}>
                <div className="stars">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={15} fill="currentColor" />
                  ))}
                </div>
                <p>"{item.quote}"</p>
                <strong>{item.name}</strong>
                <span>{item.service}</span>
              </article>
            ))}
          </div>
          <Link className="button outline" href="/testimonials">
            Read more stories <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <Baby size={44} />
          <h2>Ready for a healthier smile?</h2>
          <p>Book an appointment today and we will take care of the rest.</p>
          <div className="hero-actions">
            <Link className="button primary" href="/contact">Book Appointment</Link>
            <a className="button outline light" href={site.whatsapp.href} target="_blank" rel="noreferrer">WhatsApp us</a>
          </div>
        </div>
      </section>
    </>
  );
}
