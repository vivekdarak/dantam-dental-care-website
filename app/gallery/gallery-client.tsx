"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { OpeninaryImage } from "@/components/openinary-image";

type GalleryImage = {
  src: string;
  alt: string;
  className: string;
};

type GalleryClientProps = {
  images: GalleryImage[];
};

export function GalleryClient({ images }: GalleryClientProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const activeImage = activeIndex === null ? null : images[activeIndex];
  const activeNumber = activeIndex === null ? 0 : activeIndex + 1;

  function closeLightbox() {
    setActiveIndex(null);
  }

  function showPrevious() {
    setActiveIndex((current) => {
      if (current === null) return current;
      return current === 0 ? images.length - 1 : current - 1;
    });
  }

  function showNext() {
    setActiveIndex((current) => {
      if (current === null) return current;
      return current === images.length - 1 ? 0 : current + 1;
    });
  }

  useEffect(() => {
    if (activeIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex]);

  function handleTouchEnd(touchEndX: number) {
    if (touchStartX === null) return;
    const delta = touchStartX - touchEndX;
    setTouchStartX(null);

    if (Math.abs(delta) < 45) return;
    if (delta > 0) {
      showNext();
    } else {
      showPrevious();
    }
  }

  return (
    <>
      <div className="container gallery-grid">
        {images.map((image, index) => (
          <button
            className={`gallery-tile ${image.className}`}
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Open image ${index + 1} of ${images.length}`}
          >
            <OpeninaryImage src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 100vw, 25vw" />
          </button>
        ))}
      </div>

      {activeImage && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Gallery image viewer">
          <button className="lightbox-backdrop" type="button" onClick={closeLightbox} aria-label="Close gallery viewer" />
          <button className="lightbox-close" type="button" onClick={closeLightbox} aria-label="Close gallery viewer">
            <X size={24} />
          </button>
          <button className="lightbox-nav previous" type="button" onClick={showPrevious} aria-label="Previous image">
            <ChevronLeft size={30} />
          </button>
          <div
            className="lightbox-image-wrap"
            onTouchStart={(event) => setTouchStartX(event.changedTouches[0].clientX)}
            onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0].clientX)}
          >
            <OpeninaryImage
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              priority
              sizes="100vw"
            />
          </div>
          <button className="lightbox-nav next" type="button" onClick={showNext} aria-label="Next image">
            <ChevronRight size={30} />
          </button>
          <div className="lightbox-count">
            {activeNumber} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
