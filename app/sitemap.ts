import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog/posts-server";
import { SITE_URL } from "@/lib/site";

const STATIC_ROUTES = [
  "",
  "/for-doctors",
  "/hospitals",
  "/partners",
  "/about",
  "/contact",
  "/blog",
  "/privacy-policy",
  "/terms-of-use",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const posts = getAllPosts();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/blog" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.generated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...postEntries];
}
