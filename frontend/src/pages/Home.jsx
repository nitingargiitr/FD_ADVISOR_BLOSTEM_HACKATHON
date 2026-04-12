import { Link } from "react-router-dom";
import { MessageCircle, BookOpen } from "lucide-react";
import LanguageSelector from "../components/LanguageSelector.jsx";
import { useState } from "react";
import BankComparison from "../components/BankComparison.jsx";
import FDCalculator from "../components/FDCalculator.jsx";
import BookingFlow from "../components/BookingFlow.jsx";

export default function Home() {
  const [lang, setLang] = useState("hi");

  const nav = {
    hi: { chat: "चैट", glossary: "शब्दकोश", sub: "टियर 2/3 नए निवेशकों के लिए FD मित्र" },
    bho: { chat: "चैट", glossary: "शब्दकोश", sub: "नया निवेशक खातिर FD मित्र" },
    ta: { chat: "அரட்டை", glossary: "சொற்களஞ்சியம்", sub: "புதிய முதலீட்டாளர்களுக்கான FD Mitra" },
    en: { chat: "Chat", glossary: "Glossary", sub: "FD Mitra for first-time investors" },
  };
  const N = nav[lang] || nav.en;

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-16 pt-6">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">FD Mitra</h1>
          <p className="mt-1 text-sm text-zinc-400">{N.sub}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500">भाषा / மொழி</span>
          <LanguageSelector value={lang} onChange={setLang} />
        </div>
      </header>

      <nav className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/chat"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-emerald-500"
        >
          <MessageCircle className="h-4 w-4" />
          {N.chat}
        </Link>
        <Link
          to="/glossary"
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-600 px-5 py-3 text-sm text-zinc-200 hover:bg-zinc-900"
        >
          <BookOpen className="h-4 w-4" />
          {N.glossary}
        </Link>
      </nav>

      <section className="mt-10 rounded-2xl border border-amber-900/40 bg-gradient-to-br from-amber-950/40 to-zinc-950 p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-amber-400/90">Demo banner</p>
        <h2 className="mt-2 text-xl font-semibold text-zinc-100">
          Suryoday Small Finance Bank — 8.50% p.a. — 12M tenor
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          गोरखपुर में कोई यूज़र यह देखता है — p.a. क्या है? 12M क्या है? FD Mitra सरल भाषा में समाता है।
        </p>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <BankComparison />
        <div className="space-y-6">
          <FDCalculator language={lang} />
          <BookingFlow language={lang} />
        </div>
      </section>

      <footer className="mt-12 text-center text-xs text-zinc-600">
        Vernacular FD Advisor — Hindi · Bhojpuri · Tamil · English
      </footer>
    </div>
  );
}
