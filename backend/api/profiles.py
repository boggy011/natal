"""CRUD endpoints for saved profiles."""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select

from backend.core.models import BirthData
from backend.db.models import Profile
from backend.db.session import get_session

router = APIRouter()


class ProfileCreate(BaseModel):
    name: str
    birth_data: BirthData


class ProfileResponse(BaseModel):
    id: int
    name: str
    birth_data: BirthData
    created_at: datetime
    updated_at: datetime


@router.get("/profiles", response_model=list[ProfileResponse])
def list_profiles(session: Session = Depends(get_session)) -> list[ProfileResponse]:
    profiles = session.exec(select(Profile)).all()
    return [
        ProfileResponse(
            id=p.id,  # type: ignore[arg-type]
            name=p.name,
            birth_data=p.birth_data,
            created_at=p.created_at,
            updated_at=p.updated_at,
        )
        for p in profiles
    ]


@router.post("/profiles", response_model=ProfileResponse, status_code=201)
def create_profile(body: ProfileCreate, session: Session = Depends(get_session)) -> ProfileResponse:
    profile = Profile.from_birth_data(body.name, body.birth_data)
    session.add(profile)
    session.commit()
    session.refresh(profile)
    return ProfileResponse(
        id=profile.id,  # type: ignore[arg-type]
        name=profile.name,
        birth_data=profile.birth_data,
        created_at=profile.created_at,
        updated_at=profile.updated_at,
    )


@router.get("/profiles/{profile_id}", response_model=ProfileResponse)
def get_profile(profile_id: int, session: Session = Depends(get_session)) -> ProfileResponse:
    profile = session.get(Profile, profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return ProfileResponse(
        id=profile.id,  # type: ignore[arg-type]
        name=profile.name,
        birth_data=profile.birth_data,
        created_at=profile.created_at,
        updated_at=profile.updated_at,
    )


@router.delete("/profiles/{profile_id}", status_code=204)
def delete_profile(profile_id: int, session: Session = Depends(get_session)) -> None:
    profile = session.get(Profile, profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    session.delete(profile)
    session.commit()
