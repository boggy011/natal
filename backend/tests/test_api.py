"""API integration tests."""

import pytest
from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)


def test_health() -> None:
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


def test_compute_chart_success() -> None:
    payload = {
        "birth": {
            "name": "Test",
            "year": 1975,
            "month": 4,
            "day": 21,
            "hour": 3,
            "minute": 15,
            "latitude": 44.8176,
            "longitude": 20.4569,
            "timezone": "Europe/Belgrade",
        },
        "config": {
            "house_system": "placidus",
        },
    }
    response = client.post("/api/chart", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "planets" in data
    assert "houses" in data
    assert "aspects" in data
    assert len(data["planets"]) >= 10
    assert len(data["houses"]["cusps"]) == 12


def test_compute_chart_invalid_date() -> None:
    payload = {
        "birth": {
            "year": 1975,
            "month": 13,
            "day": 21,
            "latitude": 44.8,
            "longitude": 20.4,
        },
    }
    response = client.post("/api/chart", json=payload)
    assert response.status_code == 422


def test_compute_chart_sun_position() -> None:
    payload = {
        "birth": {
            "year": 1975, "month": 4, "day": 21,
            "hour": 3, "minute": 15,
            "latitude": 44.8176, "longitude": 20.4569,
            "timezone": "Europe/Belgrade",
        },
    }
    response = client.post("/api/chart", json=payload)
    assert response.status_code == 200
    data = response.json()
    sun = next(p for p in data["planets"] if p["name"] == "Sun")
    assert sun["sign"] == "Taurus"
    assert abs(sun["sign_degree"] - 0.37) < 0.5


def test_transit_scan_success() -> None:
    chart_payload = {
        "birth": {
            "year": 1975, "month": 4, "day": 21,
            "hour": 3, "minute": 15,
            "latitude": 44.8176, "longitude": 20.4569,
            "timezone": "Europe/Belgrade",
        },
    }
    chart_resp = client.post("/api/chart", json=chart_payload)
    chart = chart_resp.json()

    transit_payload = {
        "natal": chart,
        "start": "2025-01-01",
        "end": "2025-03-31",
        "transit_planets": ["Saturn", "Jupiter"],
    }
    response = client.post("/api/transits", json=transit_payload)
    assert response.status_code == 200
    data = response.json()
    assert "hits" in data
    assert isinstance(data["hits"], list)


def test_transit_scan_invalid_range() -> None:
    chart_payload = {
        "birth": {
            "year": 1990, "month": 1, "day": 1,
            "latitude": 44.0, "longitude": 20.0,
        },
    }
    chart_resp = client.post("/api/chart", json=chart_payload)
    chart = chart_resp.json()

    transit_payload = {
        "natal": chart,
        "start": "2025-01-01",
        "end": "2020-01-01",
    }
    response = client.post("/api/transits", json=transit_payload)
    assert response.status_code == 422
