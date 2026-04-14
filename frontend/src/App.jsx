import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home.jsx";
import Landing from "./pages/Landing.jsx";
import Chat from "./pages/Chat.jsx";
import Glossary from "./pages/Glossary.jsx";

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("app_lang") || "hi");

  useEffect(() => {
    localStorage.setItem("app_lang", lang);
  }, [lang]);

  return (
    <Routes>
      <Route path="/" element={<Landing lang={lang} setLang={setLang} />} />
      <Route path="/dashboard" element={<Home lang={lang} setLang={setLang} />} />
      <Route path="/chat" element={<Chat language={lang} setLanguage={setLang} />} />
      <Route path="/glossary" element={<Glossary lang={lang} setLang={setLang} />} />
    </Routes>
  );
}
