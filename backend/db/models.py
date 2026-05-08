"""SQLModel tables for persistent storage of profiles and geocode cache."""

import json
from datetime import datetime, timezone

from sqlmodel import Field, SQLModel

from backend.core.models import BirthData, GeocodeResult


class Profile(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    birth_data_json: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    @property
    def birth_data(self) -> BirthData:
        return BirthData.model_validate_json(self.birth_data_json)

    @classmethod
    def from_birth_data(cls, name: str, birth: BirthData) -> "Profile":
        return cls(name=name, birth_data_json=birth.model_dump_json())


class GeocodeCache(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    query: str = Field(index=True, unique=True)
    display_name: str
    latitude: float
    longitude: float
    timezone_name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    def to_result(self) -> GeocodeResult:
        return GeocodeResult(
            display_name=self.display_name,
            latitude=self.latitude,
            longitude=self.longitude,
            timezone=self.timezone_name,
        )

    @classmethod
    def from_result(cls, query: str, result: GeocodeResult) -> "GeocodeCache":
        return cls(
            query=query.strip().lower(),
            display_name=result.display_name,
            latitude=result.latitude,
            longitude=result.longitude,
            timezone_name=result.timezone,
        )
