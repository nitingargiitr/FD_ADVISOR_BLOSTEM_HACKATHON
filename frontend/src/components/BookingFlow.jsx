import { useEffect, useState } from "react";
import { bookingStart, bookingStep, fetchBanks } from "../services/api.js";

const copy = {
  hi: {
    title: "FD बुक करें (डेमो)",
    start: "शुरू करें",
    bank: "बैंक चुनें",
    next: "आगे",
  },
  bho: {
    title: "FD बुक करीं (डेमो)",
    start: "शुरू",
    bank: "बैंक",
    next: "आगे",
  },
  ta: {
    title: "FD முன்பதிவு (டெமோ)",
    start: "தொடங்கு",
    bank: "வங்கி",
    next: "அடுத்து",
  },
  en: {
    title: "Book FD (demo)",
    start: "Start",
    bank: "Bank",
    next: "Next",
  },
};

export default function BookingFlow({ language }) {
  const C = copy[language] || copy.en;
  const [banks, setBanks] = useState([]);
  const [bid, setBid] = useState(null);
  const [step, setStep] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState(null);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBanks().then(setBanks);
  }, []);

  async function start() {
    setLoading(true);
    setErr(null);
    setDone(false);
    setSummary(null);
    try {
      const r = await bookingStart(language);
      setBid(r.booking_session_id);
      setStep(r.step);
      setPrompt(r.prompt);
      setInput("");
    } catch (e) {
      setErr(e.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  }

  async function next() {
    if (!bid) return;
    setLoading(true);
    setErr(null);
    try {
      let value = input.trim();
      if (step === "amount") value = Number(value);
      if (step === "tenor") value = Number(value);
      const r = await bookingStep(bid, language, value);
      setStep(r.step);
      setPrompt(r.prompt);
      setSummary(r.summary || null);
      setDone(r.done);
      setInput("");
    } catch (e) {
      setErr(e.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-2">
      <h3 className="mb-2 text-xl font-bold tracking-tight text-white">{C.title}</h3>
      <p className="mt-1 text-sm text-zinc-500">{prompt}</p>

      {!bid && (
        <button
          type="button"
          onClick={start}
          disabled={loading}
          className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {C.start}
        </button>
      )}

      {bid && !done && (
        <div className="mt-4 space-y-3">
          {step === "bank" && (
            <select
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
            >
              <option value="">{C.bank}…</option>
              {banks.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>
          )}
          {step !== "bank" && step !== "confirm" && (
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
              placeholder={step === "amount" ? "100000" : "12"}
            />
          )}
          {step === "confirm" && (
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
              placeholder="yes / हाँ / ஆம்"
            />
          )}
          <button
            type="button"
            onClick={next}
            disabled={loading || (step === "bank" && !input)}
            className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white disabled:opacity-40"
          >
            {C.next}
          </button>
        </div>
      )}

      {summary && !done && (
        <pre className="mt-3 overflow-x-auto rounded-lg bg-zinc-950 p-3 text-xs text-zinc-400">
          {JSON.stringify(summary, null, 2)}
        </pre>
      )}

      {done && summary && (
        <div className="mt-4 rounded-xl border border-emerald-800/50 bg-emerald-950/20 p-4 text-sm text-emerald-100">
          ✓ {prompt}
        </div>
      )}

      {err && <p className="mt-3 text-sm text-red-400">{String(err)}</p>}
    </div>
  );
}
