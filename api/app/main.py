from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seed_data import seed_database
from app.routers import (
    auth, rules, ledger, submissions, findings, passports, radar, insights, ai_logs
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    Base.metadata.create_all(bind=engine)
    # Auto-seed pristine Nova Fest data
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="Verity — Brand Governance Platform",
    description="Brand governance that cites before it flags. Every finding names the rule, explains why, and suggests an intent-preserving fix.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoints
@app.get("/", tags=["Health"])
@app.get("/health", tags=["Health"])
@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "product": "Verity",
        "tagline": "Brand governance that cites before it flags.",
        "version": "1.0.0"
    }

# Register Versioned API Routers
api_v1_prefix = settings.API_V1_STR

app.include_router(auth.router, prefix=api_v1_prefix)
app.include_router(rules.router, prefix=api_v1_prefix)
app.include_router(ledger.router, prefix=api_v1_prefix)
app.include_router(submissions.router, prefix=api_v1_prefix)
app.include_router(findings.router, prefix=api_v1_prefix)
app.include_router(passports.router, prefix=api_v1_prefix)
app.include_router(radar.router, prefix=api_v1_prefix)
app.include_router(insights.router, prefix=api_v1_prefix)
app.include_router(ai_logs.router, prefix=api_v1_prefix)
