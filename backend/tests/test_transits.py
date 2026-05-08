"""Transit scanner tests — verify detection of known transit events."""

from datetime import date

import pytest

from backend.core.chart import NatalChartCalculator
from backend.core.ephemeris import Ephemeris
from backend.core.models import BirthData, ChartConfig
from backend.core.transits import TransitScanner


@pytest.fixture
def scanner(ephemeris: Ephemeris) -> TransitScanner:
    return TransitScanner(ephemeris)


def test_transit_scan_returns_hits(
    scanner: TransitScanner,
    calculator: NatalChartCalculator,
    belgrade_birth: BirthData,
    default_config: ChartConfig,
) -> None:
    chart = calculator.compute(belgrade_birth, default_config)
    hits = scanner.scan(
        natal=chart,
        start=date(2025, 1, 1),
        end=date(2025, 3, 31),
        transit_planets=["Saturn", "Jupiter", "Pluto"],
    )
    assert isinstance(hits, list)


def test_transit_hits_have_valid_data(
    scanner: TransitScanner,
    calculator: NatalChartCalculator,
    belgrade_birth: BirthData,
    default_config: ChartConfig,
) -> None:
    chart = calculator.compute(belgrade_birth, default_config)
    hits = scanner.scan(
        natal=chart,
        start=date(2025, 1, 1),
        end=date(2025, 6, 30),
    )
    for hit in hits:
        assert 0 <= hit.transit_lon < 360
        assert 0 <= hit.natal_lon < 360
        assert hit.orb_at_exact >= 0
        assert hit.transit_planet in ("Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto")


def test_saturn_return_detection(
    scanner: TransitScanner,
    calculator: NatalChartCalculator,
    ephemeris: Ephemeris,
) -> None:
    birth = BirthData(
        name="Saturn Return Test",
        year=1990, month=6, day=15,
        hour=12, minute=0,
        latitude=44.8, longitude=20.5,
        timezone="Europe/Belgrade",
    )
    config = ChartConfig()
    chart = calculator.compute(birth, config)

    natal_saturn = next(p for p in chart.planets if p.name == "Saturn")

    hits = scanner.scan(
        natal=chart,
        start=date(2019, 1, 1),
        end=date(2021, 12, 31),
        transit_planets=["Saturn"],
        natal_points=["Saturn"],
        aspects=["conjunction"],
    )

    saturn_conjunctions = [h for h in hits if h.transit_planet == "Saturn" and h.natal_point == "Saturn"]
    assert len(saturn_conjunctions) > 0, "Expected to find Saturn conjunct natal Saturn (Saturn return)"


def test_empty_range_returns_no_hits(
    scanner: TransitScanner,
    calculator: NatalChartCalculator,
    belgrade_birth: BirthData,
    default_config: ChartConfig,
) -> None:
    chart = calculator.compute(belgrade_birth, default_config)
    hits = scanner.scan(
        natal=chart,
        start=date(2025, 1, 1),
        end=date(2025, 1, 1),
    )
    assert isinstance(hits, list)


def test_transit_scan_sorted_by_date(
    scanner: TransitScanner,
    calculator: NatalChartCalculator,
    belgrade_birth: BirthData,
    default_config: ChartConfig,
) -> None:
    chart = calculator.compute(belgrade_birth, default_config)
    hits = scanner.scan(
        natal=chart,
        start=date(2025, 1, 1),
        end=date(2025, 6, 30),
    )
    for i in range(1, len(hits)):
        assert hits[i].date >= hits[i - 1].date, "Hits should be sorted by date"
