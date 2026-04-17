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

  const typeBadge = {
    public: { label: "Public Bank", cls: "bg-blue-500/15 text-blue-300 border border-blue-500/30" },
    private: { label: "Private Bank", cls: "bg-purple-500/15 text-purple-300 border border-purple-500/30" },
    small_finance: { label: "Small Finance", cls: "bg-amber-500/15 text-amber-300 border border-amber-500/30" },
  };

  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-sky-200">
            <th className="p-3 font-medium">Bank</th>
            <th className="p-3 font-medium">6M</th>
            <th className="p-3 font-medium">12M</th>
            <th className="p-3 font-medium">24M</th>
            <th className="p-3 font-medium text-xs">Sr. 12M</th>
          </tr>
        </thead>
        <tbody>
          {banks.map((b) => {
            const badge = typeBadge[b.type] || typeBadge.private;
            return (
              <tr key={b.slug} className="border-b border-white/5 transition-colors hover:bg-white/5">
                <td className="p-3">
                  <div className="font-medium text-zinc-200 leading-tight">{b.name}</div>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${badge.cls}`}>
                    {badge.label}
                  </span>
                </td>
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
            );
          })}
        </tbody>
      </table>
      <div className="mt-4 flex flex-wrap items-start gap-x-4 gap-y-2 border-t border-white/5 pt-3 text-[11px]">
        <span className="flex items-center gap-1.5 text-sky-300/70">
          <span className="inline-block h-2 w-2 flex-shrink-0 rounded-full bg-sky-400"></span>
          All deposits insured up to ₹5 lakh (DICGC)
        </span>
        <span className="text-white/30">Indicative 2026 rates — verify at bank before investing.</span>
      </div>
    </div>
  );
}
