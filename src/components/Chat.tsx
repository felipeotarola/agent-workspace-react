import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Square,
  Plus,
  Sparkles,
  Copy,
  Check,
  MessageSquare,
  X,
} from "lucide-react";
import { mockReply, type Thread, type Message } from "../lib/chat";
export function Chat({
  thread,
  onChange,
}: {
  thread: Thread;
  onChange: (thread: Thread) => void;
}) {
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [style, setStyle] = useState("Auto");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [copyError, setCopyError] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const file = useRef<HTMLInputElement>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );
  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [thread.messages, pending]);
  function send(text = draft) {
    if (!text.trim() || pending) return;
    const message: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content:
        text.trim() +
        (attachments.length
          ? `\n\nBifogat (demo): ${attachments.join(", ")}`
          : ""),
    };
    const updated = {
      ...thread,
      title: thread.messages.length ? thread.title : text.trim().slice(0, 42),
      messages: [...thread.messages, message],
    };
    onChange(updated);
    setDraft("");
    setAttachments([]);
    setPending(true);
    if (input.current) input.current.style.height = "auto";
    timer.current = setTimeout(() => {
      onChange({
        ...updated,
        messages: [
          ...updated.messages,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: mockReply(text, style),
          },
        ],
      });
      setPending(false);
      timer.current = null;
    }, 1000);
  }
  function stop() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setPending(false);
  }
  async function copy(message: Message) {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(message.id);
      setCopyError("");
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopyError("Kunde inte kopiera. Markera texten och kopiera manuellt.");
    }
  }
  return (
    <section className="chat-pane" aria-label="Chatt">
      <div
        className="conversation"
        role="log"
        aria-label="Meddelanden"
        aria-live="polite"
        aria-relevant="additions text"
      >
        {thread.messages.length === 0 ? (
          <div className="chat-welcome">
            <div className="welcome-icon">
              <Sparkles size={24} />
            </div>
            <p className="eyebrow">DIN PERSONLIGA ARBETSYTA</p>
            <h1>Vad vill du göra idag?</h1>
            <p>Börja med en tanke. Vi tar det därifrån.</p>
            <div className="suggestions">
              <button onClick={() => send("Hjälp mig strukturera en idé")}>
                <MessageSquare size={16} />
                Bolla en idé<span>↗</span>
              </button>
              <button onClick={() => send("Hjälp mig göra en plan för dagen")}>
                <Sparkles size={16} />
                Gör en plan<span>↗</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="message-list">
            {thread.messages.map((message) => (
              <article
                key={message.id}
                className={`message ${message.role}`}
                aria-label={message.role === "user" ? "Du" : "Agent Workspace"}
              >
                {message.role === "assistant" && (
                  <div className="assistant-label">
                    <span className="agent-symbol">
                      <Sparkles size={14} />
                    </span>
                    Agent Workspace
                  </div>
                )}
                <div className="message-body">{message.content}</div>
                {message.role === "assistant" && (
                  <button
                    className="icon-button copy-button"
                    aria-label={
                      copied === message.id ? "Kopierat" : "Kopiera svar"
                    }
                    onClick={() => void copy(message)}
                  >
                    {copied === message.id ? (
                      <Check size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
        {pending && (
          <div className="thinking" role="status">
            <Sparkles size={16} />
            <span>Agent Workspace skriver</span>
            <span className="typing-dots">•••</span>
          </div>
        )}
        <div ref={bottom} />
      </div>
      <div className="composer-area">
        <form
          className="composer"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          {attachments.length > 0 && (
            <div className="attachments">
              {attachments.map((name) => (
                <span key={name}>
                  {name}
                  <button
                    type="button"
                    aria-label={`Ta bort ${name}`}
                    onClick={() =>
                      setAttachments((prev) => prev.filter((n) => n !== name))
                    }
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <label className="sr-only" htmlFor="message">
            Ditt meddelande
          </label>
          <textarea
            ref={input}
            id="message"
            rows={2}
            placeholder="Skriv ditt meddelande här…"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
            }}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing
              ) {
                e.preventDefault();
                send();
              }
            }}
          />
          <div className="composer-toolbar">
            <div className="composer-tools">
              <button
                type="button"
                className="icon-button"
                aria-label="Bifoga fil (demo, endast filnamn)"
                onClick={() => file.current?.click()}
              >
                <Plus size={18} />
              </button>
              <input
                ref={file}
                type="file"
                multiple
                hidden
                onChange={(e) => {
                  setAttachments((prev) => [
                    ...new Set([
                      ...prev,
                      ...Array.from(e.target.files ?? [], (f) => f.name),
                    ]),
                  ]);
                  e.target.value = "";
                }}
              />
              <span className="model-label">
                <Sparkles size={14} />
                Agent
              </span>
              <select
                aria-label="Svarsstil"
                className="reasoning-select"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                <option>Auto</option>
                <option>Kortfattat</option>
                <option>Utförligt</option>
              </select>
            </div>
            {pending ? (
              <button
                type="button"
                className="send-button"
                aria-label="Stoppa svar"
                onClick={stop}
              >
                <Square size={13} fill="currentColor" />
              </button>
            ) : (
              <button
                className="send-button"
                aria-label="Skicka meddelande"
                disabled={!draft.trim()}
              >
                <ArrowUp size={19} />
              </button>
            )}
          </div>
        </form>
        <p className="composer-note" role="status">
          {copyError || "Simulerade svar · Sparas bara i din webbläsare"}
        </p>
      </div>
    </section>
  );
}
