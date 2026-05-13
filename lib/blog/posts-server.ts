import "server-only";
import fs from "fs";
import path from "path";
import type { Post } from "./posts";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

// In-memory cache keyed by the directory's mtime — invalidates as soon as a
// new post JSON is dropped in. Production reads are still single-pass per
// build because mtime won't change in the read-only Vercel filesystem.
let cached: { mtime: number; posts: Post[] } | null = null;

function loadAll(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const dirMtime = fs.statSync(POSTS_DIR).mtimeMs;
  if (cached && cached.mtime === dirMtime) return cached.posts;

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".json"));
  const posts: Post[] = [];

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
      const post = JSON.parse(raw) as Post;
      if (post && typeof post.slug === "string") posts.push(post);
    } catch {
      // skip malformed files
    }
  }

  posts.sort(
    (a, b) =>
      new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime(),
  );

  cached = { mtime: dirMtime, posts };
  return posts;
}

export function getAllPosts(): Post[] {
  return loadAll();
}

export function getAllSlugs(): string[] {
  return loadAll().map((p) => p.slug);
}

export function getPostBySlug(slug: string): Post | null {
  return loadAll().find((p) => p.slug === slug) ?? null;
}

export function getRelatedPosts(slug: string, pillar: string, n = 3): Post[] {
  const all = loadAll().filter((p) => p.slug !== slug);
  const samePillar = all.filter((p) => p.pillar === pillar);
  const others = all.filter((p) => p.pillar !== pillar);
  return [...samePillar, ...others].slice(0, n);
}
