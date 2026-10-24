from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database import get_db
from app.models import User
from app.schemas import DemoLoginRequest, TokenResponse, UserRead
from app.auth import create_access_token, get_current_user
from app.seed_data import seed_database, DEMO_POSTS

router = APIRouter(prefix="/auth", tags=["Authentication & Demo"])

@router.post("/demo-login", response_model=TokenResponse)
def demo_login(req: DemoLoginRequest, db: Session = Depends(get_db)):
    role = req.role.lower().strip()
    if role not in ["creator", "reviewer", "owner"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be one of: creator, reviewer, owner"
        )

    user = db.query(User).filter(User.role == role).first()
    if not user:
        # Re-seed if user doesn't exist
        seed_database(db)
        user = db.query(User).filter(User.role == role).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not initialize demo user")

    token = create_access_token(data={"sub": user.id, "role": user.role, "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/reset-demo")
def reset_demo_data(db: Session = Depends(get_db)):
    """
    Resets database back to pristine Nova Fest seed state.
    """
    seed_database(db, force_reset=True)
    return {"status": "success", "message": "Demo database successfully reset to clean Nova Fest state."}

@router.get("/demo-posts")
def get_demo_posts():
    """
    Returns the 6 seeded demo posts with planted errors.
    """
    return DEMO_POSTS
