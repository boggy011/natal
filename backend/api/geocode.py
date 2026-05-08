"""GET /api/geocode — resolve a place name to coordinates and timezone."""

from fastapi import APIRouter, HTTPException, Query

from backend.core.geocoder import GeocodeError, Geocoder
from backend.core.models import GeocodeResult
from backend.config import settings

router = APIRouter()

_geocoder: Geocoder | None = None


def get_geocoder() -> Geocoder:
    global _geocoder
    if _geocoder is None:
        _geocoder = Geocoder(user_agent=settings.nominatim_user_agent)
    return _geocoder


@router.get("/geocode", response_model=GeocodeResult)
def geocode(q: str = Query(min_length=2, description="Place name to search")) -> GeocodeResult:
    try:
        return get_geocoder().lookup(q)
    except GeocodeError as e:
        raise HTTPException(status_code=404, detail=str(e))
