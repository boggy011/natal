"""Astrological constants: signs, planets, aspects, house systems."""

import swisseph as swe

ZODIAC_SIGNS = (
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
)

PLANETS_SE: dict[str, int] = {
    "Sun": swe.SUN,
    "Moon": swe.MOON,
    "Mercury": swe.MERCURY,
    "Venus": swe.VENUS,
    "Mars": swe.MARS,
    "Jupiter": swe.JUPITER,
    "Saturn": swe.SATURN,
    "Uranus": swe.URANUS,
    "Neptune": swe.NEPTUNE,
    "Pluto": swe.PLUTO,
    "North Node": swe.MEAN_NODE,
    "Chiron": swe.CHIRON,
    "Lilith": swe.MEAN_APOG,
}

DEFAULT_PLANETS = (
    "Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter",
    "Saturn", "Uranus", "Neptune", "Pluto", "North Node",
)

ASPECTS: dict[str, tuple[float, float]] = {
    "conjunction": (0.0, 8.0),
    "opposition": (180.0, 8.0),
    "trine": (120.0, 7.0),
    "square": (90.0, 7.0),
    "sextile": (60.0, 5.0),
    "quincunx": (150.0, 3.0),
    "semisextile": (30.0, 2.0),
}

TRANSIT_ORBS: dict[str, float] = {
    "conjunction": 1.5,
    "opposition": 1.5,
    "square": 1.5,
    "trine": 1.5,
    "sextile": 1.0,
    "quincunx": 1.0,
    "semisextile": 0.8,
}

HOUSE_SYSTEMS: dict[str, bytes] = {
    "placidus": b"P",
    "koch": b"K",
    "equal": b"E",
    "whole_sign": b"W",
    "regiomontanus": b"R",
    "campanus": b"C",
}

DEFAULT_ASPECTS = ("conjunction", "opposition", "trine", "square", "sextile", "quincunx", "semisextile")
