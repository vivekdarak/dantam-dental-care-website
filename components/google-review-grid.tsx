import { ExternalLink, Star } from "lucide-react";
import type { GoogleReview } from "@/lib/directus-reviews";
import "./google-review-grid.css";

function GoogleLogo() {
  return (
    <svg className="google-review-logo" viewBox="0 0 18 18" role="img" aria-label="Google">
      <path fill="#4285F4" d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.482h4.844a4.14 4.14 0 0 1-1.797 2.715v2.258h2.909c1.703-1.568 2.684-3.879 2.684-6.614Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.468-.806 5.956-2.181l-2.909-2.258c-.806.54-1.835.859-3.047.859-2.344 0-4.328-1.585-5.037-3.714H.956v2.332A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.963 10.706A5.41 5.41 0 0 1 3.682 9c0-.592.102-1.168.281-1.706V4.962H.956A9 9 0 0 0 0 9c0 1.452.347 2.827.956 4.038l3.007-2.332Z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.507.454 3.441 1.346l2.581-2.58C13.464.892 11.426 0 9 0A9 9 0 0 0 .956 4.962l3.007 2.332C4.672 5.165 6.656 3.58 9 3.58Z" />
    </svg>
  );
}

function relativeReviewDate(value: string | null) {
  if (!value) return null;

  const reviewDate = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(reviewDate.getTime())) return null;

  const elapsedDays = Math.max(0, Math.round((Date.now() - reviewDate.getTime()) / 86_400_000));
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (elapsedDays < 14) return formatter.format(-elapsedDays, "day");
  if (elapsedDays < 90) return formatter.format(-Math.max(1, Math.round(elapsedDays / 7)), "week");
  if (elapsedDays < 730) return formatter.format(-Math.max(1, Math.round(elapsedDays / 30.4375)), "month");
  return formatter.format(-Math.max(1, Math.round(elapsedDays / 365.25)), "year");
}

function safeGoogleReviewUrl(value: string | null) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function GoogleReviewGrid({ reviews, homepage = false }: { reviews: GoogleReview[]; homepage?: boolean }) {
  if (!reviews.length) return null;

  return (
    <div className={`google-review-grid${homepage ? " google-review-grid--homepage" : ""}`}>
      {reviews.map((review) => {
        const rating = Math.min(5, Math.max(1, review.star_rating));
        const relativeDate = relativeReviewDate(review.review_date);
        const reviewUrl = safeGoogleReviewUrl(review.google_review_url);

        return (
          <article className="google-review-card card" key={review.id}>
            <header className="google-review-header">
              <div className="google-review-source">
                <GoogleLogo />
                <div className="google-review-attribution">
                  <strong>{review.reviewer_name}</strong>
                  <div className="google-review-stars" aria-label={`${rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} size={16} fill={index < rating ? "currentColor" : "none"} aria-hidden="true" />
                    ))}
                  </div>
                </div>
              </div>
              {relativeDate && <span className="google-review-date">{relativeDate}</span>}
            </header>
            <blockquote>
              <p>“{review.review_text}”</p>
            </blockquote>
            {reviewUrl && (
              <footer>
                <a href={reviewUrl} target="_blank" rel="noreferrer">
                  View on Google <ExternalLink size={13} aria-hidden="true" />
                </a>
              </footer>
            )}
          </article>
        );
      })}
    </div>
  );
}
