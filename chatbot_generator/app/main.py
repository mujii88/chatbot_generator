from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
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

# Mount static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Include your routes
app.include_router(routes.router)

# Root route
@app.get("/")
def root():
    return {"message": "Chatbot Backend is running"}

# Widget endpoint
@app.get("/widget.js")
async def get_widget():
    from fastapi.responses import FileResponse
    return FileResponse("app/static/widget.js", media_type="application/javascript")