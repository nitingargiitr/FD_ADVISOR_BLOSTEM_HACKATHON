# 🏦 Vernacular FD Advisor (FD Mitra)

An AI-powered, multi-lingual financial inclusion platform designed to eliminate banking jargon and empower first-time investors from Tier-2 and Tier-3 Indian cities.

[🚀 **Live Demo on Render**](https://fd-advisor-blostem-hackathon-1.onrender.com/)

---

## 🛑 The Problem

Across India, millions of people save locally in cash or informal setups because formal banking feels overwhelming. Financial terms like *Compound Interest*, *Maturity*, *Tenor*, and *TDS* are often explained in highly technical English. For an elder in a village or a small business owner in a Tier-3 town, investing in a Fixed Deposit (FD) is often a stressful process dictated by a bank agent rather than their own understanding.

## 💡 Our Solution - FD Mitra

**FD Mitra** bridges this trust and literacy gap. We built an empathetic, voice-enabled AI companion that speaks the user's native language (e.g., Hindi, Bhojpuri, Tamil, English). It acts as a trusted elder sibling, breaking down complex financial jargon into relatable, bite-sized analogies.

### ✨ Key Features

*   **🗣️ True Vernacular AI Chat**: Deep integration with Groq's high-speed **Llama-3.3-70B** model, fine-tuned strictly to provide localized, culturally contextual answers in the user's native language. 
*   **🎙️ Voice-First Interaction**: Integrated seamless Speech-to-Text (STT) and Text-to-Speech (TTS). Users who are not comfortable typing can just tap the microphone and ask questions naturally.
*   **👶 ELI5 (Explain Like I'm 5)**: A one-tap button on AI responses that instantly rewrites the advisor’s message into even simpler words, akin to explaining concepts to a child.
*   **📊 Live Bank Comparison & Calculator**: Interactive sliders to instantly see the real compounding math. It compares current FD rates across Public, Private, and Small Finance banks, accurately calculating returns with proper warnings for Senior Citizen bonuses and TDS.
*   **🏦 Interactive Booking Flow**: A simulated, step-by-step chat flow to build confidence in the actual booking process without the fear of pressing the wrong button.

---

## 🛠️ Tech Stack

We focused on an ultra-fast, highly responsive architecture since our target demographic may not have access to high-end devices or flawless internet.

**Frontend:**
*   **React 18 & Vite**: Lightning-fast hot-reloading and optimized build sizes.
*   **Tailwind CSS 3.4**: Premium, dark-slate glassmorphism UI styled specifically to look trustworthy and modern, yet incredibly lightweight.
*   **Lucide React**: Clean, semantic iconography.

**Backend:**
*   **FastAPI**: Blazing fast Python backend capable of high concurrency.
*   **Groq API**: Sub-second LLM inference times using `llama-3.3-70b-versatile`, crucial for real-time natural conversations.
*   **SQLAlchemy / SQLite**: Robust, file-based persistence for chat histories and booking sessions.

---

## 📂 Project Structure

The repository is structured as a clean Monorepo:

### `frontend/` (React + Vite)
*   **`src/components/`**: Modular widget files (`ChatWindow.jsx`, `BankComparison.jsx`, `FDCalculator.jsx`, `BookingFlow.jsx`).
*   **`src/pages/`**: Main page views (`Landing.jsx`, `Home.jsx`).
*   **`src/utils/`**: Custom hooks and Native Web Speech API integrations (`speech.js`).

### `backend/` (FastAPI)
*   **`models/`**: SQLAlchemy Database configurations and Pydantic schemas (`database.py`, `schemas.py`).
*   **`routes/`**: FastAPI API endpoints (`chat.py`, `fd.py`, `booking.py`).
*   **`services/`**: Core business logic modules (`llm_service.py` using Groq, `fd_service.py`, `jargon_service.py`).
*   **`main.py`**: The main entry point, combining the API and serving the static React build for monolithic deployment.

---

## 🔌 Core API Endpoints

*   **`POST /api/chat/message`**: Core conversation endpoint. Maintains context history and generates localized LLM responses.
*   **`POST /api/chat/eli5`**: Specifically calls the LLM with an override prompt to simplify a previous response.
*   **`GET /api/fd/banks`**: Fetches the structured list of supported banks, Types, and their current '6M', '12M', '24M' interest rates.
*   **`POST /api/fd/calculate`**: Server-side calculation applying standard Indian compounding logic, including constraints like Senior Citizen premiums.
*   **`POST /api/booking/start` & `/step`**: Manages the state machine (in the SQLite DB) for the mock booking wizard.

---

## ⚙️ Local Setup Guide

Follow these steps to run **FD Mitra** locally:

### 1. Clone the repository
```bash
git clone https://github.com/nitingargiitr/FD_ADVISOR_BLOSTEM_HACKATHON.git
cd FD_ADVISOR_BLOSTEM_HACKATHON
```

### 2. Set up the Environment Variables
Create a `.env` file in the `backend` directory with your API keys:
```env
# backend/.env
GROQ_API_KEY="gsk_your_groq_api_key_here"
GROQ_MODEL="llama-3.3-70b-versatile"
CORS_ORIGINS="http://localhost:5173,http://127.0.0.1:5173"
```

### 3. Start the Backend
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 10000
```

### 4. Start the Frontend (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).

---
*Built with ❤️ for the Blostem Hackathon.*
