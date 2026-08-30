import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAdjacentPosts, getAllPosts, getPostBySlug } from "@/lib/blog";
import { getBlogHeadings } from "@/lib/blog-headings";
import BlogPostPage from "./BlogPostPage";

const siteUrl = "https://onfireq.github.io";

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const canonicalPath = `/blog/${post.slug}`;
  const images = post.cover ? [post.cover] : [];

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: canonicalPath,
      types: { "application/rss+xml": "/rss.xml" },
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: canonicalPath,
      publishedTime: post.date,
      tags: post.tags,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const headings = getBlogHeadings(post.content, post.format);
  const { previous, next } = getAdjacentPosts(post.slug, post.category);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    author: {
      "@type": "Person",
      name: "OnfireQ",
      url: siteUrl,
    },
    keywords: post.tags.join(", "),
    ...(post.cover ? { image: new URL(post.cover, siteUrl).toString() } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <BlogPostPage
        post={post}
        headings={headings}
        previousPost={previous}
        nextPost={next}
      />
    </>
  );
}
