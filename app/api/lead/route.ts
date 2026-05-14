import { NextRequest } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type Persona = "doctor" | "hospital";

type LeadBody = {
  persona: Persona;
  email: string;
  name?: string;
  conversation?: { role: "user" | "assistant"; content: string }[];
};

const LEAD_TO = process.env.LEAD_EMAIL_TO ?? "anu@statdoctor.net";
// Resend requires the FROM address to belong to a verified domain. Until
// statdoctor.app is verified in Resend, fall back to Resend's onboarding
// sandbox domain so emails still send.
const LEAD_FROM =
  process.env.LEAD_EMAIL_FROM ?? "StatDoctor Bot <onboarding@resend.dev>";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtml(b: LeadBody) {
  const tag =
    b.persona === "doctor"
      ? '<span style="background:#3232ff;color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Doctor</span>'
      : '<span style="background:#1a1a2e;color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Hospital</span>';

  const transcript =
    (b.conversation ?? [])
      .slice(-12)
      .map(
        (m) =>
          `<div style="margin:6px 0;"><strong style="color:${
            m.role === "user" ? "#3232ff" : "#1a1a2e"
          }">${m.role === "user" ? "Visitor" : "Bot"}:</strong> ${escapeHtml(
            m.content
          )}</div>`
      )
      .join("") || "<em>No conversation context captured.</em>";

  return `<div style="font-family:Inter,system-ui,sans-serif;color:#1a1a2e;max-width:640px;">
    <h2 style="margin:0 0 12px 0;">New chatbot lead ${tag}</h2>
    <table style="border-collapse:collapse;font-size:14px;margin-bottom:16px;">
      ${
        b.name
          ? `<tr><td style="padding:4px 12px 4px 0;color:#6b7a73;">Name</td><td><strong>${escapeHtml(
              b.name
            )}</strong></td></tr>`
          : ""
      }
      <tr><td style="padding:4px 12px 4px 0;color:#6b7a73;">Email</td><td><a href="mailto:${escapeHtml(
        b.email
      )}">${escapeHtml(b.email)}</a></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#6b7a73;">Captured</td><td>${new Date().toISOString()}</td></tr>
    </table>
    <h3 style="margin:16px 0 8px 0;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#6b7a73;">Conversation excerpt</h3>
    <div style="border:1px solid #e2dcc8;border-radius:8px;padding:12px 16px;background:#F5F1E8;font-size:13px;line-height:1.5;">
      ${transcript}
    </div>
  </div>`;
}

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return new Response("Lead capture not configured (missing RESEND_API_KEY).", {
      status: 503,
    });
  }

  let body: LeadBody;
  try {
    body = (await req.json()) as LeadBody;
  } catch {
    return new Response("Invalid JSON.", { status: 400 });
  }

  if (body.persona !== "doctor" && body.persona !== "hospital") {
    return new Response("persona must be 'doctor' or 'hospital'.", { status: 400 });
  }
  if (typeof body.email !== "string" || !EMAIL_RE.test(body.email.trim())) {
    return new Response("Valid email required.", { status: 400 });
  }
  if (
    body.name !== undefined &&
    body.name !== null &&
    (typeof body.name !== "string" || body.name.length > 120)
  ) {
    return new Response("Invalid name.", { status: 400 });
  }

  const lead: LeadBody = {
    persona: body.persona,
    email: body.email.trim().slice(0, 200),
    name: body.name?.trim().slice(0, 120) || undefined,
    conversation: Array.isArray(body.conversation)
      ? body.conversation.slice(-20).map((m) => ({
          role: m.role,
          content: String(m.content).slice(0, 1000),
        }))
      : [],
  };

  const resend = new Resend(process.env.RESEND_API_KEY);
  // Subject leads with name when we have it, so Anu's inbox preview is useful.
  const personaWord = lead.persona === "doctor" ? "doctor" : "hospital";
  const subject = lead.name
    ? `New ${personaWord} lead: ${lead.name} (${lead.email})`
    : `New ${personaWord} lead from chatbot: ${lead.email}`;

  try {
    const { error } = await resend.emails.send({
      from: LEAD_FROM,
      to: LEAD_TO,
      replyTo: lead.email,
      subject,
      html: buildHtml(lead),
    });
    if (error) {
      return new Response(`Email send failed: ${error.message}`, { status: 502 });
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(`Email send threw: ${msg}`, { status: 502 });
  }
}
