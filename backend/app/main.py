from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .database import Base, engine
from . import auth, crud

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Project Pulse API")

# Allow configuring allowed origins via environment variable for easier local/dev setup.
# Example: ALLOW_ORIGINS="http://localhost:5173,http://localhost:3000"
origins_env = os.environ.get("ALLOW_ORIGINS")
if origins_env:
  origins = [o.strip() for o in origins_env.split(",") if o.strip()]
else:
  # sensible defaults for Vite / CRA dev servers and local testing
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


@app.get("/health")
async def health_check():
  return {"status": "ok"}


app.include_router(auth.router)
app.include_router(crud.router)