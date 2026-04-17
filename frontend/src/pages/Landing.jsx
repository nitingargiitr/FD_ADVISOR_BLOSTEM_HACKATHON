import { Link } from "react-router-dom";
import { MessageCircle, BarChart3, ShieldCheck, PlayCircle, HandCoins } from "lucide-react";
import LanguageSelector from "../components/LanguageSelector.jsx";
import { useState } from "react";

export default function Landing({ lang, setLang }) {
  const [chosen, setChosen] = useState(() => localStorage.getItem("app_lang_chosen") === "true");

  const content = {
    hi: {
      hero: "आपका पैसा, आपकी भाषा। FD को आसानी से समझें।",
      sub: "बैंकों की मुश्किल बातें भूल जाएं। अपनी भाषा में FD के बारे में पूछें, सबसे अच्छे रेट खोजें और अपना रिटर्न कैलकुलेट करें।",
      start: "अभी शुरू करें",
      howItWorks: "यह कैसे काम करता है?",
      step1Title: "1. अपनी भाषा चुनें और पूछें",
      step1Desc: "FD के बारे में कुछ भी पूछें। हम आसान भाषा में जवाब देंगे। बोलकर भी पूछ सकते हैं!",
      step2Title: "2. असली रेट्स की तुलना करें",
      step2Desc: "विभिन्न बैंकों के असली FD रेट्स एक जगह देखें।",
      step3Title: "3. अपना मुनाफा जानें",
      step3Desc: "जानें कि आपके पैसे पर कितना ब्याज मिलेगा, बिना किसी गणित के।",
      trust: "सभी जमा पर ₹5 लाख तक का DICGC बीमा है। आपका पैसा सुरक्षित है।",
    },
    bho: {
      hero: "रउवा पइसा, रउवा भासा। FD के आसानी से समझीं।",
      sub: "बैंक वाला कठिन बात भूला जाईं। आपन भासा में पूछीं, निमन रेट देखीं आ आपन मुनाफा निकालीं।",
      start: "अभी शुरू करीं",
      howItWorks: "ई कइसे काम करेला?",
      step1Title: "1. भासा चुनीं आ पूछीं",
      step1Desc: "आपन सवाल पूछीं। हमनी का आसान भासा में बताईब। बोलके भी पूछ सकेनी!",
      step2Title: "2. असली रेट देखीं",
      step2Desc: "अलग-अलग बैंक के FD रेट एक जगह देखीं।",
      step3Title: "3. आपन मुनाफा जानीं",
      step3Desc: "जानीं कि रउवा पइसा पर कतना ब्याज मिली।",
      trust: "सब जमा पर ₹5 लाख ले DICGC बीमा बा। रउवा पइसा सुरक्षित बा।",
    },
    ta: {
      hero: "உங்கள் பணம், உங்கள் மொழி. FD-ஐ எளிதாகப் புரிந்து கொள்ளுங்கள்.",
      sub: "வங்கியின் கடினமான சொற்களை மறந்துவிடுங்கள். உங்கள் மொழியில் கேட்டு, சிறந்த வட்டியைத் தேர்ந்தெடுங்கள்.",
      start: "இப்போதே தொடங்குங்கள்",
      howItWorks: "இது எப்படி செயல்படுகிறது?",
      step1Title: "1. மொழியை தேர்ந்தெடுத்து கேளுங்கள்",
      step1Desc: "கேள்விகளை தட்டச்சு அல்லது வாய்ஸ் மூலம் கேளுங்கள். எளிதாகப் பதில் கிடைக்கும்.",
      step2Title: "2. வட்டி விகிதங்களை ஒப்பிடுங்கள்",
      step2Desc: "பல்வேறு வங்கிகளின் வட்டி விகிதங்களை ஒரே இடத்தில் காணுங்கள்.",
      step3Title: "3. வருமானத்தை கணக்கிடுங்கள்",
      step3Desc: "கணிதம் ஏதும் இன்றி உங்கள் முதிர்வு தொகையைத் தெரிந்து கொள்ளுங்கள்.",
      trust: "அனைத்து வைப்புகளுக்கும் ₹5 லட்சம் வரை DICGC காப்பீடு உள்ளது. உங்கள் பணம் பாதுகாப்பானது.",
    },
    en: {
      hero: "Your money, your language. Understand Fixed Deposits easily.",
      sub: "Forget confusing bank jargon. Ask questions in your own language, compare real rates, and calculate your returns.",
      start: "Start Now",
      howItWorks: "How It Works",
      step1Title: "1. Choose language & ask",
      step1Desc: "Ask anything about FDs. Type or use your voice to ask questions.",
      step2Title: "2. Compare real rates",
      step2Desc: "See accurate interest rates across different types of banks.",
      step3Title: "3. Calculate returns",
      step3Desc: "Instantly see exactly how much your money will grow, math-free.",
      trust: "All deposits insured up to ₹5 lakh by DICGC. Your money is protected.",
    },
  };

  const c = content[lang] || content.en;

  if (!chosen) {
    return (
      <div className="mx-auto flex min-h-[100dvh] max-w-5xl flex-col items-center justify-center relative z-10 px-4 py-8 animate-fade-in">
        <div className="glass-panel max-w-md w-full p-8 rounded-3xl text-center shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">अपनी भाषा चुनें</h2>
          <h2 className="text-xl font-medium text-zinc-300 mb-2">தாய்மொழியை தேர்ந்தெடுக்கவும்</h2>
          <h2 className="text-lg font-medium text-zinc-400 mb-8">Choose your Language</h2>
          
          <div className="flex flex-col gap-3">
            {[
              { code: "hi", label: "हिंदी", sub: "Hindi" },
              { code: "bho", label: "भोजपुरी", sub: "Bhojpuri" },
              { code: "ta", label: "தமிழ்", sub: "Tamil" },
              { code: "en", label: "English", sub: "English" }
            ].map((o) => (
              <button
                key={o.code}
                onClick={() => {
                  setLang(o.code);
                  setChosen(true);
                  localStorage.setItem("app_lang_chosen", "true");
                }}
                className="w-full flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-6 py-4 transition-all hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:scale-[1.02]"
              >
                <div className="text-xl font-bold text-white">{o.label}</div>
                <div className="text-sm font-medium text-zinc-400">{o.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-5xl flex-col relative z-10 px-4 py-8">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
          FD Mitra
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/40 uppercase tracking-wider hidden sm:inline-block">Language</span>
          <LanguageSelector value={lang} onChange={setLang} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-12 text-center">
        <div className="animate-fade-in max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            <HandCoins className="h-4 w-4" />
            Made for Tier 2/3 First-Time Investors
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md mb-6 leading-tight">
            {c.hero}
          </h2>
          <p className="text-lg sm:text-xl text-emerald-100/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            {c.sub}
          </p>

          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-emerald-900/40 transition hover:scale-[1.05] hover:shadow-emerald-900/60"
          >
            <PlayCircle className="h-6 w-6" />
            {c.start}
          </Link>
        </div>

        {/* How it works */}
        <div className="mt-20 w-full animate-fade-in" style={{ animationDelay: "150ms", animationFillMode: "both" }}>
          <h3 className="text-2xl font-bold text-white mb-8 inline-block">{c.howItWorks}</h3>
          <div className="grid sm:grid-cols-3 gap-6 text-left relative">
            <div className="glass-panel p-6 rounded-2xl transition hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center mb-4 border border-blue-500/20">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-zinc-100 mb-2">{c.step1Title}</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">{c.step1Desc}</p>
            </div>
            
            <div className="glass-panel p-6 rounded-2xl transition hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-4 border border-purple-500/20">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-zinc-100 mb-2">{c.step2Title}</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">{c.step2Desc}</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl transition hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-4 border border-amber-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
              </div>
              <h4 className="text-lg font-bold text-zinc-100 mb-2">{c.step3Title}</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">{c.step3Desc}</p>
            </div>
          </div>
        </div>

        {/* Trust Banner */}
        <div className="mt-16 w-full animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
          <div className="glass-panel max-w-2xl mx-auto rounded-2xl p-5 flex items-center justify-center gap-3 text-left">
            <ShieldCheck className="h-8 w-8 text-emerald-400 shrink-0" />
            <p className="text-sm md:text-base font-medium text-emerald-100">{c.trust}</p>
          </div>
        </div>
      </main>

      <footer className="mt-8 text-center text-xs font-medium text-white/30 uppercase tracking-widest border-t border-white/5 pt-6">
        Vernacular FD Advisor
      </footer>
    </div>
  );
}
