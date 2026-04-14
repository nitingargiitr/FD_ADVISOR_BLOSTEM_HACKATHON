import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import LanguageSelector from "../components/LanguageSelector.jsx";
import JargonGlossary from "../components/JargonGlossary.jsx";

export default function Glossary({ lang, setLang }) {

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>
        <LanguageSelector value={lang} onChange={setLang} />
      </div>
      <h1 className="text-2xl font-bold text-white">FD शब्दावली / சொற்கள்</h1>
      <p className="mt-2 text-sm text-zinc-500">Tap a card to see the definition in your language.</p>
      <div className="mt-8">
        <JargonGlossary language={lang} />
      </div>
    </div>
  );
}
