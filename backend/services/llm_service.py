import os

from groq import Groq

LANGUAGE_LABELS = {
    "hi": "Hindi (Devanagari script where natural)",
    "bho": "Bhojpuri (can use Devanagari script)",
    "ta": "Tamil (Tamil script)",
    "en": "English",
}


def _system_prompt(language: str) -> str:
    label = LANGUAGE_LABELS.get(language, "English")
    return f"""You are "FD Mitra", a friendly Fixed Deposit advisor for first-time investors in India.
- Always respond in {label}.
- Never use financial jargon without immediately explaining it in simple terms.
- Use analogies from daily life (e.g., "FD is like locking money in a gullak that grows").
- If the user seems confused, offer to explain step by step.
- Keep responses short (3-4 sentences max) unless the user asks for detail.
- Current context: User is looking at FD options and needs guidance.
- Do not claim live bank rates; suggest they verify rates on the bank website or branch."""


def _client():
    key = os.getenv("GROQ_API_KEY")
    if not key:
        raise RuntimeError("GROQ_API_KEY is not set")
    return Groq(api_key=key)


def chat_completion(
    user_message: str,
    language: str,
    extra_context: str | None = None,
    eli5: bool = False,
) -> str:
    system = _system_prompt(language)
    if eli5:
        system += (
            "\nThe user tapped 'Explain Like I'm 5'. Rewrite the following assistant text "
            "in extremely simple words, like talking to a small child, still in the same language."
        )
    messages = [{"role": "system", "content": system}]
    if extra_context:
        messages.append({"role": "system", "content": f"Context:\n{extra_context}"})
    messages.append({"role": "user", "content": user_message})
    client = _client()
    model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    resp = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0.5,
        max_tokens=512,
    )
    return (resp.choices[0].message.content or "").strip()


def advisor_reply(
    user_message: str,
    language: str,
    history_snippet: str | None = None,
    eli5_of: str | None = None,
) -> str:
    if eli5_of:
        return chat_completion(
            f"Explain this more simply:\n\n{eli5_of}",
            language,
            extra_context=history_snippet,
            eli5=True,
        )
    return chat_completion(user_message, language, extra_context=history_snippet)
