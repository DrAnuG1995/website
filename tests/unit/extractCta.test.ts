import { describe, it, expect } from "vitest";
import { extractCta, extractLead, stripAllTokens } from "@/lib/chat/extractCta";

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

describe("extractLead", () => {
  it("parses a doctor lead with name + email", () => {
    const r = extractLead(
      "Thanks Sarah, Anu's team will be in touch.\n[LEAD:persona=doctor;name=Sarah Patel;email=foo@bar.com]"
    );
    expect(r.lead).toEqual({
      persona: "doctor",
      name: "Sarah Patel",
      email: "foo@bar.com",
    });
    expect(r.text).toBe("Thanks Sarah, Anu's team will be in touch.");
  });

  it("parses a doctor lead with empty name (visitor refused to give it)", () => {
    const r = extractLead("[LEAD:persona=doctor;name=;email=foo@bar.com]");
    expect(r.lead).toEqual({ persona: "doctor", email: "foo@bar.com" });
  });

  it("ignores stray phone fields if a legacy bot reply includes them", () => {
    // Bot prompt was updated to drop phone, but tolerate it from older
    // cached replies in localStorage. The phone is just discarded.
    const r = extractLead("[LEAD:persona=doctor;name=Jamie;email=foo@bar.com;phone=+61400000000]");
    expect(r.lead).toEqual({
      persona: "doctor",
      name: "Jamie",
      email: "foo@bar.com",
    });
  });

  it("parses a hospital lead with name", () => {
    const r = extractLead(
      "Anu's diary opens here.\n[LEAD:persona=hospital;name=Dr Smith;email=admin@hospital.com.au]"
    );
    expect(r.lead).toEqual({
      persona: "hospital",
      name: "Dr Smith",
      email: "admin@hospital.com.au",
    });
  });

  it("still parses a hospital lead WITHOUT a name field (backward compatible)", () => {
    const r = extractLead("[LEAD:persona=hospital;email=admin@hospital.com.au]");
    expect(r.lead).toEqual({
      persona: "hospital",
      email: "admin@hospital.com.au",
    });
  });

  it("returns null lead when no token present", () => {
    expect(extractLead("Just a normal reply.").lead).toBeNull();
  });

  it("returns null lead when persona is invalid", () => {
    const r = extractLead("[LEAD:persona=patient;email=x@y.com]");
    expect(r.lead).toBeNull();
    expect(r.text).toBe("");
  });

  it("returns null lead when email is missing", () => {
    expect(extractLead("[LEAD:persona=doctor]").lead).toBeNull();
  });

  it("returns null lead when email is malformed", () => {
    expect(extractLead("[LEAD:persona=doctor;email=notanemail]").lead).toBeNull();
    expect(extractLead("[LEAD:persona=doctor;email=foo@bar]").lead).toBeNull();
  });

  it("strips even malformed LEAD tokens from visible text", () => {
    // The bot is instructed to put [LEAD:...] on its own line, so interior
    // double-spacing rarely happens in practice. We only require that the
    // token itself is gone; we don't collapse interior whitespace.
    const r = extractLead("Sorry. [LEAD:persona=alien;email=x@y.com] Try again.");
    expect(r.text).not.toContain("[LEAD");
    expect(r.text).toContain("Sorry.");
    expect(r.text).toContain("Try again.");
    expect(r.lead).toBeNull();
  });

  it("ignores extra whitespace in fields", () => {
    const r = extractLead("[LEAD: persona = doctor ; name = Sam ; email = a@b.com ]");
    expect(r.lead).toEqual({
      persona: "doctor",
      name: "Sam",
      email: "a@b.com",
    });
  });
});

describe("stripAllTokens", () => {
  it("strips CTA + LEAD tokens together", () => {
    const out = stripAllTokens(
      "Sure.\n[BOOK_DEMO]\n[LEAD:persona=hospital;email=a@b.com]"
    );
    expect(out).toBe("Sure.");
  });

  it("is a no-op on plain text", () => {
    expect(stripAllTokens("hello world")).toBe("hello world");
  });
});
