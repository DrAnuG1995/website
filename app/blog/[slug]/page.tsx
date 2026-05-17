import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "../blog.css";
import {
  getAllSlugs,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/blog/posts-server";
import { hydrateSourceImages } from "@/lib/blog/media";
import PostDetail from "@/components/blog/PostDetail";
import { SITE_URL } from "@/lib/site";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  const canonical = `${SITE_URL}/blog/${post.slug}`;
  const ogImage = post.image_url ?? undefined;

  return {
    title: post.meta_title,
    description: post.meta_description,
    keywords: post.keywords ?? post.target_keywords,
    alternates: { canonical },
    openGraph: {
      title: post.meta_title,
      description: post.meta_description,
      url: canonical,
      type: "article",
      publishedTime: post.generated_at,
      images: ogImage
        ? [{ url: ogImage, alt: post.og_image_alt }]
        : undefined,
    },
    twitter: post.twitter_card
      ? {
          card: "summary_large_image",
          title: post.twitter_card.title,
          description: post.twitter_card.description,
          images: post.twitter_card.image
            ? [post.twitter_card.image]
            : undefined,
        }
      : {
          card: "summary_large_image",
          title: post.meta_title,
          description: post.meta_description,
          images: ogImage ? [ogImage] : undefined,
        },
  };
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(post.slug, post.pillar, 3);
  const sourceImages = await hydrateSourceImages(post.sources);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(post.faq_json_ld) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(post.medical_webpage_schema),
        }}
      />
      <PostDetail
        post={post}
        relatedPosts={relatedPosts}
        sourceImages={sourceImages}
      />
    </>
  );
}
