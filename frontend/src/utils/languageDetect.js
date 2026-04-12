export function detectLanguageFromText(text) {
  if (!text || !text.trim()) return null;
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta";
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  return null;
}
