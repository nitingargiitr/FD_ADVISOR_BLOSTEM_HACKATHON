import axios from "axios";

const client = axios.create({
  baseURL: "",
  headers: { "Content-Type": "application/json" },
});

export function getSessionId() {
  const k = "fd_mitra_session";
  let id = localStorage.getItem(k);
  if (!id) {
    id = `sess_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    localStorage.setItem(k, id);
  }
  return id;
}

export async function sendChat({ message, language, sessionId, eli5Of }) {
  const { data } = await client.post("/api/chat", {
    message: message ?? "",
    language,
    session_id: sessionId,
    eli5_of: eli5Of ?? null,
  });
  return data;
}

export async function fetchBanks() {
  const { data } = await client.get("/api/fd/banks");
  return data;
}

export async function calculateFd(body) {
  const { data } = await client.post("/api/fd/calculate", body);
  return data;
}

export async function fetchJargon() {
  const { data } = await client.get("/api/fd/jargon");
  return data;
}

export async function bookingStart(language) {
  const { data } = await client.post("/api/booking/start", { language });
  return data;
}

export async function bookingStep(bookingSessionId, language, value) {
  const { data } = await client.post("/api/booking/step", {
    booking_session_id: bookingSessionId,
    language,
    value,
  });
  return data;
}
