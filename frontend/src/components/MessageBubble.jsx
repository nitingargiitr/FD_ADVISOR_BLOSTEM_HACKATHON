import { Baby } from "lucide-react";

export default function MessageBubble({
  role,
  text,
  time,
  onEli5,
  eli5Loading,
  showEli5,
}) {
  const mine = role === "user";
  return (
    <div
      className={`flex w-full animate-fade-in ${mine ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2 shadow-lg ${
          mine
            ? "rounded-br-md bg-emerald-700 text-white"
            : "rounded-bl-md border border-zinc-700 bg-zinc-900 text-zinc-100"
        }`}
      >
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{text}</p>
        <div
          className={`mt-1 flex items-center gap-2 text-[11px] ${
            mine ? "text-emerald-100/80" : "text-zinc-500"
          }`}
        >
          <span>{time}</span>
          {!mine && showEli5 && (
            <button
              type="button"
              disabled={eli5Loading}
              onClick={onEli5}
              className="inline-flex items-center gap-1 rounded-full border border-zinc-600 px-2 py-0.5 text-[11px] text-amber-200 transition hover:bg-zinc-800 disabled:opacity-50"
            >
              <Baby className="h-3 w-3" />
              {eli5Loading ? "…" : "बच्चों जैसा / ELI5"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
