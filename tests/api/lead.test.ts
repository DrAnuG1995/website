import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";

// Mock Resend BEFORE importing the route. vi.hoisted shares the mock fn.
const { mockSend } = vi.hoisted(() => ({ mockSend: vi.fn() }));

vi.mock("resend", () => {
  class MockResend {
    emails = { send: mockSend };
    constructor(_apiKey?: string) {}
  }
  return { Resend: MockResend };
});

import { POST } from "@/app/api/lead/route";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/lead", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "test-resend-key";
    mockSend.mockReset();
    mockSend.mockResolvedValue({ data: { id: "msg_123" }, error: null });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("preconditions", () => {
    it("returns 503 when RESEND_API_KEY is missing", async () => {
      delete process.env.RESEND_API_KEY;
      const res = await POST(
        makeRequest({ persona: "doctor", email: "x@y.com" })
      );
      expect(res.status).toBe(503);
    });
  });

  describe("input validation", () => {
    it("400 on invalid JSON", async () => {
      const res = await POST(makeRequest("{not json"));
      expect(res.status).toBe(400);
    });

    it("400 when persona is missing or invalid", async () => {
      expect((await POST(makeRequest({ email: "x@y.com" }))).status).toBe(400);
      expect(
        (await POST(makeRequest({ persona: "alien", email: "x@y.com" }))).status
      ).toBe(400);
    });

    it("400 when email is missing", async () => {
      const res = await POST(makeRequest({ persona: "doctor" }));
      expect(res.status).toBe(400);
    });

    it("400 when email is malformed", async () => {
      expect(
        (await POST(makeRequest({ persona: "doctor", email: "notemail" }))).status
      ).toBe(400);
      expect(
        (await POST(makeRequest({ persona: "doctor", email: "x@y" }))).status
      ).toBe(400);
    });

    it("400 when phone is non-string or absurdly long", async () => {
      expect(
        (
          await POST(
            makeRequest({
              persona: "doctor",
              email: "x@y.com",
              phone: 123,
            })
          )
        ).status
      ).toBe(400);
      expect(
        (
          await POST(
            makeRequest({
              persona: "doctor",
              email: "x@y.com",
              phone: "x".repeat(100),
            })
          )
        ).status
      ).toBe(400);
    });

    it("trims and length-caps email", async () => {
      await POST(
        makeRequest({
          persona: "doctor",
          email: "  ok@y.com  ",
        })
      );
      const args = mockSend.mock.calls[0][0];
      expect(args.replyTo).toBe("ok@y.com");
    });
  });

  describe("happy path", () => {
    it("sends a doctor lead email with correct subject", async () => {
      const res = await POST(
        makeRequest({
          persona: "doctor",
          email: "doc@example.com",
          phone: "+61400000000",
          conversation: [
            { role: "user", content: "I'm a doctor" },
            { role: "assistant", content: "Great. What's your email?" },
            { role: "user", content: "doc@example.com" },
          ],
        })
      );
      expect(res.status).toBe(200);
      expect(mockSend).toHaveBeenCalledTimes(1);
      const args = mockSend.mock.calls[0][0];
      expect(args.subject).toMatch(/doctor/i);
      expect(args.subject).toContain("doc@example.com");
      expect(args.to).toBe("anu@statdoctor.net");
      expect(args.replyTo).toBe("doc@example.com");
      expect(args.html).toContain("doc@example.com");
      expect(args.html).toContain("+61400000000");
      // Conversation excerpt is in the email body.
      expect(args.html).toContain("I&#39;m a doctor");
    });

    it("sends a hospital lead without a phone field", async () => {
      const res = await POST(
        makeRequest({
          persona: "hospital",
          email: "admin@hospital.com.au",
        })
      );
      expect(res.status).toBe(200);
      const args = mockSend.mock.calls[0][0];
      expect(args.subject).toMatch(/hospital/i);
      // No phone row in the html.
      expect(args.html).not.toContain("Phone");
    });

    it("escapes HTML in conversation content (no XSS in email)", async () => {
      await POST(
        makeRequest({
          persona: "doctor",
          email: "x@y.com",
          conversation: [
            { role: "user", content: "<script>alert(1)</script>" },
          ],
        })
      );
      const args = mockSend.mock.calls[0][0];
      expect(args.html).not.toContain("<script>");
      expect(args.html).toContain("&lt;script&gt;");
    });

    it("returns ok JSON body on success", async () => {
      const res = await POST(
        makeRequest({ persona: "doctor", email: "x@y.com" })
      );
      const json = JSON.parse(await res.text());
      expect(json.ok).toBe(true);
    });
  });

  describe("error handling", () => {
    it("502 if Resend returns an error object", async () => {
      mockSend.mockResolvedValue({
        data: null,
        error: { message: "Domain not verified" },
      });
      const res = await POST(
        makeRequest({ persona: "doctor", email: "x@y.com" })
      );
      expect(res.status).toBe(502);
      expect(await res.text()).toContain("Domain not verified");
    });

    it("502 if Resend throws", async () => {
      mockSend.mockRejectedValue(new Error("network down"));
      const res = await POST(
        makeRequest({ persona: "doctor", email: "x@y.com" })
      );
      expect(res.status).toBe(502);
      expect(await res.text()).toContain("network down");
    });
  });
});
