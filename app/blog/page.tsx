import BlogClient from "./BlogClient";
import { getAllPosts } from "@/lib/blog/posts-server";
import { hydrateSourceImages } from "@/lib/blog/media";
import {
  PILLAR_LABELS,
  CONTENT_TYPE_LABELS,
  type ContentType,
} from "@/lib/blog/posts";

export const metadata = {
  title: "Journal, StatDoctor",
  description:
    "Reporting from the locum frontline: pay rates, AHPRA, hospital systems, and the working week of an Australian locum doctor.",
};

const isStock = (u: string | null | undefined) =>
  !u ||
  u.includes("unsplash.com") ||
  u.includes("placeholder") ||
  u.includes("quickchart.io");

export default async function Page() {
  const all = getAllPosts();

  // For each post, hydrate the cited sources and pick the first available
  // publisher image (Guardian thumbnail, etc.) as the card cover. Falls back
  // to the editorial typography cover when no source image is available.
  const posts = await Promise.all(
    all.map(async (p) => {
      const hydrated = await hydrateSourceImages(p.sources);
      // Skip publisher URLs that look like logos/icons rather than photography —
      // an AIHW or Department of Health logo on the cover reads as "missing
      // image", not editorial.
      const isPhoto = (u: string) =>
        !/(logo|favicon|brand-image|sprite|gravatar|emoji|social-share|og-default)/i.test(
          u,
        );
      const firstWithImage = hydrated.find(
        (s) => s.imageUrl && isPhoto(s.imageUrl),
      );
      const cover = firstWithImage
        ? {
            url: firstWithImage.imageUrl as string,
            publisher: firstWithImage.publisher,
            sourceUrl: firstWithImage.url,
          }
        : null;

      // Pre-2026 posts that haven't been backfilled yet default to "news" so
      // the UI never sees an undefined content_type.
      const content_type: ContentType =
        (p.content_type as ContentType) ?? "news";

      return {
        slug: p.slug,
        title: p.title,
        tldr: p.tldr,
        pillar: p.pillar,
        pillar_label: PILLAR_LABELS[p.pillar] ?? p.pillar,
        content_type,
        content_type_label: CONTENT_TYPE_LABELS[content_type],
        image_url: isStock(p.image_url) ? null : p.image_url,
        cover,
        reading_time_minutes: p.reading_time_minutes,
        generated_at: p.generated_at,
      };
    }),
  );

  return <BlogClient posts={posts} />;
}
