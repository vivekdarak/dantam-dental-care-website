import type { Metadata } from "next";
import { Calendar, Phone, UserRound } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { OpeninaryImage } from "@/components/openinary-image";
import {
  blogDescription,
  blogFeaturedImageSrc,
  blogFeaturedImageUrl,
  blogPostUrl,
  getPublishedBlogPost,
  getPublishedBlogSlugs,
  transformBlogHtmlImages,
} from "@/lib/directus-blog";
import { FaqJsonLd } from "@/lib/faq-schema";
import { site } from "@/lib/site";
import "../blog.css";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getPublishedBlogSlugs();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);
  if (!post) return {};

  const title = post.meta_title || post.title;
  const description = blogDescription(post);
  const imageUrl = blogFeaturedImageUrl(post);
  const canonical = post.canonical_url || blogPostUrl(post.slug);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: blogPostUrl(post.slug),
      siteName: site.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
          type: "image/jpeg",
        },
      ],
      locale: "en_IN",
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: post.author?.name ? [post.author.name] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);
  if (!post) notFound();

  const imagePath = blogFeaturedImageSrc(post) ?? "/images/hero-clinic.jpg";
  const html = transformBlogHtmlImages(post.content_html ?? "", post.media_sync);
  const faqs = post.faq_items?.filter((faq) => faq.question && faq.answer) ?? [];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
      />
      <BlogJsonLd post={post} imageUrl={blogFeaturedImageUrl(post)} />
      {faqs.length > 0 && <FaqJsonLd items={faqs} />}
      <section className="blog-article-hero">
        <div className="container blog-article-hero-grid">
          <div>
            <div className="blog-meta">
              {post.category?.title && <span>{post.category.title}</span>}
              {post.published_at && <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>}
            </div>
            <h1>{post.title}</h1>
            <p className="lead">{blogDescription(post)}</p>
          </div>
          <div className="blog-article-image">
            <OpeninaryImage
              src={imagePath}
              alt={post.title}
              fill
              priority
              aspectRatio="1200:630"
              cropMode="fill"
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container blog-article-layout">
          <article>
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: html }} />
            {faqs.length > 0 && (
              <section className="blog-faqs">
                <h2>Frequently asked questions</h2>
                {faqs.map((faq) => (
                  <details key={faq.question}>
                    <summary>{faq.question}</summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </section>
            )}
          </article>
          <aside className="blog-aside">
            {post.author?.name && (
              <div className="blog-aside-card">
                <UserRound size={24} />
                <h2>{post.author.name}</h2>
                {post.author.bio && <p>{post.author.bio}</p>}
              </div>
            )}
            <div className="blog-aside-card">
              <h3>Need dental guidance?</h3>
              <p>Book a consultation and we will walk you through your options with zero pressure.</p>
              <Link className="button primary" href="/contact">
                <Calendar size={17} />
                Book Appointment
              </Link>
              <a className="button outline" href={site.phones[0].href}>
                <Phone size={17} />
                Call clinic
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function BlogJsonLd({ post, imageUrl }: { post: Awaited<ReturnType<typeof getPublishedBlogPost>> & {}; imageUrl: string }) {
  if (!post) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": post.schema_type || "BlogPosting",
    headline: post.title,
    description: blogDescription(post),
    image: imageUrl,
    datePublished: post.published_at,
    dateModified: post.date_updated || post.published_at || post.date_created,
    author: post.author?.name
      ? {
          "@type": "Person",
          name: post.author.name,
        }
      : {
          "@type": "Organization",
          name: site.name,
        },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: "https://dantamdentalcare.com/images/dantam-logo.png",
      },
    },
    mainEntityOfPage: blogPostUrl(post.slug),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}
