from fastapi import FastAPI
from app.api import routes

app = FastAPI(title="Chatbot Backend")

# Include your routes
app.include_router(routes.router)

# Root route
@app.get("/")
def root():
    return {"message": "Chatbot Backend is running"}
