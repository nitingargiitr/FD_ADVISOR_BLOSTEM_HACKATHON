import { useEffect, useRef, useState } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import MessageBubble from "./MessageBubble.jsx";
import { startListening, stopListening, isSpeechSupported } from "../utils/speech.js";

export default function ChatWindow({
  messages,
  input,
  onInputChange,
  onSend,
  sending,
  onEli5,
  eli5TargetId,
  eli5Loading,
  language,
  onChipClick,
  onVoiceError,
}) {
  const bottom = useRef(null);
  const [listening, setListening] = useState(false);
  const recogRef = useRef(null);
  const speechAvailable = isSpeechSupported();

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    return () => stopListening(recogRef.current);
  }, []);

  function handleMicToggle() {
    if (listening) {
      stopListening(recogRef.current);
      recogRef.current = null;
      setListening(false);
      return;
    }

    setListening(true);
    recogRef.current = startListening(
      language,
      (transcript) => {
        // Only fill the input — user decides when to send
        onInputChange(transcript);
        setListening(false);
        recogRef.current = null;
      },
      () => {
        setListening(false);
        recogRef.current = null;
      },
      (err) => {
        setListening(false);
        recogRef.current = null;
        if (onVoiceError) onVoiceError(err);
      }
    );

    if (!recogRef.current) {
      setListening(false);
    }
  }

  const micLabel = {
    hi: "🎙️ बोलकर पूछें",
    bho: "🎙️ बोलके पूछीं",
    ta: "🎙️ பேசி கேளுங்கள்",
    en: "🎙️ Tap mic to speak your question",
  };

  return (
    <div className="glass-panel flex h-full min-h-0 flex-1 flex-col rounded-2xl shadow-inner border-white/5">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6 py-8">
            <div className="text-center">
              <p className="text-lg font-semibold text-white/80 mb-1">FD Mitra से पूछें</p>
              <p className="text-sm text-zinc-500">தமிழ் / भोजपुरी / English भी चलेगा।</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-sm">
              {({
                hi: ["FD क्या होता है?", "सबसे अच्छा FD कौन सा?", "8.5% p.a. मतलब?", "Senior citizen FD?"],
                bho: ["FD का होला?", "सबसे नीमन FD?", "8.5% p.a. माने?", "बुजुर्ग FD?"],
                ta: ["FD என்ன?", "சிறந்த FD எது?", "8.5% p.a. என்ன?", "மூத்தோர் FD?"],
                en: ["What is an FD?", "Which bank has best rate?", "What does 8.5% p.a. mean?", "Senior citizen FD?"],
              }[language] || ["What is an FD?", "Which bank has best rate?", "What does 8.5% p.a. mean?", "Senior citizen FD?"]).map((chip) => (
                <button
                  key={chip}
                  onClick={() => onChipClick(chip)}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-200 backdrop-blur-sm transition hover:bg-sky-500/20 hover:border-sky-400/40 hover:text-sky-200"
                >
                  {chip}
                </button>
              ))}
            </div>
            {speechAvailable && (
              <p className="text-xs text-zinc-500 mt-2">
                {micLabel[language] || micLabel.en}
              </p>
            )}
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            role={m.role}
            text={m.text}
            time={m.time}
            showEli5={m.role === "assistant"}
            eli5Loading={eli5Loading && eli5TargetId === m.id}
            onEli5={() => onEli5(m)}
            language={language}
          />
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="space-y-2 rounded-2xl rounded-bl-md border border-zinc-800 bg-zinc-900 px-4 py-3">
              <div className="h-2 w-40 animate-pulse rounded bg-zinc-700" />
              <div className="h-2 w-52 animate-pulse rounded bg-zinc-700" />
              <div className="h-2 w-36 animate-pulse rounded bg-zinc-700" />
            </div>
          </div>
        )}
        <div ref={bottom} />
      </div>
      <form
        className="flex gap-2 border-t border-white/5 p-3 bg-black/10 backdrop-blur-md rounded-b-2xl"
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
      >
        <input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={listening ? "🎙️ Listening..." : "Message…"}
          className={`flex-1 rounded-xl border px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 transition-all backdrop-blur-md ${
            listening
              ? "border-red-400/40 bg-red-950/20 ring-2 ring-red-400/30 animate-pulse"
              : "border-white/10 bg-black/30 focus:ring-2 focus:ring-sky-500/50"
          }`}
          readOnly={listening}
        />
        {speechAvailable && (
          <button
            type="button"
            onClick={handleMicToggle}
            disabled={sending}
            className={`flex items-center justify-center rounded-xl px-3 py-3 transition-all ${
              listening
                ? "bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse"
                : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white disabled:opacity-40"
            }`}
            title={listening ? "Stop listening" : "Speak your question"}
          >
            {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
        )}
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-white shadow-lg shadow-sky-900/40 transition hover:scale-[1.02] disabled:opacity-40"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
