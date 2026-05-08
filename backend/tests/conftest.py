"""Shared test fixtures."""

import pytest

from backend.core.ephemeris import Ephemeris
from backend.core.chart import NatalChartCalculator
from backend.core.models import BirthData, ChartConfig


@pytest.fixture(scope="session")
def ephemeris() -> Ephemeris:
    return Ephemeris()


@pytest.fixture(scope="session")
def calculator(ephemeris: Ephemeris) -> NatalChartCalculator:
    return NatalChartCalculator(ephemeris)


@pytest.fixture
def belgrade_birth() -> BirthData:
    return BirthData(
        name="Test Belgrade",
        year=1975, month=4, day=21,
        hour=3, minute=15,
        latitude=44.8176, longitude=20.4569,
        timezone="Europe/Belgrade",
        place_name="Belgrade, Serbia",
    )


@pytest.fixture
def einstein_birth() -> BirthData:
    return BirthData(
        name="Albert Einstein",
        year=1879, month=3, day=14,
        hour=11, minute=30,
        latitude=48.4011, longitude=9.9876,
        timezone="Europe/Berlin",
        place_name="Ulm, Germany",
    )


@pytest.fixture
def default_config() -> ChartConfig:
    return ChartConfig()
