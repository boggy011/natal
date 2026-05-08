"""Pure utility functions for astrological calculations."""

from collections.abc import Sequence

from backend.core.constants import ZODIAC_SIGNS


def longitude_to_sign(lon: float) -> str:
    return ZODIAC_SIGNS[int(lon // 30) % 12]


def angular_distance(a: float, b: float) -> float:
    d = abs(a - b) % 360
    return min(d, 360 - d)


def find_house(lon: float, cusps: Sequence[float]) -> int:
    for i in range(12):
        s = cusps[i]
        e = cusps[(i + 1) % 12]
        if s < e:
            if s <= lon < e:
                return i + 1
        else:
            if lon >= s or lon < e:
                return i + 1
    return 12
