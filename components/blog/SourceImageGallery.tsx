"use client";

import { useEffect, useRef, useState } from "react";
import type { Source } from "@/lib/blog/posts";

export type InlineImage = { src: string; caption: string };

export type SourceWithImage = Source & {
  imageUrl: string | null;
  inlineImages: InlineImage[];
};

/**
 * Per-card image cell. Uses local state so that if the scraped OG image
 * 404s, is blocked, or is just slow (ACRRM, ANZCA, etc. respond in ≥10s),
 * we swap to the publisher-name placeholder instead of leaving a broken
 * or perpetually-loading glyph in the gallery.
 */
function SourceCardImage({
  src,
  alt,
  publisher,
}: {
  src: string | null;
  alt: string;
  publisher: string;
}) {
  const [broken, setBroken] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // 5 s grace: if the image hasn't reported `complete` yet, treat as broken.
  // Covers slow third-party hosts that never fire onload/onerror in time.
  useEffect(() => {
    if (!src || broken) return;
    const timer = window.setTimeout(() => {
      const img = imgRef.current;
      if (!img || !img.complete || img.naturalWidth === 0) {
        setBroken(true);
      }
    }, 5_000);
    return () => window.clearTimeout(timer);
  }, [src, broken]);

  if (!src || broken) {
    return (
      <div className="source-gallery-img-placeholder">
        <span className="source-gallery-img-publisher">{publisher}</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className="source-gallery-img"
      loading="lazy"
      onError={() => setBroken(true)}
    />
  );
}

export default function SourceImageGallery({
  sources,
}: {
  sources: SourceWithImage[];
}) {
  const withImg = sources.filter((s) => s.imageUrl).slice(0, 3);
  const withoutImg =
    withImg.length < 3
      ? sources.filter((s) => !s.imageUrl).slice(0, 3 - withImg.length)
      : [];
  const all = [...withImg, ...withoutImg];

  if (all.length === 0) return null;

  return (
    <section className="source-gallery-section">
      <h2 className="source-gallery-heading">As Reported By</h2>
      <p className="source-gallery-subheading">
        Coverage from news agencies and institutions cited in this article
      </p>
      <div className="source-gallery-grid">
        {all.map((src) => (
          <a
            key={src.url}
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            className="source-gallery-card"
          >
            <SourceCardImage
              src={src.imageUrl}
              alt={src.title}
              publisher={src.publisher}
            />
            <div className="source-gallery-body">
              <span className="source-gallery-publisher">
                Source: {src.publisher}
              </span>
              <h3 className="source-gallery-title">{src.title}</h3>
              {src.snippet && (
                <p className="source-gallery-snippet">{src.snippet}</p>
              )}
              <span className="source-gallery-cta">Read full article →</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
