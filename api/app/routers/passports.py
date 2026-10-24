import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Passport
from app.schemas import PassportRead, PassportVerifyResponse
from app.engine.passport import verify_passport_integrity

router = APIRouter(prefix="/passports", tags=["Publish Passports & Verification"])

@router.get("/{id}", response_model=PassportRead)
def get_passport(id: str, db: Session = Depends(get_db)):
    passport = db.query(Passport).filter(Passport.id == id).first()
    if not passport:
        raise HTTPException(status_code=404, detail="Passport not found")
    summary = json.loads(passport.summary_json or "{}")
    return {
        "id": passport.id,
        "submission_id": passport.submission_id,
        "content_hash": passport.content_hash,
        "rules_version": passport.rules_version,
        "approver_id": passport.approver_id,
        "approver_name": passport.approver.name if hasattr(passport, 'approver') and passport.approver else None,
        "ai_used": passport.ai_used,
        "ai_model": passport.ai_model,
        "redactions_count": passport.redactions_count,
        "summary_json": summary,
        "issued_at": passport.issued_at
    }

@router.get("/{id}/verify", response_model=PassportVerifyResponse)
def verify_passport(id: str, db: Session = Depends(get_db)):
    is_valid, reason, details = verify_passport_integrity(id, db)
    if not details:
        raise HTTPException(status_code=404, detail="Passport not found or invalid ID")

    passport_obj = db.query(Passport).filter(Passport.id == id).first()
    passport_read = None
    if passport_obj:
        passport_read = {
            "id": passport_obj.id,
            "submission_id": passport_obj.submission_id,
            "content_hash": passport_obj.content_hash,
            "rules_version": passport_obj.rules_version,
            "approver_id": passport_obj.approver_id,
            "approver_name": passport_obj.approver.name if hasattr(passport_obj, 'approver') and passport_obj.approver else None,
            "ai_used": passport_obj.ai_used,
            "ai_model": passport_obj.ai_model,
            "redactions_count": passport_obj.redactions_count,
            "summary_json": details.get("summary", {}),
            "issued_at": passport_obj.issued_at
        }

    return {
        "is_valid": is_valid,
        "status": "VALID" if is_valid else "TAMPERED",
        "tamper_reason": None if is_valid else reason,
        "computed_hash": details.get("recomputed_hash", ""),
        "stored_hash": details.get("stored_hash", ""),
        "passport": passport_read,
        "submission_title": details.get("submission_title", ""),
        "submission_text": details.get("final_text", ""),
        "rules_version": details.get("rules_version", "1.0"),
        "approver": details.get("approver_id", ""),
        "issued_at": details.get("issued_at")
    }
