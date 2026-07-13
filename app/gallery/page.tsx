import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { seoMetadata } from "@/lib/seo-metadata";
import { GalleryClient } from "./gallery-client";
import "./gallery.css";

const title = "Gallery";
const description =
  "A look inside Dantam Dental Care in Thane, including clinic interiors, technology and patient care spaces.";

export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata({
    title: "Dantam Dental Care Gallery",
    description,
    image: "/images/dantam-dental-care-clinic-image-2.jpg",
    imageAlt: "Dantam Dental Care operatory with dental chair",
    path: "/gallery",
  });
}

const images = [
  { src: "/images/dantam-dental-care-clinic-image-2.jpg", alt: "Dantam Dental Care operatory with dental chair", className: "tall" },
  { src: "/images/dantam-dental-care-clinic-image-3.jpg", alt: "Dantam Dental Care clinic interior", className: "" },
  { src: "/images/dantam-dental-care-clinic-image-4.jpg", alt: "Dantam Dental Care treatment room", className: "" },
  { src: "/images/dantam-dental-care-clinic-image-5.jpg", alt: "Dantam Dental Care reception and clinic space", className: "tall" },
  { src: "/images/dantam-dental-care-clinic-image-6.jpg", alt: "Dantam Dental Care consultation area", className: "" },
  { src: "/images/dantam-dental-care-clinic-image-7.jpg", alt: "Dantam Dental Care dental equipment", className: "" },
  { src: "/images/dantam-dental-care-clinic-image-8.jpg", alt: "Dantam Dental Care clinic room", className: "wide" },
  { src: "/images/dantam-dental-care-clinic-image-9.jpg", alt: "Dantam Dental Care interior details", className: "" },
  { src: "/images/dantam-dental-care-clinic-image-10.jpg", alt: "Dantam Dental Care consultation room", className: "" },
];

export default function GalleryPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Gallery", href: "/gallery" }]} />
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
