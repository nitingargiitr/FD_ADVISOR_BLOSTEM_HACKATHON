const OPTIONS = [
  { code: "hi", label: "हिंदी" },
  { code: "bho", label: "भोजपुरी" },
  { code: "ta", label: "தமிழ்" },
  { code: "en", label: "English" },
];

export default function LanguageSelector({ value, onChange, className = "" }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-sky-500/60 ${className}`}
    >
      {OPTIONS.map((o) => (
        <option key={o.code} value={o.code}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export { OPTIONS as LANGUAGE_OPTIONS };
