"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { extractLead } from "@/lib/chat/extractCta";

export type ChatRole = "user" | "assistant";
export type ChatMessage = { id: string; role: ChatRole; content: string };

const STORAGE_KEY = "statdoctor.chat.v1";
const LEAD_POSTED_KEY = "statdoctor.chat.leadPosted.v1";

// Track which assistant message ids have already had their lead POSTed,
// so reloads / re-renders never re-fire the email.
function loadPostedSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(LEAD_POSTED_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

function persistPostedSet(set: Set<string>) {
  try {
    window.localStorage.setItem(
      LEAD_POSTED_KEY,
      JSON.stringify([...set].slice(-50))
    );
  } catch {
    /* quota exceeded */
  }
}

function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadFromStorage(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    );
  } catch {
    return [];
  }
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hydrated = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  // Always-current snapshot of messages so the post-stream lead handler
  // can read the final assembled assistant message without a stale closure.
  const messagesRef = useRef<ChatMessage[]>([]);
  const postedRef = useRef<Set<string>>(new Set());

  // Hydrate from localStorage on mount.
  useEffect(() => {
    setMessages(loadFromStorage());
    postedRef.current = loadPostedSet();
    hydrated.current = true;
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Persist on every change after hydration.
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* quota exceeded — non-fatal */
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      setError(null);
      const userMsg: ChatMessage = {
        id: newId(),
        role: "user",
        content: trimmed,
      };
      const assistantId = newId();

      // Snapshot the history we are sending so we don't include the empty
      // placeholder assistant message.
      const historyForServer = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      setMessages((prev) => [
        ...prev,
        userMsg,
        { id: assistantId, role: "assistant", content: "" },
      ]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: historyForServer }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const errText = await res.text().catch(() => "");
          throw new Error(errText || `Request failed (${res.status})`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m
            )
          );
        }
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        const msg = e instanceof Error ? e.message : "Something went wrong.";
        setError(msg);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    m.content ||
                    "Sorry — I hit an error replying. Try again in a moment, or email anu@statdoctor.net.",
                }
              : m
          )
        );
      } finally {
        setIsStreaming(false);
        abortRef.current = null;

        // After the stream closes, scan the final assistant message for a
        // [LEAD:...] token. If present and not already posted, fire the
        // background POST to /api/lead so Anu gets the email.
        try {
          const finalMsgs = messagesRef.current;
          const last = finalMsgs[finalMsgs.length - 1];
          if (last && last.role === "assistant") {
            const { lead } = extractLead(last.content);
            if (lead && !postedRef.current.has(last.id)) {
              postedRef.current.add(last.id);
              persistPostedSet(postedRef.current);
              const conversation = finalMsgs
                .filter((m) => m.role === "user" || m.role === "assistant")
                .slice(-12)
                .map((m) => ({ role: m.role, content: m.content }));
              fetch("/api/lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  persona: lead.persona,
                  email: lead.email,
                  name: lead.name,
                  conversation,
                }),
              }).catch(() => {
                // Non-fatal: the visitor still gets their CTA, we just don't
                // notify Anu. The lead is in the chat transcript regardless.
              });
            }
          }
        } catch {
          /* defensive */
        }
      }
    },
    [isStreaming, messages]
  );

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
  }, []);

  return { messages, sendMessage, isStreaming, error, clear };
}
