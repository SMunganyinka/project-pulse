from typing import Optional, Literal, List

from pydantic import BaseModel, EmailStr, Field

StatusLiteral = Literal["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]


# ---------- Users ----------
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(min_length=6, max_length=128)


class UserRead(UserBase):
    id: int
    role: str

    class Config:
        orm_mode = True


# ---------- Auth ----------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead


# ---------- Projects ----------
class ProjectBase(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    status: StatusLiteral = "NOT_STARTED"


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[StatusLiteral] = None


class ProjectRead(ProjectBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True


class ProjectsList(BaseModel):
    projects: List[ProjectRead]
    total: int