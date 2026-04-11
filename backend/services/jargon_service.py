import json
import os
import re
from functools import lru_cache

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JARGON_PATH = os.path.join(BASE_DIR, "data", "jargon.json")


@lru_cache
def _entries():
    with open(JARGON_PATH, encoding="utf-8") as f:
        return tuple(json.dumps(e) for e in json.load(f))


def all_jargon():
    return [json.loads(s) for s in _entries()]


def detect_jargon(text: str) -> list[str]:
    if not text:
        return []
    lowered = text.lower()
    found: list[str] = []
    for raw in _entries():
        entry = json.loads(raw)
        tid = entry["id"]
        term = entry["term"].lower()
        if term in lowered or entry["term"] in text:
            if tid not in found:
                found.append(tid)
            continue
        for alias in entry.get("aliases", []):
            if alias.lower() in lowered:
                if tid not in found:
                    found.append(tid)
                break
    return found


def definition_for(term_id: str, lang: str) -> str | None:
    lang = lang if lang in ("hi", "bho", "ta", "en") else "en"
    for entry in all_jargon():
        if entry["id"] == term_id:
            defs = entry.get("definitions", {})
            return defs.get(lang) or defs.get("en")
    return None


def has_devanagari(text: str) -> bool:
    return bool(re.search(r"[\u0900-\u097F]", text))


def has_tamil_script(text: str) -> bool:
    return bool(re.search(r"[\u0B80-\u0BFF]", text))
