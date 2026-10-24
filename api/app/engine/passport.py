import hashlib
import json
from datetime import datetime, timezone
from typing import Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.models import Passport, Submission, User

def compute_passport_hash(
    final_text: str,
    rules_version: str,
    approver_id: str,
    issued_at_iso: str,
    ai_used: bool,
    findings_summary: Dict[str, Any]
) -> str:
    payload = {
        "final_text": final_text.strip(),
        "rules_version": rules_version,
        "approver_id": approver_id,
        "issued_at": issued_at_iso,
        "ai_used": bool(ai_used),
        "findings_summary": findings_summary
    }
    canonical_json = json.dumps(payload, sort_keys=True, separators=(',', ':'))
    return hashlib.sha256(canonical_json.encode('utf-8')).hexdigest()

def create_publish_passport(
    submission: Submission,
    approver: User,
    ai_used: bool,
    ai_model: str,
    redactions_count: int,
    db: Session
) -> Passport:
    issued_at = datetime.now(timezone.utc)
    issued_at_iso = issued_at.strftime("%Y-%m-%dT%H:%M:%SZ")
    
    # Calculate findings summary
    findings = submission.findings or []
    summary = {
        "issued_at_iso": issued_at_iso,
        "total_findings": len(findings),
        "accepted_fixes": sum(1 for f in findings if f.decision == "accept"),
        "rejected_fixes": sum(1 for f in findings if f.decision == "reject"),
        "claims_cited": list(set(f.source_cited for f in findings if f.type == "claim")),
        "rules_cited": list(set(f.rule_id for f in findings if f.rule_id))
    }

    rules_version = "1.0"
    content_hash = compute_passport_hash(
        final_text=submission.revised_text or submission.original_text,
        rules_version=rules_version,
        approver_id=approver.id,
        issued_at_iso=issued_at_iso,
        ai_used=ai_used,
        findings_summary=summary
    )

    passport = Passport(
        id=f"pass_{submission.id[:12]}",
        submission_id=submission.id,
        content_hash=content_hash,
        rules_version=rules_version,
        approver_id=approver.id,
        ai_used=ai_used,
        ai_model=ai_model,
        redactions_count=redactions_count,
        summary_json=json.dumps(summary),
        issued_at=issued_at
    )
    db.add(passport)
    db.commit()
    db.refresh(passport)
    return passport

def verify_passport_integrity(passport_id: str, db: Session) -> Tuple[bool, str, Dict[str, Any]]:
    passport = db.query(Passport).filter(Passport.id == passport_id).first()
    if not passport:
        return False, "Passport ID does not exist in ledger.", {}

    submission = passport.submission
    if not submission:
        return False, "Linked submission not found.", {}

    summary = json.loads(passport.summary_json or "{}")
    issued_at_iso = summary.get("issued_at_iso") or (passport.issued_at.strftime("%Y-%m-%dT%H:%M:%SZ") if passport.issued_at else "")

    # Recompute hash based on live database state of final text
    current_final_text = submission.revised_text or submission.original_text
    recomputed_hash = compute_passport_hash(
        final_text=current_final_text,
        rules_version=passport.rules_version,
        approver_id=passport.approver_id,
        issued_at_iso=issued_at_iso,
        ai_used=passport.ai_used,
        findings_summary=summary
    )

    details = {
        "passport_id": passport.id,
        "submission_id": submission.id,
        "submission_title": submission.title,
        "final_text": current_final_text,
        "stored_hash": passport.content_hash,
        "recomputed_hash": recomputed_hash,
        "rules_version": passport.rules_version,
        "approver_id": passport.approver_id,
        "issued_at": passport.issued_at,
        "ai_used": passport.ai_used,
        "ai_model": passport.ai_model,
        "redactions_count": passport.redactions_count,
        "summary": summary
    }

    if recomputed_hash == passport.content_hash:
        return True, "VALID: Cryptographic integrity confirmed. Content matches approved revision.", details
    else:
        return False, "TAMPERED: Content hash mismatch! Post copy was altered after approval.", details
