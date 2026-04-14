import { useMemo, useState } from "react";
import { calculateFd } from "../services/api.js";

export default function FDCalculator({ language }) {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8.5);
  const [months, setMonths] = useState(12);
  const [senior, setSenior] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const labels = useMemo(
    () => ({
      hi: { title: "FD कैलकुलेटर", amt: "राशि (₹)", rate: "दर % p.a.", months: "महीने", go: "गिनती करें" },
      bho: { title: "FD कैलकुलेटर", amt: "राशि (₹)", rate: "दर %", months: "महिना", go: "गिनती" },
      ta: { title: "FD கணிப்பி", amt: "தொகை (₹)", rate: "விகிதம் %", months: "மாதங்கள்", go: "கணக்கிடு" },
      en: { title: "FD Calculator", amt: "Amount (₹)", rate: "Rate % p.a.", months: "Months", go: "Calculate" },
    }),
    []
  );
  const L = labels[language] || labels.en;

  async function run() {
    setLoading(true);
    setErr(null);
    try {
      const data = await calculateFd({
        principal,
        rate_pa: rate,
        tenor_months: months,
        is_senior: senior,
      });
      setResult(data);
    } catch (e) {
      setErr(e.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-2">
      <h3 className="mb-6 text-xl font-bold tracking-tight text-white">{L.title}</h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-zinc-500">{L.amt}</label>
          <input
            type="range"
            min={10000}
            max={500000}
            step={5000}
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="mt-1 w-full accent-emerald-500"
          />
          <div className="text-right text-sm text-zinc-300">₹{principal.toLocaleString("en-IN")}</div>
        </div>
        <div>
          <label className="text-xs text-zinc-500">{L.rate}</label>
          <input
            type="range"
            min={5}
            max={12}
            step={0.05}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="mt-1 w-full accent-emerald-500"
          />
          <div className="text-right text-sm text-zinc-300">{rate.toFixed(2)}%</div>
        </div>
        <div>
          <label className="text-xs text-zinc-500">{L.months}</label>
          <input
            type="range"
            min={6}
            max={24}
            step={6}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="mt-1 w-full accent-emerald-500"
          />
          <div className="text-right text-sm text-zinc-300">{months}M</div>
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-400">
          <input type="checkbox" checked={senior} onChange={(e) => setSenior(e.target.checked)} />
          Senior citizen (TDS note)
        </label>
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? "…" : L.go}
        </button>
        {err && <p className="text-sm text-red-400">{String(err)}</p>}
        {result && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm p-5 text-sm shadow-inner transition-all animate-fade-in text-white">
            <p className="text-zinc-300">
              Maturity:{" "}
              <span className="font-semibold text-emerald-200">
                ₹{result.maturity_amount.toLocaleString("en-IN")}
              </span>
            </p>
            <p className="mt-2 text-emerald-100/80">Interest: <span className="font-medium text-emerald-300">₹{result.interest_earned.toLocaleString("en-IN")}</span></p>
            <p className="mt-2 text-xs text-zinc-500">{result.tds_note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
