"""Natal chart regression tests against known reference data."""

import pytest

from backend.core.chart import NatalChartCalculator
from backend.core.ephemeris import Ephemeris
from backend.core.helpers import angular_distance, find_house, longitude_to_sign
from backend.core.models import BirthData, ChartConfig


def test_longitude_to_sign() -> None:
    assert longitude_to_sign(0.0) == "Aries"
    assert longitude_to_sign(30.0) == "Taurus"
    assert longitude_to_sign(59.99) == "Taurus"
    assert longitude_to_sign(90.0) == "Cancer"
    assert longitude_to_sign(359.9) == "Pisces"


def test_angular_distance() -> None:
    assert angular_distance(0, 180) == 180
    assert angular_distance(350, 10) == 20
    assert angular_distance(10, 350) == 20
    assert angular_distance(0, 0) == 0
    assert abs(angular_distance(45, 135) - 90) < 0.001


def test_find_house_simple() -> None:
    cusps = [0.0, 30.0, 60.0, 90.0, 120.0, 150.0, 180.0, 210.0, 240.0, 270.0, 300.0, 330.0]
    assert find_house(15.0, cusps) == 1
    assert find_house(45.0, cusps) == 2
    assert find_house(345.0, cusps) == 12


def test_find_house_wrapping() -> None:
    cusps = [350.0, 20.0, 50.0, 80.0, 110.0, 140.0, 170.0, 200.0, 230.0, 260.0, 290.0, 320.0]
    assert find_house(355.0, cusps) == 1
    assert find_house(5.0, cusps) == 1
    assert find_house(25.0, cusps) == 2


def test_find_house_returns_valid_range() -> None:
    cusps = [10.0, 40.0, 70.0, 100.0, 130.0, 160.0, 190.0, 220.0, 250.0, 280.0, 310.0, 340.0]
    for lon in range(0, 360, 5):
        h = find_house(float(lon), cusps)
        assert 1 <= h <= 12, f"find_house({lon}) returned {h}"


def test_belgrade_chart_sun_in_taurus(calculator: NatalChartCalculator, belgrade_birth: BirthData, default_config: ChartConfig) -> None:
    chart = calculator.compute(belgrade_birth, default_config)
    sun = next(p for p in chart.planets if p.name == "Sun")
    assert sun.sign == "Taurus", f"Expected Sun in Taurus, got {sun.sign}"
    assert abs(sun.sign_degree - 0.37) < 0.5, f"Expected Sun near 0°22' Taurus, got {sun.sign_degree:.2f}°"


def test_belgrade_chart_ascendant(calculator: NatalChartCalculator, belgrade_birth: BirthData, default_config: ChartConfig) -> None:
    chart = calculator.compute(belgrade_birth, default_config)
    asc_sign = longitude_to_sign(chart.houses.ascendant)
    assert asc_sign in ("Aquarius", "Pisces"), f"Expected ASC in Aquarius/Pisces, got {asc_sign}"


def test_einstein_sun_in_pisces(calculator: NatalChartCalculator, einstein_birth: BirthData, default_config: ChartConfig) -> None:
    chart = calculator.compute(einstein_birth, default_config)
    sun = next(p for p in chart.planets if p.name == "Sun")
    assert sun.sign == "Pisces", f"Expected Sun in Pisces, got {sun.sign}"
    assert abs(sun.sign_degree - 23.5) < 1.0, f"Expected Sun near 23°30' Pisces, got {sun.sign_degree:.2f}°"


def test_einstein_moon_in_sagittarius(calculator: NatalChartCalculator, einstein_birth: BirthData, default_config: ChartConfig) -> None:
    chart = calculator.compute(einstein_birth, default_config)
    moon = next(p for p in chart.planets if p.name == "Moon")
    assert moon.sign == "Sagittarius", f"Expected Moon in Sagittarius, got {moon.sign}"


def test_chart_has_12_house_cusps(calculator: NatalChartCalculator, belgrade_birth: BirthData, default_config: ChartConfig) -> None:
    chart = calculator.compute(belgrade_birth, default_config)
    assert len(chart.houses.cusps) == 12


def test_chart_has_aspects(calculator: NatalChartCalculator, belgrade_birth: BirthData, default_config: ChartConfig) -> None:
    chart = calculator.compute(belgrade_birth, default_config)
    assert len(chart.aspects) > 0


def test_chart_has_all_default_planets(calculator: NatalChartCalculator, belgrade_birth: BirthData, default_config: ChartConfig) -> None:
    chart = calculator.compute(belgrade_birth, default_config)
    planet_names = {p.name for p in chart.planets}
    for expected in ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"]:
        assert expected in planet_names, f"Missing planet: {expected}"


def test_retrograde_detection(calculator: NatalChartCalculator, belgrade_birth: BirthData, default_config: ChartConfig) -> None:
    chart = calculator.compute(belgrade_birth, default_config)
    for p in chart.planets:
        assert p.is_retrograde == (p.speed < 0), f"{p.name}: retrograde={p.is_retrograde}, speed={p.speed}"


def test_different_house_systems(calculator: NatalChartCalculator, belgrade_birth: BirthData) -> None:
    systems = ["placidus", "koch", "equal", "whole_sign"]
    results = {}
    for sys in systems:
        config = ChartConfig(house_system=sys)
        chart = calculator.compute(belgrade_birth, config)
        results[sys] = chart.houses.cusps
        assert len(chart.houses.cusps) == 12
    assert results["placidus"] != results["whole_sign"]
