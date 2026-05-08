"""FastAPI application entry point — mounts API routes and serves static frontend."""

import time
from pathlib import Path

import structlog
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.api import chart, geocode, profiles, transits
from backend.config import settings
from backend.db.session import init_db

structlog.configure(
    processors=[
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer(),
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    logger_factory=structlog.PrintLoggerFactory(),
)
logger = structlog.get_logger()

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):  # type: ignore[no-untyped-def]
    start = time.monotonic()
    response = await call_next(request)
    duration_ms = round((time.monotonic() - start) * 1000, 1)
    logger.info("request", method=request.method, path=request.url.path, status=response.status_code, duration_ms=duration_ms)
    return response


app.include_router(chart.router, prefix="/api", tags=["chart"])
app.include_router(transits.router, prefix="/api", tags=["transits"])
app.include_router(geocode.router, prefix="/api", tags=["geocode"])
app.include_router(profiles.router, prefix="/api", tags=["profiles"])


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "ephemeris": "loaded"}


@app.on_event("startup")
def on_startup() -> None:
    init_db()
    logger.info("app_started", env=settings.app_env)


frontend_path = Path(__file__).parent.parent / "frontend"
if frontend_path.exists():
    app.mount("/", StaticFiles(directory=str(frontend_path), html=True), name="frontend")
