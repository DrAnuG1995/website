import { describe, it, expect } from "vitest";
import { extractCta } from "@/lib/chat/extractCta";

describe("extractCta", () => {
  describe("BOOK_DEMO detection", () => {
    it("detects [BOOK_DEMO] and strips it from the visible text", () => {
      const out = extractCta("Pricing starts from $10K/year.\n\n[BOOK_DEMO]");
      expect(out.cta).toBe("book");
      expect(out.text).toBe("Pricing starts from $10K/year.");
    });

    it("strips multiple BOOK_DEMO tokens if the model emits more than one", () => {
      const out = extractCta("Sure.[BOOK_DEMO] Talk soon.[BOOK_DEMO]");
      expect(out.cta).toBe("book");
      expect(out.text).toBe("Sure. Talk soon.");
    });

    it("tolerates the model writing [BOOK_DEMOS] (extra letter)", () => {
      const out = extractCta("Pricing varies.\n[BOOKING_DEMO]");
      expect(out.cta).toBe("book");
      expect(out.text).toBe("Pricing varies.");
    });
  });

  describe("DOWNLOAD_APP detection", () => {
    it("detects [DOWNLOAD_APP] and strips it", () => {
      const out = extractCta(
        "Active in VIC, NSW, QLD.\n[DOWNLOAD_APP]"
      );
      expect(out.cta).toBe("download");
      expect(out.text).toBe("Active in VIC, NSW, QLD.");
    });

    it("tolerates the [DOWLOAD_APP] typo (this happened in real testing)", () => {
      const out = extractCta("Yes, we cover Adelaide.\n[DOWLOAD_APP]");
      expect(out.cta).toBe("download");
      expect(out.text).toBe("Yes, we cover Adelaide.");
    });

    it("tolerates other near-spellings ending in _APP", () => {
      expect(extractCta("x.[DOWNLAOD_APP]").cta).toBe("download");
      expect(extractCta("x.[GET_APP]").cta).toBe("download");
    });
  });

  describe("no-token cases", () => {
    it("returns cta=null when no token present", () => {
      const out = extractCta("Hi, I can help with questions about StatDoctor.");
      expect(out.cta).toBeNull();
      expect(out.text).toBe(
        "Hi, I can help with questions about StatDoctor."
      );
    });

    it("does NOT false-positive on markdown links like [text](url)", () => {
      const out = extractCta("See [our pricing](https://example.com/pricing).");
      expect(out.cta).toBeNull();
      expect(out.text).toBe("See [our pricing](https://example.com/pricing).");
    });

    it("does NOT match arbitrary bracketed text", () => {
      const out = extractCta("Notes: [TODO] add coverage map.");
      expect(out.cta).toBeNull();
      expect(out.text).toContain("[TODO]");
    });
  });

  describe("precedence", () => {
    it("prefers BOOK over DOWNLOAD when both tokens appear", () => {
      const out = extractCta("Cost: $10K.\n[BOOK_DEMO]\n[DOWNLOAD_APP]");
      expect(out.cta).toBe("book");
      // BOOK was matched first; DOWNLOAD token left in place is fine since
      // the UI only renders one CTA per message.
      expect(out.text).toContain("Cost: $10K.");
    });
  });

  describe("edge cases", () => {
    it("handles empty string", () => {
      expect(extractCta("")).toEqual({ text: "", cta: null });
    });

    it("handles a token with no surrounding text", () => {
      const out = extractCta("[BOOK_DEMO]");
      expect(out.cta).toBe("book");
      expect(out.text).toBe("");
    });

    it("trims leading/trailing whitespace from the cleaned text", () => {
      const out = extractCta("\n\nHello world  \n\n[BOOK_DEMO]\n");
      expect(out.text).toBe("Hello world");
    });

    it("is idempotent on output (running it twice doesn't change result)", () => {
      const first = extractCta("Pricing.\n[BOOK_DEMO]");
      const second = extractCta(first.text);
      expect(second.text).toBe(first.text);
      expect(second.cta).toBeNull();
    });
  });
});
