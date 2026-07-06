"use client";

import { Quote, Star } from "lucide-react";
import { useState } from "react";
import { testimonials } from "@/lib/site";
import "./testimonial-filter.css";

const filters = ["All", "Root Canal", "Implants", "Aligners", "Kids Dentistry", "Zirconia Cap", "Braces", "Wisdom Teeth"];

export function TestimonialFilter() {
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? testimonials : testimonials.filter((item) => item.service === filter);

  return (
    <>
      <div className="testimonial-filters">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            className={filter === item ? "active" : ""}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="testimonial-grid">
        {visible.map((item) => (
          <article className="testimonial-card card" key={`${item.name}-${item.service}`}>
            <Quote className="quote-icon" size={34} />
            <div className="stars" aria-label="5 star rating">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={16} fill="currentColor" />
              ))}
            </div>
            <p>"{item.quote}"</p>
            <footer>
              <strong>{item.name}</strong>
              <span>
                {item.city} | {item.service}
              </span>
            </footer>
          </article>
        ))}
      </div>
    </>
  );
}
