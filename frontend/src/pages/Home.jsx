import { Link } from "react-router-dom";
import { MessageCircle, BookOpen } from "lucide-react";
import LanguageSelector from "../components/LanguageSelector.jsx";
import { useState } from "react";
import BankComparison from "../components/BankComparison.jsx";
import FDCalculator from "../components/FDCalculator.jsx";
import BookingFlow from "../components/BookingFlow.jsx";

export default function Home({ lang, setLang }) {

  const nav = {
    hi: { 
      chat: "चैट करें", 
      glossary: "शब्दावली", 
      sub: "नए निवेशकों के लिए आपका अपना FD गाइड",
      heroTitle: "क्या बैंक की बातें समझ नहीं आतीं?",
      heroSub: "FD मित्र से अपनी भाषा में पूछें। सबसे अच्छे रेट्स की तुलना करें और एक क्लिक में अपना रिटर्न कैलकुलेट करें।",
      step1: { title: "1. पूछें और सीखें", desc: "कठिन शब्दों का आसान मतलब समझें।" },
      step2: { title: "2. तुलना करें", desc: "विभिन्न बैंकों के FD रेट्स देखें।" },
      step3: { title: "3. रिटर्न कैलकुलेट करें", desc: "जानें आपको अंत में कितना पैसा मिलेगा।" }
    },
    bho: { 
      chat: "चैट करीं", 
      glossary: "शब्दकोश", 
      sub: "नया निवेशक लोगन खातिर FD गाइड",
      heroTitle: "ई बैंक के बात समझ नईखे आवत?",
      heroSub: "FD मित्र से आपन भासा में पूछीं। निमन रेट देखीं आ आपन मुनाफा निकालीं।",
      step1: { title: "1. पूछीं आ सीखीं", desc: "कठिन बात के आसान मतलब समझीं।" },
      step2: { title: "2. तुलना करीं", desc: "अलग-अलग बैंक के रेट देखीं।" },
      step3: { title: "3. मुनाफा निकालीं", desc: "जानीं कि आखिर में केतना पईसा मिली।" }
    },
    ta: { 
      chat: "கேளுங்கள்", 
      glossary: "சொற்களஞ்சியம்", 
      sub: "புதிய முதலீட்டாளர்களுக்கான உங்கள் FD வழிகாட்டி",
      heroTitle: "வங்கி விதிமுறைகள் குழப்புகிறதா?",
      heroSub: "FD மித்ராவிடம் உங்கள் மொழியில் கேளுங்கள். வட்டி விகிதங்களை ஒப்பிட்டு பாருங்கள்.",
      step1: { title: "1. கேளுங்கள்", desc: "கடினமான சொற்களை எளிதாக புரிந்து கொள்ளுங்கள்." },
      step2: { title: "2. ஒப்பிடுங்கள்", desc: "பல்வேறு வங்கிகளின் FD விகிதங்களை பார்க்கவும்." },
      step3: { title: "3. கணக்கிடுங்கள்", desc: "உங்கள் முதிர்வு தொகையை கண்டுபிடிக்கவும்." }
    },
    en: { 
      chat: "Chat with FD Mitra", 
      glossary: "Browse Glossary", 
      sub: "Your personal Fixed Deposit guide",
      heroTitle: "Confused by bank jargon?",
      heroSub: "Ask FD Mitra in your own language. Compare the best rates and calculate your returns effortlessly.",
      step1: { title: "1. Ask & Learn", desc: "Understand difficult terms easily." },
      step2: { title: "2. Compare", desc: "See real bank FD interest rates." },
      step3: { title: "3. Calculate", desc: "Find your exact maturity amount." }
    },
  };
  const N = nav[lang] || nav.en;

  return (
    <div className="mx-auto flex relative z-10 flex-col px-4 pb-16 pt-6 max-w-5xl">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-200">
            FD Mitra
          </h1>
          <p className="mt-1 text-sm font-medium text-sky-100/60">{N.sub}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/40 uppercase tracking-wider">Language</span>
          <LanguageSelector value={lang} onChange={setLang} />
        </div>
      </header>

      {/* Hero Onboarding Section */}
      <section className="mt-12 mb-12 text-center">
        <h2 className="text-3xl font-extrabold text-white md:text-5xl tracking-tight mb-4 drop-shadow-md">
          {N.heroTitle}
        </h2>
        <p className="mx-auto max-w-2xl text-base md:text-lg text-sky-100/70 mb-8">
          {N.heroSub}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4 text-base font-semibold text-white shadow-xl shadow-sky-900/40 transition-all hover:scale-[1.02] hover:shadow-sky-900/60 hover:card-highlight"
          >
            <MessageCircle className="h-5 w-5" />
            {N.chat}
          </Link>
          <Link
            to="/glossary"
            className="glass-panel inline-flex items-center gap-2 rounded-2xl px-6 py-4 text-base font-medium text-sky-100 transition-all hover:scale-[1.02] hover:bg-white/10 hover:card-highlight"
          >
            <BookOpen className="h-5 w-5 text-sky-300" />
            {N.glossary}
          </Link>
        </div>
      </section>

      {/* Logic Steps */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {[N.step1, N.step2, N.step3].map((step, i) => (
          <div key={i} className="glass-panel rounded-2xl p-5 text-left transform transition hover:card-highlight">
            <h3 className="text-lg font-bold text-sky-400 mb-2">{step.title}</h3>
            <p className="text-sm text-zinc-300">{step.desc}</p>
          </div>
        ))}
      </section>

      {/* Interactive Widgets */}
      <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">Tools & Calculators</h2>
      </div>

      <section className="grid gap-8 lg:grid-cols-2 group">
        <div className="glass-panel rounded-2xl p-6 transition-all hover:card-highlight">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            Bank Comparison
          </h3>
          <BankComparison />
        </div>
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 transition-all line-clamp-none hover:card-highlight">
            <FDCalculator language={lang} />
          </div>
          <div className="glass-panel rounded-2xl p-6 transition-all hover:card-highlight">
            <BookingFlow language={lang} />
          </div>
        </div>
      </section>

      <footer className="mt-16 text-center text-xs font-medium text-white/30 uppercase tracking-widest">
        Vernacular FD Advisor
      </footer>
    </div>
  );
}
