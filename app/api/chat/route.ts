import { NextRequest } from "next/server";
import OpenAI from "openai";
import { buildSystemPrompt } from "@/lib/chat/prompt";
import { rateLimit } from "@/lib/chat/rateLimit";

export const runtime = "nodejs";

type Role = "user" | "assistant";
type Message = { role: Role; content: string };

const MAX_HISTORY = 20;
const MAX_MESSAGE_CHARS = 2000;

function getClientKey(req: NextRequest) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "anonymous";
}

// Warmup ping target — keeps the chat function from cold-starting between users.
// Touches the heavy imports (OpenAI, prompt) so they're JIT'd in the lambda.
export async function GET() {
  void buildSystemPrompt;
  void OpenAI;
  return Response.json({ ok: true });
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      "Chat is not configured. Missing OPENAI_API_KEY on the server.",
      { status: 503 }
    );
  }

  const limit = rateLimit(getClientKey(req));
  if (!limit.ok) {
    return new Response(
      `You're chatting fast. Try again in ${limit.retryAfterSeconds}s.`,
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      }
    );
  }

  let body: { messages?: Message[] };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON.", { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const cleaned: Message[] = messages
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, MAX_MESSAGE_CHARS),
    }));

  if (cleaned.length === 0 || cleaned[cleaned.length - 1].role !== "user") {
    return new Response("No user message to respond to.", { status: 400 });
  }

  const system = await buildSystemPrompt();
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    temperature: 0.3,
    max_tokens: 500,
    messages: [{ role: "system", content: system }, ...cleaned],
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) controller.enqueue(encoder.encode(delta));
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Unexpected streaming error.";
        controller.enqueue(encoder.encode(`\n\n[error] ${msg}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
