import { useEffect, useState } from "react";
import { fetchJargon } from "../services/api.js";

export default function JargonGlossary({ language }) {
  const [items, setItems] = useState([]);
  const [flipped, setFlipped] = useState({});

  useEffect(() => {
    fetchJargon().then(setItems);
  }, []);

  function def(entry) {
    return entry.definitions?.[language] || entry.definitions?.en || "";
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((e) => {
        const open = flipped[e.id];
        return (
          <button
            key={e.id}
            type="button"
            onClick={() => setFlipped((s) => ({ ...s, [e.id]: !open }))}
            className={`min-h-[140px] rounded-2xl border p-4 text-left transition duration-300 ${
              open
                ? "border-sky-600/50 bg-sky-950/30"
                : "border-zinc-700 bg-zinc-900/60 hover:border-zinc-600"
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-zinc-500">Term</p>
            <p className="text-lg font-semibold text-zinc-100">{e.term}</p>
            <div
              className={`mt-3 text-sm leading-relaxed text-zinc-300 transition ${
                open ? "opacity-100" : "opacity-70"
              }`}
            >
              {open ? def(e) : "Tap to flip — परिभाषा देखें"}
            </div>
          </button>
        );
      })}
    </div>
  );
}
