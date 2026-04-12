import { useEffect, useMemo, useState } from "react";
import { fetchBanks } from "../services/api.js";

export default function BankComparison() {
  const [banks, setBanks] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetchBanks()
      .then(setBanks)
      .catch((e) => setErr(e.message));
  }, []);

  const best12 = useMemo(() => {
    let m = 0;
    for (const b of banks) {
      const v = b.rates?.["12M"]?.general ?? 0;
      if (v > m) m = v;
    }
    return m;
  }, [banks]);

  if (err) return <p className="text-sm text-red-400">{err}</p>;
  if (!banks.length) {
    return (
      <div className="space-y-2">
        <div className="h-8 w-full animate-pulse rounded bg-zinc-800" />
        <div className="h-8 w-full animate-pulse rounded bg-zinc-800" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-800">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400">
            <th className="p-3 font-medium">Bank</th>
            <th className="p-3 font-medium">6M</th>
            <th className="p-3 font-medium">12M</th>
            <th className="p-3 font-medium">24M</th>
            <th className="p-3 font-medium text-xs">Sr. 12M</th>
          </tr>
        </thead>
        <tbody>
          {banks.map((b) => (
            <tr key={b.slug} className="border-b border-zinc-800/80 hover:bg-zinc-900/40">
              <td className="p-3 font-medium text-zinc-200">{b.name}</td>
              {["6M", "12M", "24M"].map((k) => {
                const v = b.rates?.[k]?.general;
                const isBest = k === "12M" && v === best12;
                return (
                  <td key={k} className="p-3">
                    <span
                      className={
                        isBest
                          ? "rounded-lg bg-amber-500/20 px-2 py-1 font-semibold text-amber-200"
                          : "text-zinc-300"
                      }
                    >
                      {v != null ? `${v}%` : "—"}
                    </span>
                  </td>
                );
              })}
              <td className="p-3 text-zinc-400">{b.rates?.["12M"]?.senior ?? "—"}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-zinc-800 bg-zinc-950/50 px-3 py-2 text-xs text-zinc-500">
        Demo rates — verify on bank websites before investing.
      </p>
    </div>
  );
}
