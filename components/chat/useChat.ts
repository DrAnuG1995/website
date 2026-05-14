"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export type ChatRole = "user" | "assistant";
export type ChatMessage = { id: string; role: ChatRole; content: string };

const STORAGE_KEY = "statdoctor.chat.v1";

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

  // Hydrate from localStorage on mount.
  useEffect(() => {
    setMessages(loadFromStorage());
    hydrated.current = true;
  }, []);

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
