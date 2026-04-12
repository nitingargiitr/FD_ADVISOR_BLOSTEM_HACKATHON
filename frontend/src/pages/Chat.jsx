import { Link } from "react-router-dom";
import { useCallback, useState } from "react";
import { ArrowLeft } from "lucide-react";
import LanguageSelector from "../components/LanguageSelector.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import Toast from "../components/Toast.jsx";
import { getSessionId, sendChat } from "../services/api.js";
import { detectLanguageFromText } from "../utils/languageDetect.js";

let msgId = 0;
function nextId() {
  msgId += 1;
  return msgId;
}

export default function Chat() {
  const [language, setLanguage] = useState("hi");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);
  const [eli5Loading, setEli5Loading] = useState(false);
  const [eli5TargetId, setEli5TargetId] = useState(null);
  const sessionId = getSessionId();

  const push = useCallback((role, text) => {
    const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((m) => [...m, { id: nextId(), role, text, time: t }]);
  }, []);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    const detected = detectLanguageFromText(text);
    let lang = language;
    if (detected === "ta") {
      lang = "ta";
      setLanguage("ta");
    } else if (detected === "hi" && language === "en") {
      lang = "hi";
      setLanguage("hi");
    }
    setInput("");
    push("user", text);
    setSending(true);
    setToast(null);
    try {
      const data = await sendChat({ message: text, language: lang, sessionId });
      push("assistant", data.reply);
      if (data.jargon_terms?.length) {
        setToast(null);
      }
    } catch (e) {
      const detail = e.response?.data?.detail;
      setToast(typeof detail === "string" ? detail : e.message || "Request failed");
    } finally {
      setSending(false);
    }
  }

  async function handleEli5(m) {
    setEli5TargetId(m.id);
    setEli5Loading(true);
    setToast(null);
    try {
      const data = await sendChat({
        message: "",
        language,
        sessionId,
        eli5Of: m.text,
      });
      push("assistant", data.reply);
    } catch (e) {
      const detail = e.response?.data?.detail;
      setToast(typeof detail === "string" ? detail : e.message || "Request failed");
    } finally {
      setEli5Loading(false);
      setEli5TargetId(null);
    }
  }

  return (
    <div className="mx-auto flex h-[100dvh] max-w-lg flex-col px-3 pb-3 pt-3 md:mx-auto md:max-w-2xl">
      <Toast message={toast} onClose={() => setToast(null)} />
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Link to="/" className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-sm font-semibold text-white">FD Mitra</p>
            <p className="text-[11px] text-zinc-500">online</p>
          </div>
        </div>
        <LanguageSelector value={language} onChange={setLanguage} />
      </div>
      <div className="min-h-0 flex-1 py-3">
        <ChatWindow
          messages={messages}
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          sending={sending}
          onEli5={handleEli5}
          eli5TargetId={eli5TargetId}
          eli5Loading={eli5Loading}
        />
      </div>
    </div>
  );
}
