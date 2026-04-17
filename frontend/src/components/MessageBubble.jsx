import { useRef, useState } from "react";
import { Baby, Volume2, Square } from "lucide-react";
import { speakText, stopSpeaking, isTTSSupported } from "../utils/speech.js";

export default function MessageBubble({
  role,
  text,
  time,
  onEli5,
  eli5Loading,
  showEli5,
  language = "en",
}) {
  const mine = role === "user";
  const [speaking, setSpeaking] = useState(false);
  const speakingRef = useRef(false);
  const ttsAvailable = isTTSSupported();

  const eli5Text = {
    hi: "सरल भाषा",
    bho: "आसान भासा",
    ta: "எளிமையான விளக்கம்",
    en: "Easy Understanding",
  };
  const label = eli5Text[language] || eli5Text.en;

  const speakLabel = {
    hi: "सुनें",
    bho: "सुनीं",
    ta: "கேளுங்கள்",
    en: "Listen",
  };
  const stopLabel = {
    hi: "रोकें",
    bho: "रोकीं",
    ta: "நிறுத்து",
    en: "Stop",
  };

  function handleSpeak() {
    if (speakingRef.current) {
      // STOP
      stopSpeaking();
      speakingRef.current = false;
      setSpeaking(false);
      return;
    }

    // PLAY
    speakingRef.current = true;
    setSpeaking(true);
    speakText(text, language, () => {
      speakingRef.current = false;
      setSpeaking(false);
    });
  }

  return (
    <div
      className={`flex w-full animate-fade-in ${mine ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2 shadow-lg ${
          mine
            ? "rounded-br-md bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sky-900/30"
            : "rounded-bl-md border border-white/10 bg-white/5 backdrop-blur-md text-zinc-100"
        }`}
      >
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{text}</p>
        <div
          className={`mt-1.5 flex items-center gap-2 text-[11px] flex-wrap ${
            mine ? "text-sky-100/80" : "text-zinc-500"
          }`}
        >
          <span>{time}</span>
          {!mine && showEli5 && (
            <button
              type="button"
              disabled={eli5Loading}
              onClick={onEli5}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-amber-200 transition hover:bg-white/10 disabled:opacity-50"
            >
              <Baby className="h-3 w-3" />
              {eli5Loading ? "…" : label}
            </button>
          )}
          {!mine && ttsAvailable && (
            <button
              type="button"
              onClick={handleSpeak}
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] transition ${
                speaking
                  ? "border-red-400/40 bg-red-500/20 text-red-300 hover:bg-red-500/30"
                  : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
              }`}
              title={speaking ? "Stop" : "Listen aloud"}
            >
              {speaking ? (
                <>
                  <Square className="h-3 w-3" />
                  {stopLabel[language] || stopLabel.en}
                </>
              ) : (
                <>
                  <Volume2 className="h-3 w-3" />
                  {speakLabel[language] || speakLabel.en}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
