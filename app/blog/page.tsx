import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { OpeninaryImage } from "@/components/openinary-image";
import { PageHero } from "@/components/page-hero";
import { blogDescription, blogFeaturedImageSrc, getPublishedBlogPosts } from "@/lib/directus-blog";
import { seoMetadata } from "@/lib/seo-metadata";
import "./blog.css";

const title = "Dental Blog";
const description = "Dental care articles, clinical cases and patient guidance from Dantam Dental Care.";

export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata({
    title,
    description,
    image: "/images/hero-clinic.jpg",
    imageAlt: "Dantam Dental Care clinic interior in Thane",
    path: "/blog",
  });
}

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }]} />
      <PageHero
        eyebrow="Dental Blog"
        title="Patient guidance and clinical stories."
        subtitle="Helpful dental care articles, treatment explainers and real clinical cases from Dantam Dental Care."
      />
      <section className="section">
        <div className="container">
          {posts.length ? (
            <div className="blog-list">
              {posts.map((post) => {
                const imagePath = blogFeaturedImageSrc(post) ?? "/images/hero-clinic.jpg";

                return (
                  <Link className="blog-card card" href={`/blog/${post.slug}`} key={post.id}>
                    <div className="blog-card-image">
                      <OpeninaryImage
                        src={imagePath}
                        alt={post.title}
                        fill
                        aspectRatio="1200:630"
                        cropMode="fill"
                        sizes="(max-width: 620px) 100vw, (max-width: 980px) 50vw, 33vw"
                      />
                    </div>
                    <div className="blog-card-body">
                      <div className="blog-meta">
                        {post.category?.title && <span>{post.category.title}</span>}
                        {post.published_at && <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>}
                      </div>
                      <h2>{post.title}</h2>
                      <p>{blogDescription(post)}</p>
                      <span className="blog-card-cta">
                        Read article <ArrowRight size={16} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="blog-empty">No published blog posts are available yet.</div>
          )}
        </div>
      </section>
    </>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}
