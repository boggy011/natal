"""POST /api/chart — compute a natal chart from birth data."""

from typing import Any

from fastapi import APIRouter, HTTPException, Query

from backend.core.chart import NatalChartCalculator
from backend.core.ephemeris import Ephemeris, EphemerisError
from backend.core.life_readings import generate_life_reading
from backend.core.models import ChartRequest, NatalChart
from backend.config import settings

router = APIRouter()


@router.post("/chart", response_model=NatalChart)
def compute_chart(request: ChartRequest) -> NatalChart:
    eph = Ephemeris(settings.ephe_path)
    calc = NatalChartCalculator(eph)
    try:
        return calc.compute(request.birth, request.config)
    except EphemerisError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chart computation failed: {e}")


@router.post("/chart/interpret")
def interpret_chart(
    chart: NatalChart,
    lang: str = Query(default="en", regex="^(en|sr|de)$"),
) -> dict[str, Any]:
    return generate_life_reading(chart, lang)
