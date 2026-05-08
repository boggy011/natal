"""Geocoding service — resolves place names to coordinates and IANA timezone using Nominatim."""

from geopy.geocoders import Nominatim
from timezonefinder import TimezoneFinder

from backend.core.models import GeocodeResult


class GeocodeError(Exception):
    pass


class Geocoder:
    def __init__(self, user_agent: str = "natal-chart-app") -> None:
        self.geo = Nominatim(user_agent=user_agent)
        self.tz_finder = TimezoneFinder()
        self._cache: dict[str, GeocodeResult] = {}

    def lookup(self, query: str) -> GeocodeResult:
        cache_key = query.strip().lower()
        if cache_key in self._cache:
            return self._cache[cache_key]

        loc = self.geo.geocode(query, addressdetails=True, timeout=10)
        if not loc:
            raise GeocodeError(f"No match for: {query}")

        tz_name = self.tz_finder.timezone_at(lat=loc.latitude, lng=loc.longitude)
        result = GeocodeResult(
            display_name=loc.address,
            latitude=round(loc.latitude, 6),
            longitude=round(loc.longitude, 6),
            timezone=tz_name or "UTC",
        )
        self._cache[cache_key] = result
        return result
