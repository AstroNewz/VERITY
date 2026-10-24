from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Finding, User
from app.schemas import FindingRead, FindingDecisionUpdate
from app.auth import get_current_user

router = APIRouter(prefix="/findings", tags=["Findings & Decisions"])

@router.patch("/{id}", response_model=FindingRead)
def update_finding_decision(
    id: str,
    update_in: FindingDecisionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    finding = db.query(Finding).filter(Finding.id == id).first()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")

    decision = update_in.decision.lower().strip()
    if decision not in ["accept", "reject"]:
        raise HTTPException(status_code=400, detail="Decision must be 'accept' or 'reject'")

    finding.decision = decision
    finding.decided_by = current_user.id
    finding.decided_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(finding)
    return finding
