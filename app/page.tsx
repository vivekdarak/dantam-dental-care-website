import { ArrowRight, Baby, Calendar, Phone, Star } from "lucide-react";
import Link from "next/link";
import { ClinicLocationCards } from "@/components/clinic-location-cards";
import { FaqSection } from "@/components/faq-section";
import { OpeninaryImage } from "@/components/openinary-image";
import { ServiceCard } from "@/components/service-card";
import { homepageFaqs } from "@/lib/faqs";
import { services, site, stats, testimonials, whyChoose } from "@/lib/site";
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
        <div className="container doctor-story-section">
          <div className="doctor-story-header">
            <div className="eyebrow">Meet Your Dentists</div>
            <h2 className="doctor-names">Dr. Krushnakumar Modi & Dr. Blanch Gonsalves Modi</h2>
          </div>

          <div className="doctor-story">
            <h3>The Heart Behind Dantam Dental Care</h3>
            <div className="doctor-inline-image">
              <OpeninaryImage src="/images/doctors-image.jpeg" alt="Dr. Blanch Gonsalves Modi and Dr. Krushnakumar Modi at Dantam Dental Care" fill sizes="(max-width: 760px) 100vw, 36vw" />
            </div>
                <p>
                  Every smile has a story. Ours began more than 13 years ago, when we started our individual journeys as
                  young dentists with a shared belief: dentistry should always be honest, thoughtful, and centred around
                  the person - not just the problem. We built our practices one patient at a time, and along the way, we
                  learned that relieving pain, calming fear, and helping someone smile confidently again can change far
                  more than their teeth. These experiences shaped the kind of dentists we wanted to become.
                </p>
                <p>
                  Even before we became life partners, we shared the same philosophy. Patients deserve to be heard,
                  respected, and guided towards what is genuinely best for them - without unnecessary treatments or
                  added financial pressure. When we got married, our personal and professional journeys naturally came
                  together, and Dantam Dental Care was born from that shared dream: to create a modern dental clinic
                  where people feel comfortable, informed, and confident about their treatment.
                </p>
                <p>
                  Building the clinic from the ground up was not easy, but every patient who chose us gave our journey
                  greater meaning. Their faith encouraged us to keep learning, adopt newer technology, improve our
                  skills, and uphold the standards we believed in from the beginning. Today, we measure our journey not
                  only through years of practice, but through the thousands of smiles we have restored and the families
                  who continue to return to us.
                </p>
                <p>
                  We have cared for children during their first dental visit, adults seeking relief from pain, seniors
                  hoping to eat and smile comfortably again, and people from every walk of life. Whatever their
                  background, every patient receives the same attention, respect, and commitment. For us, dentistry is
                  about more than fixing teeth. It is about restoring confidence, easing anxiety, and helping people
                  feel like themselves again. Every treatment begins with a conversation, a clear plan, and an honest
                  recommendation.
                </p>
                <p>
                  More than a decade later, our purpose remains unchanged: to practise dentistry with integrity,
                  compassion, and clinical excellence. When you visit Dantam Dental Care, we make you one simple promise
                  - we will treat you with the same sincerity and dedication that we would want for our own family.
                </p>
                <p>
                  Because dentistry is not simply our profession. It is the work we have chosen to build our lives
                  around.
                </p>
                <p>Welcome to Dantam Dental Care - where every smile is personal.</p>
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

      <FaqSection
        items={homepageFaqs}
        title="Frequently asked questions."
        lead="Everything patients commonly ask before visiting Dantam Dental Care, from routine check-ups to implants, whitening, emergencies, and booking appointments."
      />

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
