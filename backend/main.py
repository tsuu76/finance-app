"""
CashFlo — FastAPI application entry point.
Run with: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router
from database import init_db

app = FastAPI(
    title="CashFlo API",
    description="Personal finance engine — calculations, insights, and AI advice.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialise SQLite tables on startup
@app.on_event("startup")
async def startup():
    init_db()

app.include_router(router, prefix="/api")

@app.get("/")
async def root():
    return {"status": "CashFlo running", "version": "2.0.0", "docs": "/docs"}
