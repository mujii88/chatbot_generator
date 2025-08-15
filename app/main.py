from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes

app = FastAPI(title="Chatbot Backend")

# CORS (allow frontend dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend origin(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your routes
app.include_router(routes.router)

# Root route
@app.get("/")
def root():
    return {"message": "Chatbot Backend is running"}

# Serve widget.js from frontend public if available
FRONTEND_PUBLIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "chat-craft-frontend", "public"))

@app.get("/widget.js")
def serve_widget_js():
    widget_path = os.path.join(FRONTEND_PUBLIC_DIR, "widget.js")
    if os.path.exists(widget_path):
        return FileResponse(widget_path, media_type="application/javascript")
    return {"error": "widget.js not found. Build frontend widget first."}
