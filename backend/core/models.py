"""Pydantic v2 models for all astrological data structures."""

from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field

from backend.core.constants import DEFAULT_ASPECTS, DEFAULT_PLANETS

PlanetName = str
SignName = str
AspectName = str
HouseSystemName = Literal["placidus", "koch", "equal", "whole_sign", "regiomontanus", "campanus"]


class BirthData(BaseModel):
    name: str | None = None
    year: int = Field(ge=1800, le=2200)
    month: int = Field(ge=1, le=12)
    day: int = Field(ge=1, le=31)
    hour: int = Field(ge=0, le=23, default=12)
    minute: int = Field(ge=0, le=59, default=0)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    timezone: str = "UTC"
    place_name: str | None = None


class ChartConfig(BaseModel):
    house_system: HouseSystemName = "placidus"
    planets: list[str] = Field(default_factory=lambda: list(DEFAULT_PLANETS))
    aspects: list[str] = Field(default_factory=lambda: list(DEFAULT_ASPECTS))
    orb_multiplier: float = 1.0
    include_chiron: bool = True
    include_lilith: bool = False


class PlanetPosition(BaseModel):
    name: PlanetName
    longitude: float
    latitude: float
    speed: float
    sign: SignName
    sign_degree: float
    house: int
    is_retrograde: bool


class HouseCusps(BaseModel):
    cusps: list[float] = Field(min_length=12, max_length=12)
    ascendant: float
    midheaven: float
    descendant: float
    imum_coeli: float


class AspectHit(BaseModel):
    planet1: PlanetName
    planet2: PlanetName
    aspect: AspectName
    exact_angle: float
    actual_angle: float
    orb: float


class NatalChart(BaseModel):
    birth: BirthData
    config: ChartConfig
    planets: list[PlanetPosition]
    houses: HouseCusps
    aspects: list[AspectHit]
    julian_day: float
    obliquity: float


class TransitHit(BaseModel):
    date: datetime
    transit_planet: PlanetName
    natal_point: str
    aspect: AspectName
    orb_at_exact: float
    transit_lon: float
    natal_lon: float
    is_retrograde: bool


class RetroPeriod(BaseModel):
    planet: PlanetName
    start: date
    end: date


class TransitScan(BaseModel):
    natal: NatalChart
    range_start: date
    range_end: date
    hits: list[TransitHit]


class TransitRequest(BaseModel):
    natal: NatalChart
    start: date
    end: date
    transit_planets: list[str] | None = None
    natal_points: list[str] | None = None
    aspects: list[str] | None = None


class ChartRequest(BaseModel):
    birth: BirthData
    config: ChartConfig = Field(default_factory=ChartConfig)


class GeocodeResult(BaseModel):
    display_name: str
    latitude: float
    longitude: float
    timezone: str
