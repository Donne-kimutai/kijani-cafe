"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING =
  "Hi! I'm the Kijani Café assistant. Ask me about our menu, opening hours or location.";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-19) }),
      });
      const data = await res.json();
      const reply: string =
        res.ok && data.reply
          ? data.reply
          : data.error ?? "Sorry, something went wrong.";
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "Sorry, I couldn't connect. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[28rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-green-700 px-4 py-3 text-white">
            <div>
              <p className="font-semibold">Kijani Assistant</p>
              <p className="text-xs text-green-100">Ask about our menu and hours</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-2xl leading-none hover:text-green-200"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-green-50 p-4">
            <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-4 py-2 text-sm text-green-900 shadow-sm">
              {GREETING}
            </div>

            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm shadow-sm ${
                  m.role === "user"
                    ? "ml-auto rounded-br-sm bg-green-700 text-white"
                    : "rounded-bl-sm bg-white text-green-900"
                }`}
              >
                {m.content}
              </div>
            ))}

            {loading && (
              <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-4 py-2 text-sm text-green-700 shadow-sm">
                Typing...
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <form onSubmit={send} className="flex gap-2 border-t border-green-100 bg-white p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder="Type your question..."
              className="w-full rounded-full border border-green-200 px-4 py-2 text-sm outline-none focus:border-green-600"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-full bg-green-700 px-5 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Bubble button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green-700 text-2xl text-white shadow-lg transition hover:scale-105 hover:bg-green-800"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}