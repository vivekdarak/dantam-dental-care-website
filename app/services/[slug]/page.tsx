import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Calendar, Check, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { serviceContent, services, site, type ServiceSlug } from "@/lib/site";
import "./service-detail.css";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: `${service.title} in Thane`,
    description: serviceContent[service.slug].hero,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const detail = serviceContent[service.slug as ServiceSlug];

  return (
    <>
      <section className="service-hero">
        <div className="container service-hero-grid">
          <div>
            <Link className="back-link" href="/services">
              <ArrowLeft size={15} />
              All Services
            </Link>
            <h1>{service.title}</h1>
            <p className="lead">{detail.hero}</p>
            <div className="hero-actions">
              <Link className="button primary" href="/contact">
                <Calendar size={17} />
                Book Consultation
              </Link>
              <a className="button outline" href={site.phones[0].href}>
                <Phone size={17} />
                Call clinic
              </a>
            </div>
          </div>
          <div className="service-hero-image">
            <Image src={service.image} alt={service.title} fill priority sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container service-body">
          <article className="service-main">
            <section>
              <h2>What it is</h2>
              <p>{detail.what}</p>
            </section>

            <section>
              <h2>Who it is for</h2>
              <ul className="check-list">
                {detail.who.map((item) => (
                  <li key={item}>
                    <Check size={19} />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2>Procedure</h2>
              <ol className="step-list">
                {detail.steps.map((step, index) => (
                  <li key={step.title}>
                    <span>{index + 1}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2>Benefits</h2>
              <div className="benefit-grid">
                {detail.benefits.map((benefit) => (
                  <div key={benefit}>
                    <Check size={18} />
                    {benefit}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2>Frequently asked</h2>
              <div className="faq-list">
                {detail.faqs.map((faq) => (
                  <details key={faq.q}>
                    <summary>{faq.q}</summary>
                    <p>{faq.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </article>

          <aside className="service-aside">
            <div className="aside-card">
              <h3>Ready to begin?</h3>
              <p>Book a consultation and we will walk you through your options with zero pressure.</p>
              <Link className="button primary" href="/contact">Book Appointment</Link>
              <a href={site.whatsapp.href} target="_blank" rel="noreferrer">or WhatsApp us</a>
            </div>
            <div className="other-services">
              <h4>Other services</h4>
              {services.filter((item) => item.slug !== service.slug).slice(0, 5).map((item) => (
                <Link key={item.slug} href={`/services/${item.slug}`}>
                  {item.title}
                  <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
