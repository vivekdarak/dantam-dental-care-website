import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import "./gallery.css";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A look inside Dantam Dental Care in Thane, including clinic interiors, technology and patient care spaces.",
};

const images = [
  { src: "/images/gallery-1.jpg", alt: "Warm dental clinic waiting area", className: "tall" },
  { src: "/images/hero-clinic.jpg", alt: "Modern dental operatory", className: "" },
  { src: "/images/gallery-3.jpg", alt: "Sterilised dental instruments", className: "" },
  { src: "/images/gallery-5.jpg", alt: "Reception area with plants", className: "tall" },
  { src: "/images/gallery-6.jpg", alt: "Dental care moment", className: "" },
  { src: "/images/gallery-2.jpg", alt: "Dental chair with natural light", className: "" },
  { src: "/images/gallery-4.jpg", alt: "Patient with confident bright smile", className: "wide" },
];

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Step inside Dantam."
        subtitle="A calm, welcoming clinic designed to make dental visits feel restful, not clinical."
      />
      <section className="section">
        <div className="container gallery-grid">
          {images.map((image) => (
            <figure className={image.className} key={image.src}>
              <Image src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 100vw, 25vw" />
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
