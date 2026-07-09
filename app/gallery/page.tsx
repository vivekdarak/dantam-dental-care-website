import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { GalleryClient } from "./gallery-client";
import "./gallery.css";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A look inside Dantam Dental Care in Thane, including clinic interiors, technology and patient care spaces.",
};

const images = [
  { src: "/images/dantam-dental-care-clinic-image-2.JPG", alt: "Dantam Dental Care operatory with dental chair", className: "tall" },
  { src: "/images/dantam-dental-care-clinic-image-3.JPG", alt: "Dantam Dental Care clinic interior", className: "" },
  { src: "/images/dantam-dental-care-clinic-image-4.JPG", alt: "Dantam Dental Care treatment room", className: "" },
  { src: "/images/dantam-dental-care-clinic-image-5.JPG", alt: "Dantam Dental Care reception and clinic space", className: "tall" },
  { src: "/images/dantam-dental-care-clinic-image-6.JPG", alt: "Dantam Dental Care consultation area", className: "" },
  { src: "/images/dantam-dental-care-clinic-image-7.JPG", alt: "Dantam Dental Care dental equipment", className: "" },
  { src: "/images/dantam-dental-care-clinic-image-8.JPG", alt: "Dantam Dental Care clinic room", className: "wide" },
  { src: "/images/dantam-dental-care-clinic-image-9.JPG", alt: "Dantam Dental Care interior details", className: "" },
  { src: "/images/dantam-dental-care-clinic-image-10.JPG", alt: "Dantam Dental Care consultation room", className: "" },
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
        <GalleryClient images={images} />
      </section>
    </>
  );
}
