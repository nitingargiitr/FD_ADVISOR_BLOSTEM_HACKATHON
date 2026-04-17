import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models.database import init_db
from routes import booking, chat, fd

load_dotenv()

app = FastAPI(title="Vernacular FD Advisor", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(fd.router)
app.include_router(booking.router)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/health")
def health():
    return {"status": "ok"}


# ---- Serve React App ----
from fastapi.responses import FileResponse
from pathlib import Path

frontend_dist = Path(__file__).parent.parent / "frontend" / "dist"

@app.get("/{full_path:path}")
def serve_react_app(full_path: str):
    """
    Catch-all route to serve the SPA. 
    It checks if the requested file exists (like static assets),
    otherwise it falls back to index.html for React Router.
    """
    file_path = frontend_dist / full_path
    if file_path.is_file():
        return FileResponse(file_path)
    
    index_file = frontend_dist / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
        
    return {"error": "Frontend build not found. Please run 'npm run build' in frontend directory."}
