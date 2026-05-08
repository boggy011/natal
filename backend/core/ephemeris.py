"""Thin wrapper around pyswisseph — converts datetime to Julian day, returns planetary positions and house cusps."""

from datetime import datetime

import swisseph as swe

from backend.core.constants import HOUSE_SYSTEMS, PLANETS_SE


class EphemerisError(Exception):
    pass


class Ephemeris:
    def __init__(self, ephe_path: str | None = None) -> None:
        if ephe_path:
            swe.set_ephe_path(ephe_path)

    def julian_day(self, dt_utc: datetime) -> float:
        decimal_hour = dt_utc.hour + dt_utc.minute / 60 + dt_utc.second / 3600
        return swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, decimal_hour)

    def planet(self, jd: float, planet_name: str) -> tuple[float, float, float]:
        if planet_name not in PLANETS_SE:
            raise EphemerisError(f"Unknown planet: {planet_name}")
        result, _flags = swe.calc_ut(jd, PLANETS_SE[planet_name])
        return result[0], result[1], result[3]

    def houses(self, jd: float, lat: float, lon: float, system: str = "placidus") -> tuple[tuple[float, ...], float, float]:
        if system not in HOUSE_SYSTEMS:
            raise EphemerisError(f"Unknown house system: {system}")
        cusps, ascmc = swe.houses(jd, lat, lon, HOUSE_SYSTEMS[system])
        return tuple(cusps), ascmc[0], ascmc[1]

    def obliquity(self, jd: float) -> float:
        result, _flags = swe.calc_ut(jd, swe.ECL_NUT)
        return result[0]
