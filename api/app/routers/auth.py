from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional

from app.database import get_db
from app.models import User, Organization
from app.schemas import DemoLoginRequest, TokenResponse, UserRead
from app.auth import create_access_token, get_current_user
from app.seed_data import seed_database, seed_organization, DEMO_POSTS

router = APIRouter(prefix="/auth", tags=["Authentication & Demo"])

@router.post("/demo-login", response_model=TokenResponse)
def demo_login(
    req: DemoLoginRequest,
    db: Session = Depends(get_db),
    x_session_id: Optional[str] = Header(None)
):
    role = req.role.lower().strip()
    if role not in ["creator", "reviewer", "owner"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be one of: creator, reviewer, owner"
        )

    # Determine caller session sandbox ID
    raw_sess = req.session_id or x_session_id or "novafest"
    # Clean characters
    clean_sess = "".join(c for c in raw_sess if c.isalnum() or c in "_-")[:32]
    org_id = f"org_{clean_sess}" if not clean_sess.startswith("org_") else clean_sess

    # Ensure organization and users exist
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        seed_organization(db, org_id=org_id)

    user = db.query(User).filter(User.org_id == org_id, User.role == role).first()
    if not user:
        seed_organization(db, org_id=org_id)
        user = db.query(User).filter(User.org_id == org_id, User.role == role).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not initialize demo user")

    token = create_access_token(data={"sub": user.id, "role": user.role, "email": user.email, "org_id": user.org_id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/reset-demo")
def reset_demo_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Resets caller's isolated sandbox organization back to pristine Nova Fest seed state.
    Never alters other judges' sandboxes.
    """
    target_org = current_user.org_id or "org_novafest"
    seed_organization(db, org_id=target_org, force_reset=True)
    return {"status": "success", "message": f"Demo organization {target_org} successfully reset to clean Nova Fest state."}

@router.get("/demo-posts")
def get_demo_posts():
    """
    Returns the 6 seeded demo posts with planted errors.
    """
    return DEMO_POSTS
