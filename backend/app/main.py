# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Use absolute imports since all files are in the same folder
import database
import auth
import crud

# Create tables
database.Base.metadata.create_all(bind=database.engine)

# Initialize FastAPI app
app = FastAPI(title="Project Pulse API")

# Configure CORS
origins_env = os.environ.get("ALLOW_ORIGINS")
if origins_env:
    origins = [o.strip() for o in origins_env.split(",") if o.strip()]
else:
    origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok"}

# Include routers
app.include_router(auth.router)
app.include_router(crud.router)
