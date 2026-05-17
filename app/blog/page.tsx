import Link from "next/link";
import { getAllPosts } from "@/lib/blog/posts-server";
import { PILLAR_LABELS, type Post } from "@/lib/blog/posts";
import "./blog.css";

export const metadata = {
  title: "The Journal — StatDoctor",
  description:
    "Reporting from the locum frontline. Pay rates, AHPRA, hospital systems, and the working week of an Australian locum doctor.",
};

// Read from disk on every request in dev (and at request time in prod) so a
// freshly-dropped JSON in content/posts/ shows up without a server restart.
// Switch back to "force-static" once we move to a build-time content pull.
export const dynamic = "force-dynamic";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function PostCard({ post }: { post: Post }) {
  const pillarLabel = PILLAR_LABELS[post.pillar] ?? post.pillar;
  return (
    <Link href={`/blog/${post.slug}`} className="blog-index-card" data-hover>
      <div className="blog-index-card-image">
        {post.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image_url}
            alt={post.og_image_alt || post.title}
            loading="lazy"
          />
        ) : (
          <span className="blog-index-card-image-placeholder">
            {pillarLabel}
          </span>
        )}
      </div>
      <div className="blog-index-card-body">
        <span className="blog-index-card-pillar">{pillarLabel}</span>
        <h2 className="blog-index-card-title">{post.title}</h2>
        <p className="blog-index-card-tldr">{post.tldr}</p>
        <div className="blog-index-card-meta">
          <span>{post.reading_time_minutes} min read</span>
          <span aria-hidden>·</span>
          <span>{formatDate(post.generated_at)}</span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <section className="relative min-h-screen bg-white pt-28 md:pt-32 pb-20 md:pb-28 px-6">
      <div className="max-w-[1100px] mx-auto w-full">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-muted mb-6">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-electric opacity-75 animate-ping-slow" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-electric" />
            </span>
            The Journal
          </div>
          <h1 className="display text-[clamp(36px,5vw,64px)] leading-[1.05] max-w-3xl mx-auto">
            Reporting from the locum frontline.
          </h1>
          <p className="mt-5 text-ink/70 max-w-2xl mx-auto text-[15px] md:text-[17px] leading-relaxed">
            Pay rates, AHPRA, hospital systems, and the working week of an
            Australian locum doctor — in the founder&apos;s voice.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-ink/60">No posts yet.</p>
        ) : (
          <div className="blog-index-grid">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
