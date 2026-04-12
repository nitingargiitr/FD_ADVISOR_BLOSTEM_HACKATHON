import { useEffect, useRef } from "react";
import { Send } from "lucide-react";
import MessageBubble from "./MessageBubble.jsx";

export default function ChatWindow({
  messages,
  input,
  onInputChange,
  onSend,
  sending,
  onEli5,
  eli5TargetId,
  eli5Loading,
}) {
  const bottom = useRef(null);
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col rounded-2xl border border-zinc-800 bg-zinc-950/80 shadow-inner">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="rounded-xl border border-dashed border-zinc-700 p-6 text-center text-sm text-zinc-500">
            FD Mitra से पूछें — जैसे: &quot;FD क्या होता है?&quot; या &quot;8.50% p.a. मतलब?&quot;
            <br />
            <span className="text-zinc-600">தமிழ் / भोजपुरी / English भी चलेगा।</span>
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            role={m.role}
            text={m.text}
            time={m.time}
            showEli5={m.role === "assistant"}
            eli5Loading={eli5Loading && eli5TargetId === m.id}
            onEli5={() => onEli5(m)}
          />
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="space-y-2 rounded-2xl rounded-bl-md border border-zinc-800 bg-zinc-900 px-4 py-3">
              <div className="h-2 w-40 animate-pulse rounded bg-zinc-700" />
              <div className="h-2 w-52 animate-pulse rounded bg-zinc-700" />
              <div className="h-2 w-36 animate-pulse rounded bg-zinc-700" />
            </div>
          </div>
        )}
        <div ref={bottom} />
      </div>
      <form
        className="flex gap-2 border-t border-zinc-800 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
      >
        <input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Message…"
          className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500/50"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-white shadow-lg transition hover:bg-emerald-500 disabled:opacity-40"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
