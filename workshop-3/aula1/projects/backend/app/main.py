from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import storage, auth

app = FastAPI(
    title="Stellar Contracts API (Educational)",
    version="0.2.0",
    description="API modular para interagir com contratos TTL e Auth",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(storage.router)
app.include_router(auth.router)

@app.get("/health")
async def health():
    return {"status": "ok"}