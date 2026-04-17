// Language code mapping for Web Speech API
const SPEECH_LANG_MAP = {
  hi: "hi-IN",
  bho: "hi-IN",
  ta: "ta-IN",
  en: "en-IN",
};

// ─── SPEECH RECOGNITION (MIC) ──────────────────────────────────

export function startListening(langCode, onResult, onEnd, onError) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    onError("Speech recognition not supported. Please use Chrome or Edge.");
    return null;
  }

  try {
    const recog = new SR();
    recog.lang = SPEECH_LANG_MAP[langCode] || "en-IN";
    recog.interimResults = false;
    recog.continuous = false;
    recog.maxAlternatives = 1;

    recog.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript || "";
      if (transcript.trim()) onResult(transcript.trim());
    };

    recog.onerror = (event) => {
      if (event.error === "no-speech" || event.error === "aborted") {
        onEnd();
        return;
      }
      if (event.error === "not-allowed") {
        onError("Microphone blocked. Allow mic access in browser settings.");
        return;
      }
      onError(`Mic error: ${event.error}`);
    };

    recog.onend = () => onEnd();
    recog.start();
    return recog;
  } catch (err) {
    onError(`Could not start mic: ${err.message}`);
    return null;
  }
}

export function stopListening(recog) {
  try { recog?.stop(); } catch { /* already stopped */ }
}

export function isSpeechSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

// ─── TEXT-TO-SPEECH (SPEAKER) ───────────────────────────────────

// Track current audio for stop functionality
let currentAudio = null;
let isStopped = false;

/**
 * Speak text. Uses browser TTS with Google Translate Audio fallback for Hindi/Tamil.
 */
export function speakText(text, langCode, onEnd) {
  stopSpeaking(); // cancel anything playing
  isStopped = false;

  const lang = SPEECH_LANG_MAP[langCode] || "en-IN";

  // Try browser SpeechSynthesis first
  if (window.speechSynthesis) {
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = lang.split("-")[0];
    const voice = voices.find((v) => v.lang === lang) ||
                  voices.find((v) => v.lang.startsWith(langPrefix)) ||
                  voices.find((v) => v.name.toLowerCase().includes("google") && v.lang.startsWith(langPrefix));

    // If we found a matching voice, use browser TTS
    if (voice) {
      _speakWithSynthesis(text, lang, voice, onEnd);
      return;
    }

    // For English, always use browser TTS even without exact match
    if (langPrefix === "en") {
      _speakWithSynthesis(text, lang, null, onEnd);
      return;
    }
  }

  // Fallback: Google Translate audio (works great for Hindi/Tamil)
  _speakWithGoogleAudio(text, langCode, onEnd);
}

function _speakWithSynthesis(text, lang, voice, onEnd) {
  window.speechSynthesis.cancel();

  // Break long text into chunks (Chrome cuts off after ~15s)
  const separators = /([।.!?\n]+)/;
  const rawParts = text.split(separators).filter(Boolean);
  const chunks = [];
  for (let i = 0; i < rawParts.length; i++) {
    const part = rawParts[i].trim();
    if (part && !separators.test(part)) chunks.push(part);
  }
  if (chunks.length === 0) chunks.push(text);

  let idx = 0;

  function next() {
    if (isStopped || idx >= chunks.length) {
      onEnd?.();
      return;
    }
    const utt = new SpeechSynthesisUtterance(chunks[idx]);
    utt.lang = lang;
    utt.rate = 0.9;
    if (voice) utt.voice = voice;
    utt.onend = () => { idx++; next(); };
    utt.onerror = () => { idx++; next(); };
    window.speechSynthesis.speak(utt);
  }
  next();
}

function _speakWithGoogleAudio(text, langCode, onEnd) {
  // Google Translate TTS — reliable for hi, ta, en
  const ttsLang = { hi: "hi", bho: "hi", ta: "ta", en: "en" }[langCode] || "en";

  // Google TTS has a ~200 char limit, so chunk the text
  const maxLen = 180;
  const sentences = text.match(/[^।.!?\n]+[।.!?\n]*/g) || [text];
  const chunks = [];
  let current = "";

  for (const s of sentences) {
    if ((current + s).length > maxLen && current) {
      chunks.push(current.trim());
      current = s;
    } else {
      current += s;
    }
  }
  if (current.trim()) chunks.push(current.trim());

  let idx = 0;

  function playNext() {
    if (isStopped || idx >= chunks.length) {
      currentAudio = null;
      onEnd?.();
      return;
    }

    const encoded = encodeURIComponent(chunks[idx]);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${ttsLang}&client=tw-ob`;

    const audio = new Audio(url);
    currentAudio = audio;
    audio.playbackRate = 0.95;

    audio.onended = () => { idx++; playNext(); };
    audio.onerror = () => {
      // If Google TTS fails, skip this chunk
      idx++;
      playNext();
    };

    audio.play().catch(() => {
      idx++;
      playNext();
    });
  }

  playNext();
}

/**
 * Stop any ongoing speech — both browser TTS and audio playback.
 */
export function stopSpeaking() {
  isStopped = true;

  // Stop browser TTS
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

  // Stop audio element
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

export function isTTSSupported() {
  return true; // We have Google TTS fallback, so always available
}
