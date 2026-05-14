"use client";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage as ChatMessageType } from "./useChat";
import { extractCta, extractLead } from "@/lib/chat/extractCta";

const mdComponents: Components = {
  p: ({ children }) => <p className="my-1.5 first:mt-0 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="my-1.5 pl-5 list-disc space-y-0.5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-1.5 pl-5 list-decimal space-y-0.5">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-snug">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-ink">{children}</strong>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-ocean hover:underline break-words"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="px-1 py-0.5 rounded bg-ink/8 text-[12px] font-mono">
      {children}
    </code>
  ),
  h1: ({ children }) => (
    <div className="text-[14px] font-semibold my-1.5">{children}</div>
  ),
  h2: ({ children }) => (
    <div className="text-[14px] font-semibold my-1.5">{children}</div>
  ),
  h3: ({ children }) => (
    <div className="text-[14px] font-semibold my-1.5">{children}</div>
  ),
};

const BOOKING_URL =
  "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3palvOjKwk-Myfc22b7JOJw8Fj5IfWq8qtzxOu0gHgnDmxxHoq2wLRVFc3GnGM2UPqE4OUZ5Ey";

function openDownloadModal() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("open-download-modal"));
}

export default function ChatMessage({
  message,
  isStreaming,
}: {
  message: ChatMessageType;
  isStreaming: boolean;
}) {
  const isUser = message.role === "user";
  // For assistant messages, strip the LEAD token first (it's a side-channel
  // to /api/lead, never shown), then run the CTA extractor on the rest.
  const { text, cta } = isUser
    ? { text: message.content, cta: null as ReturnType<typeof extractCta>["cta"] }
    : (() => {
        const { text: noLead } = extractLead(message.content);
        return extractCta(noLead);
      })();

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-ocean text-white px-4 py-2.5 text-[14px] leading-snug whitespace-pre-wrap">
          {text}
        </div>
      </div>
    );
  }

  const showCaret = isStreaming && text.length === 0;

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="max-w-[92%] rounded-2xl rounded-bl-sm bg-lavender border border-ocean/10 px-4 py-2.5 text-[14px] leading-relaxed text-ink">
        {showCaret ? (
          <span className="inline-flex gap-1" aria-label="Thinking">
            <Dot />
            <Dot delay={120} />
            <Dot delay={240} />
          </span>
        ) : (
          <div className="text-[14px] leading-relaxed text-ink">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {text}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {cta === "book" && (
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink text-white text-[13px] font-semibold hover:bg-ocean transition-colors"
          data-hover
        >
          Book a call with Anu
          <span aria-hidden>→</span>
        </a>
      )}

      {cta === "download" && (
        <button
          type="button"
          onClick={openDownloadModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink text-white text-[13px] font-semibold hover:bg-ocean transition-colors"
          data-hover
        >
          Download the app
          <span aria-hidden>→</span>
        </button>
      )}
    </div>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full bg-ink/40 animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
