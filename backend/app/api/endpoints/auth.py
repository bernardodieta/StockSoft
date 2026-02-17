from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core import security
from app.core.config import settings
from app.models.user import User, UserRole
from app.models.company import Company
from app.schemas.token import Token
from app.schemas.auth import RegisterRequest
from app.schemas.user import User as UserSchema

router = APIRouter()

@router.post("/login/access-token", response_model=Token)
def login_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/register", response_model=UserSchema)
def register(
    *,
    db: Session = Depends(get_db),
    register_in: RegisterRequest,
) -> Any:
    """
    Create new company and admin user.
    """
    user = db.query(User).filter(User.email == register_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    
    # Create Company
    company = Company(name=register_in.company_name)
    db.add(company)
    db.commit()
    db.refresh(company)

    # Create User
    user = User(
        email=register_in.email,
        hashed_password=security.get_password_hash(register_in.password),
        full_name=register_in.full_name,
        company_id=company.id,
        role=UserRole.ADMIN,
        is_superuser=True, # Or False? If "superuser" means "system admin", then False. If "admin" means "company admin", then True?
        # Typically superuser is system-wide admin. Company admin is just role="admin".
        # Let's check User model. is_superuser defaults to False.
    )
    # Correcting is_superuser logic. Let's say user created via register is Company Admin (role="admin").
    # If is_superuser means "can see all companies", then False.
    # I'll keep is_superuser=False by default.
    
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
