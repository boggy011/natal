"""Natal chart calculator — computes planet positions, house cusps, and aspects from birth data."""

from datetime import datetime

import pytz

from backend.core.constants import ASPECTS
from backend.core.ephemeris import Ephemeris
from backend.core.helpers import angular_distance, find_house, longitude_to_sign
from backend.core.models import (
    AspectHit,
    BirthData,
    ChartConfig,
    HouseCusps,
    NatalChart,
    PlanetPosition,
)


class NatalChartCalculator:
    def __init__(self, ephemeris: Ephemeris) -> None:
        self.eph = ephemeris

    def compute(self, birth: BirthData, config: ChartConfig) -> NatalChart:
        utc = self._to_utc(birth)
        jd = self.eph.julian_day(utc)
        cusps_tuple, asc, mc = self.eph.houses(jd, birth.latitude, birth.longitude, config.house_system)
        houses = HouseCusps(
            cusps=list(cusps_tuple),
            ascendant=asc,
            midheaven=mc,
            descendant=(asc + 180) % 360,
            imum_coeli=(mc + 180) % 360,
        )

        planet_names = list(config.planets)
        if config.include_chiron and "Chiron" not in planet_names:
            planet_names.append("Chiron")
        if config.include_lilith and "Lilith" not in planet_names:
            planet_names.append("Lilith")

        planets = [self._planet_position(jd, name, houses) for name in planet_names]
        aspects = self._find_aspects(planets, config)
        obliquity = self.eph.obliquity(jd)

        return NatalChart(
            birth=birth,
            config=config,
            planets=planets,
            houses=houses,
            aspects=aspects,
            julian_day=jd,
            obliquity=obliquity,
        )

    def _planet_position(self, jd: float, name: str, houses: HouseCusps) -> PlanetPosition:
        lon, lat, speed = self.eph.planet(jd, name)
        return PlanetPosition(
            name=name,
            longitude=lon,
            latitude=lat,
            speed=speed,
            sign=longitude_to_sign(lon),
            sign_degree=lon % 30,
            house=find_house(lon, houses.cusps),
            is_retrograde=speed < 0,
        )

    def _find_aspects(self, planets: list[PlanetPosition], config: ChartConfig) -> list[AspectHit]:
        out: list[AspectHit] = []
        for i, p1 in enumerate(planets):
            for p2 in planets[i + 1 :]:
                ang = angular_distance(p1.longitude, p2.longitude)
                for asp_name in config.aspects:
                    if asp_name not in ASPECTS:
                        continue
                    exact, base_orb = ASPECTS[asp_name]
                    orb_limit = base_orb * config.orb_multiplier
                    diff = abs(ang - exact)
                    if diff <= orb_limit:
                        out.append(
                            AspectHit(
                                planet1=p1.name,
                                planet2=p2.name,
                                aspect=asp_name,
                                exact_angle=exact,
                                actual_angle=ang,
                                orb=round(diff, 4),
                            )
                        )
        return out

    @staticmethod
    def _to_utc(birth: BirthData) -> datetime:
        local = datetime(birth.year, birth.month, birth.day, birth.hour, birth.minute)
        tz = pytz.timezone(birth.timezone)
        localized = tz.localize(local)
        return localized.astimezone(pytz.UTC).replace(tzinfo=None)
