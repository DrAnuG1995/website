import { describe, it, expect } from "vitest";
import { SITE_URL } from "@/lib/site";
import robots from "@/app/robots";
import { metadata } from "@/app/layout";

describe("canonical site URL", () => {
  it("is the production statdoctor.app origin over https", () => {
    expect(SITE_URL).toBe("https://statdoctor.app");
  });

  it("has no trailing slash so callers can concatenate paths safely", () => {
    expect(SITE_URL.endsWith("/")).toBe(false);
  });
});

describe("app/robots.ts", () => {
  it("declares the sitemap on the canonical origin", () => {
    const r = robots();
    expect(r.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});

describe("app/layout.ts metadata", () => {
  it("sets metadataBase to the canonical origin so OG/Twitter relative URLs resolve in prod", () => {
    expect(metadata.metadataBase).toBeInstanceOf(URL);
    expect(metadata.metadataBase?.toString()).toBe(`${SITE_URL}/`);
  });
});
