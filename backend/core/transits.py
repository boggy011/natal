"""Transit scanner — walks a date range and detects exact aspect crossings between transit and natal positions."""

from datetime import date, datetime, time, timedelta, timezone

from backend.core.constants import ASPECTS, TRANSIT_ORBS
from backend.core.ephemeris import Ephemeris
from backend.core.helpers import angular_distance
from backend.core.models import NatalChart, TransitHit

DEFAULT_TRANSIT_PLANETS = ("Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto")
DEFAULT_TRANSIT_ASPECTS = ("conjunction", "opposition", "square", "trine", "sextile")


class TransitScanner:
    def __init__(self, ephemeris: Ephemeris) -> None:
        self.eph = ephemeris

    def scan(
        self,
        natal: NatalChart,
        start: date,
        end: date,
        transit_planets: list[str] | None = None,
        natal_points: list[str] | None = None,
        aspects: list[str] | None = None,
    ) -> list[TransitHit]:
        if transit_planets is None:
            transit_planets = list(DEFAULT_TRANSIT_PLANETS)
        if aspects is None:
            aspects = list(DEFAULT_TRANSIT_ASPECTS)

        natal_lons: dict[str, float] = {p.name: p.longitude for p in natal.planets}
        natal_lons["ASC"] = natal.houses.ascendant
        natal_lons["MC"] = natal.houses.midheaven

        if natal_points is None:
            natal_points = list(natal_lons.keys())
        else:
            natal_points = [np for np in natal_points if np in natal_lons]

        prev: dict[tuple[str, str, str], tuple[float, date, float, float]] = {}
        hits: list[TransitHit] = []
        d = start

        while d <= end:
            jd = self.eph.julian_day(datetime.combine(d, time(12, 0), tzinfo=timezone.utc))
            for tp in transit_planets:
                t_lon, _, t_speed = self.eph.planet(jd, tp)
                for np_ in natal_points:
                    n_lon = natal_lons[np_]
                    ang = angular_distance(t_lon, n_lon)
                    for asp_name in aspects:
                        if asp_name not in ASPECTS:
                            continue
                        exact, _ = ASPECTS[asp_name]
                        orb = abs(ang - exact)
                        max_orb = TRANSIT_ORBS.get(asp_name, 1.5)
                        if orb > max_orb:
                            if (tp, asp_name, np_) in prev:
                                del prev[(tp, asp_name, np_)]
                            continue

                        key = (tp, asp_name, np_)
                        if key in prev:
                            p_orb, p_date, p_lon, p_speed = prev[key]
                            if orb > p_orb:
                                hits.append(
                                    TransitHit(
                                        date=datetime.combine(p_date, time(12, 0), tzinfo=timezone.utc),
                                        transit_planet=tp,
                                        natal_point=np_,
                                        aspect=asp_name,
                                        orb_at_exact=round(p_orb, 4),
                                        transit_lon=round(p_lon, 4),
                                        natal_lon=round(n_lon, 4),
                                        is_retrograde=p_speed < 0,
                                    )
                                )
                        prev[key] = (orb, d, t_lon, t_speed)
            d += timedelta(days=1)

        return sorted(hits, key=lambda h: h.date)
