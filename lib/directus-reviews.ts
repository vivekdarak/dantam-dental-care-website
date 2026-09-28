const directusUrl = process.env.DIRECTUS_URL?.replace(/\/$/, "") ?? "";
const directusToken = process.env.DIRECTUS_TOKEN;

export type GoogleReview = {
  id: string;
  reviewer_name: string;
  review_text: string;
  star_rating: number;
  review_date: string | null;
  google_review_url: string | null;
  display_order: number | null;
  show_on_homepage: boolean;
};

type DirectusListResponse<T> = {
  data: T[];
};

const reviewFields = [
  "id",
  "reviewer_name",
  "review_text",
  "star_rating",
  "review_date",
  "google_review_url",
  "display_order",
  "show_on_homepage",
].join(",");

export async function getPublishedGoogleReviews({ homepageOnly = false } = {}) {
  if (!directusUrl) return [];

  const params = new URLSearchParams();
  params.set("filter[status][_eq]", "published");
  if (homepageOnly) params.set("filter[show_on_homepage][_eq]", "true");
  params.set("fields", reviewFields);
  params.set("sort", "display_order,-review_date");
  params.set("limit", homepageOnly ? "12" : "100");

  try {
    const response = await fetch(`${directusUrl}/items/dantam_google_reviews?${params}`, {
      headers: directusToken ? { Authorization: `Bearer ${directusToken}` } : undefined,
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];
    const payload = (await response.json()) as DirectusListResponse<GoogleReview>;
    return payload.data;
  } catch {
    return [];
  }
}
