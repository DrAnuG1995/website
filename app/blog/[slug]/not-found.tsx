import Link from "next/link";

export default function NotFound() {
  return (
    <section className="pt-40 pb-32 px-6 text-center bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="eyebrow mb-4">404</div>
        <h1 className="display text-[clamp(40px,6.5vw,88px)] leading-[0.98] mb-4">
          That post is not <span className="italic text-ocean">on file.</span>
        </h1>
        <p className="text-muted mb-8">
          It may have been retired, or the link is wrong. Browse the journal
          for what we have right now.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ocean text-white mono text-xs tracking-widest hover:bg-ink transition-colors"
          data-hover
        >
          ← BACK TO THE JOURNAL
        </Link>
      </div>
    </section>
  );
}
