"""POST /api/transits — scan transits over a date range against a natal chart."""

from datetime import timedelta

from fastapi import APIRouter, HTTPException

from backend.core.ephemeris import Ephemeris
from backend.core.models import TransitRequest, TransitScan
from backend.core.transits import TransitScanner
from backend.core.interpretations import transit_meaning
from backend.config import settings

router = APIRouter()

MAX_RANGE_DAYS = 365 * 5


@router.post("/transits", response_model=TransitScan)
def scan_transits(request: TransitRequest) -> TransitScan:
    delta = (request.end - request.start).days
    if delta < 0:
        raise HTTPException(status_code=422, detail="End date must be after start date")
    if delta > MAX_RANGE_DAYS:
        raise HTTPException(status_code=422, detail=f"Date range cannot exceed {MAX_RANGE_DAYS} days")

    eph = Ephemeris(settings.ephe_path)
    scanner = TransitScanner(eph)
    hits = scanner.scan(
        natal=request.natal,
        start=request.start,
        end=request.end,
        transit_planets=request.transit_planets,
        natal_points=request.natal_points,
        aspects=request.aspects,
    )

    return TransitScan(
        natal=request.natal,
        range_start=request.start,
        range_end=request.end,
        hits=hits,
    )


@router.post("/transits/interpret")
def interpret_transit(transit_planet: str, aspect: str, natal_point: str) -> dict[str, str]:
    return {"interpretation": transit_meaning(transit_planet, aspect, natal_point)}
