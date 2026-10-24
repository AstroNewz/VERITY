from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import ClaimLedger, ConfidentialTerm, User
from app.schemas import (
    ClaimLedgerRead, ClaimLedgerCreate,
    ConfidentialTermRead, ConfidentialTermCreate
)
from app.auth import get_current_user, require_role

router = APIRouter(tags=["Claim Ledger & Confidential Terms"])

def serialize_claim(claim: ClaimLedger) -> dict:
    now = datetime.now(timezone.utc)
    valid_until = claim.valid_until
    if valid_until.tzinfo is None:
        valid_until = valid_until.replace(tzinfo=timezone.utc)

    days_left = (valid_until - now).days
    if valid_until < now:
        status_val = "expired"
    elif days_left <= 30:
        status_val = "expires_soon"
    else:
        status_val = "verified"

    return {
        "id": claim.id,
        "claim_text": claim.claim_text,
        "source": claim.source,
        "owner": claim.owner,
        "valid_until": claim.valid_until,
        "status": status_val,
        "days_until_expiry": days_left,
        "created_at": claim.created_at
    }

@router.get("/ledger", response_model=List[ClaimLedgerRead])
def list_claim_ledger(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_org = current_user.org_id or "org_novafest"
    claims = db.query(ClaimLedger).filter(ClaimLedger.org_id == target_org).all()
    if not claims and target_org != "org_novafest":
        claims = db.query(ClaimLedger).filter(ClaimLedger.org_id == "org_novafest").all()
    return [serialize_claim(c) for c in claims]

@router.post("/ledger", response_model=ClaimLedgerRead, status_code=status.HTTP_201_CREATED)
def add_claim_entry(
    claim_in: ClaimLedgerCreate,
    current_user: User = Depends(require_role(["owner"])),
    db: Session = Depends(get_db)
):
    target_org = current_user.org_id or "org_novafest"
    existing = db.query(ClaimLedger).filter(ClaimLedger.id == claim_in.id, ClaimLedger.org_id == target_org).first()
    if existing:
        raise HTTPException(status_code=400, detail="Claim ID already exists in this organization")

    claim = ClaimLedger(
        id=claim_in.id,
        org_id=target_org,
        claim_text=claim_in.claim_text,
        source=claim_in.source,
        owner=claim_in.owner,
        valid_until=claim_in.valid_until
    )
    db.add(claim)
    db.commit()
    db.refresh(claim)
    return serialize_claim(claim)

@router.get("/confidential-terms", response_model=List[ConfidentialTermRead])
def list_confidential_terms(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_org = current_user.org_id or "org_novafest"
    terms = db.query(ConfidentialTerm).filter(ConfidentialTerm.org_id == target_org).all()
    if not terms and target_org != "org_novafest":
        terms = db.query(ConfidentialTerm).filter(ConfidentialTerm.org_id == "org_novafest").all()
    return terms

@router.post("/confidential-terms", response_model=ConfidentialTermRead, status_code=status.HTTP_201_CREATED)
def add_confidential_term(
    term_in: ConfidentialTermCreate,
    current_user: User = Depends(require_role(["owner"])),
    db: Session = Depends(get_db)
):
    import uuid
    target_org = current_user.org_id or "org_novafest"
    new_term = ConfidentialTerm(
        id=f"ct_{uuid.uuid4().hex[:8]}",
        term=term_in.term,
        replacement_hint=term_in.replacement_hint or "CONFIDENTIAL",
        org_id=target_org
    )
    db.add(new_term)
    db.commit()
    db.refresh(new_term)
    return new_term
