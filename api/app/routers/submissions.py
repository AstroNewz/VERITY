import json
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import (
    Submission, Finding, Comment, User, AIUsageLog
)
from app.schemas import (
    SubmissionCreate, SubmissionRead, SubmissionReviseRequest,
    SubmissionReviewRequest, FindingRead, FindingDecisionUpdate,
    CommentRead, CommentCreate, IntentLockModel
)
from app.auth import get_current_user, require_role
from app.engine.deterministic import run_deterministic_checks
from app.engine.claim_ledger import check_claim_ledger
from app.engine.intent_lock import extract_deterministic_intent, validate_rewrite_intent
from app.engine.privacy_gateway import redact_sensitive_content
from app.engine.groq_reviewer import review_with_groq
from app.engine.passport import create_publish_passport
from app.engine.document_parser import parse_uploaded_file
from app.engine.asset_vision import analyze_graphic_asset, create_sample_brand_poster

router = APIRouter(prefix="/submissions", tags=["Submissions & Workflow"])

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB
ALLOWED_UPLOAD_EXTS = {"txt", "md", "docx", "pptx", "pdf"}

def serialize_submission(sub: Submission) -> dict:
    intent_data = None
    if sub.intent_json:
        try:
            intent_dict = json.loads(sub.intent_json)
            intent_data = IntentLockModel(**intent_dict)
        except Exception:
            intent_data = None

    passport_data = None
    if sub.passport:
        p = sub.passport
        summary = json.loads(p.summary_json or "{}")
        passport_data = {
            "id": p.id,
            "submission_id": p.submission_id,
            "content_hash": p.content_hash,
            "rules_version": p.rules_version,
            "approver_id": p.approver_id,
            "approver_name": p.approver.name if hasattr(p, 'approver') and p.approver else None,
            "ai_used": p.ai_used,
            "ai_model": p.ai_model,
            "redactions_count": p.redactions_count,
            "summary_json": summary,
            "issued_at": p.issued_at
        }

    findings_data = []
    for f in sub.findings or []:
        findings_data.append({
            "id": f.id,
            "submission_id": f.submission_id,
            "rule_id": f.rule_id,
            "type": f.type,
            "severity": f.severity,
            "span_start": f.span_start,
            "span_end": f.span_end,
            "quote": f.quote,
            "message": f.message,
            "source_cited": f.source_cited,
            "suggestion": f.suggestion,
            "confidence": f.confidence,
            "origin": f.origin,
            "decision": f.decision,
            "decided_by": f.decided_by,
            "decided_at": f.decided_at
        })

    comments_data = []
    for c in sub.comments or []:
        comments_data.append({
            "id": c.id,
            "submission_id": c.submission_id,
            "user_id": c.user_id,
            "user_name": None,
            "text": c.text,
            "created_at": c.created_at
        })

    return {
        "id": sub.id,
        "creator_id": sub.creator_id,
        "creator_name": sub.creator.name if sub.creator else None,
        "title": sub.title,
        "original_text": sub.original_text,
        "revised_text": sub.revised_text or sub.original_text,
        "input_type": sub.input_type,
        "intent": intent_data,
        "status": sub.status,
        "findings": findings_data,
        "comments": comments_data,
        "passport": passport_data,
        "ai_status": getattr(sub, "ai_status", "offline_fallback") or "offline_fallback",
        "ai_model": getattr(sub, "ai_model", None),
        "ai_notice": getattr(sub, "ai_notice", None),
        "created_at": sub.created_at,
        "updated_at": sub.updated_at
    }

@router.post("", response_model=SubmissionRead, status_code=status.HTTP_201_CREATED)
def create_submission(
    sub_in: SubmissionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    intent_model = extract_deterministic_intent(sub_in.original_text)
    sub = Submission(
        id=f"sub_{uuid.uuid4().hex[:10]}",
        creator_id=current_user.id,
        org_id=current_user.org_id or "org_novafest",
        title=sub_in.title or "Untitled Draft",
        original_text=sub_in.original_text,
        revised_text=sub_in.original_text,
        input_type=sub_in.input_type or "text",
        intent_json=intent_model.model_dump_json(),
        status="draft",
        ai_status="offline_fallback"
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return serialize_submission(sub)

@router.post("/upload", response_model=SubmissionRead, status_code=status.HTTP_201_CREATED)
async def upload_submission_file(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    filename = file.filename or "upload.txt"
    ext = filename.lower().split(".")[-1] if "." in filename else "txt"
    if ext not in ALLOWED_UPLOAD_EXTS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type .{ext}. Allowed formats: {', '.join(sorted(ALLOWED_UPLOAD_EXTS))}"
        )

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds the 10 MB limit."
        )

    extracted_text, detected_type = parse_uploaded_file(filename, contents)
    doc_title = title or (filename.rsplit(".", 1)[0] if "." in filename else "Uploaded Document")
    intent_model = extract_deterministic_intent(extracted_text)
    sub = Submission(
        id=f"sub_{uuid.uuid4().hex[:10]}",
        creator_id=current_user.id,
        org_id=current_user.org_id or "org_novafest",
        title=doc_title,
        original_text=extracted_text,
        revised_text=extracted_text,
        input_type=detected_type,
        intent_json=intent_model.model_dump_json(),
        status="draft",
        ai_status="offline_fallback"
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return serialize_submission(sub)

@router.get("/approvals", response_model=List[SubmissionRead])
def list_approvals_queue(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Returns submissions for caller's organization
    target_org = current_user.org_id or "org_novafest"
    subs = db.query(Submission).filter(Submission.org_id == target_org).order_by(Submission.created_at.desc()).all()
    return [serialize_submission(s) for s in subs]

@router.get("/{id}", response_model=SubmissionRead)
def get_submission(id: str, db: Session = Depends(get_db)):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
    return serialize_submission(sub)

@router.post("/{id}/analyze", response_model=SubmissionRead)
def analyze_submission(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.config import settings
    sub = db.query(Submission).filter(Submission.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")

    text = sub.original_text
    org_id = current_user.org_id or "org_novafest"

    # 1. Deterministic Checks (Terminology, Confidential, Tone, Accessibility) on RAW text
    findings_raw = run_deterministic_checks(text, db, org_id=org_id)

    # 2. Claim Ledger Checks (Verified, Expired, Unsupported) on RAW text
    claim_findings = check_claim_ledger(text, db, org_id=org_id)
    findings_raw.extend(claim_findings)

    # 3. Privacy Gateway Sanitization (sits ONLY in front of external LLM / Groq calls)
    sanitized_text, token_map, redactions_count = redact_sensitive_content(text, db, org_id=org_id)

    # 4. Check Global AI Daily Cap
    now_utc = datetime.now(timezone.utc)
    today_start = datetime(now_utc.year, now_utc.month, now_utc.day, tzinfo=timezone.utc)
    today_ai_calls = db.query(AIUsageLog).filter(
        AIUsageLog.created_at >= today_start,
        AIUsageLog.model != "none",
        AIUsageLog.model != "offline_fallback"
    ).count()

    ai_findings = []
    ai_used = False
    ai_model = settings.GROQ_MODEL
    ai_status = "offline_fallback"
    ai_notice = None

    if today_ai_calls >= settings.AI_DAILY_CAP:
        ai_status = "daily_cap_exceeded"
        ai_notice = "AI review paused for today (Daily Cap Exceeded). Running deterministic checks."
    else:
        # 5. Groq AI Brand Voice Review
        ai_findings, ai_used, ai_model = review_with_groq(sanitized_text, text, token_map)
        findings_raw.extend(ai_findings)
        if ai_used:
            ai_status = "active"
            ai_notice = None
        else:
            ai_status = "offline_fallback"
            ai_notice = "AI review paused: No Groq API key configured. Deterministic rules & Claim Ledger are active."

    # 6. Log AI usage and Privacy redactions
    if ai_used or redactions_count > 0:
        log_entry = AIUsageLog(
            id=f"ai_{uuid.uuid4().hex[:8]}",
            submission_id=sub.id,
            model=ai_model if ai_used else "none",
            purpose="Brand Voice Review & Privacy Gateway Sanitization",
            redactions_count=redactions_count
        )
        db.add(log_entry)

    # 7. Clear previous findings & save new ones
    db.query(Finding).filter(Finding.submission_id == sub.id).delete()
    db.commit()

    # De-duplicate findings by span_start and quote
    seen_keys = set()
    for item in findings_raw:
        key = (item["span_start"], item["quote"], item["rule_id"])
        if key in seen_keys:
            continue
        seen_keys.add(key)

        finding = Finding(
            id=f"fnd_{uuid.uuid4().hex[:8]}",
            submission_id=sub.id,
            rule_id=item.get("rule_id"),
            type=item["type"],
            severity=item.get("severity", "warning"),
            span_start=item.get("span_start", 0),
            span_end=item.get("span_end", 0),
            quote=item["quote"],
            message=item["message"],
            source_cited=item["source_cited"],
            suggestion=item["suggestion"],
            confidence=item.get("confidence", 1.0),
            origin=item.get("origin", "deterministic"),
            match_type=item.get("match_type"),
            match_score=item.get("match_score"),
            decision=None
        )
        db.add(finding)

    # Update submission status and AI telemetry
    sub.status = "analyzed"
    sub.ai_status = ai_status
    sub.ai_model = ai_model if ai_used else None
    sub.ai_notice = ai_notice
    db.commit()
    db.refresh(sub)
    return serialize_submission(sub)

@router.patch("/findings/{finding_id}", response_model=FindingRead)
def update_finding_decision(
    finding_id: str,
    update_in: FindingDecisionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    finding = db.query(Finding).filter(Finding.id == finding_id).first()
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

@router.post("/{id}/revise", response_model=SubmissionRead)
def revise_submission(
    id: str,
    req: SubmissionReviseRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")

    if req.revised_text and req.revised_text.strip():
        new_text = req.revised_text.strip()
    else:
        # Automatically apply accepted fixes
        revised = sub.original_text
        accepted_findings = db.query(Finding).filter(
            Finding.submission_id == sub.id,
            Finding.decision == "accept"
        ).order_by(Finding.span_start.desc()).all()

        for f in accepted_findings:
            if f.quote in revised:
                revised = revised.replace(f.quote, f.suggestion, 1)
        new_text = revised

    sub.revised_text = new_text

    # Re-verify Intent Lock
    intent_data = None
    if sub.intent_json:
        try:
            intent_dict = json.loads(sub.intent_json)
            intent_model = IntentLockModel(**intent_dict)
            is_preserved, reason = validate_rewrite_intent(sub.original_text, new_text, intent_model)
            intent_model.status = "locked" if is_preserved else "at_risk"
            intent_model.reason = reason
            sub.intent_json = intent_model.model_dump_json()
        except Exception:
            pass

    db.commit()
    db.refresh(sub)
    return serialize_submission(sub)

@router.post("/{id}/submit", response_model=SubmissionRead)
def submit_for_approval(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")

    sub.status = "pending_approval"
    db.commit()
    db.refresh(sub)
    return serialize_submission(sub)

@router.post("/{id}/review", response_model=SubmissionRead)
def review_submission(
    id: str,
    req: SubmissionReviewRequest,
    current_user: User = Depends(require_role(["reviewer", "owner"])),
    db: Session = Depends(get_db)
):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")

    action = req.action.lower().strip()
    if action == "approve":
        sub.status = "approved"
        # Issue Publish Passport with SHA-256 seal
        create_publish_passport(
            submission=sub,
            approver=current_user,
            ai_used=any(f.origin == "ai" for f in (sub.findings or [])),
            ai_model=sub.ai_model or settings.GROQ_MODEL,
            redactions_count=0,
            db=db
        )
    elif action == "changes":
        sub.status = "changes_requested"
    else:
        raise HTTPException(status_code=400, detail="Action must be 'approve' or 'changes'")

    if req.comment:
        comment = Comment(
            id=f"cmt_{uuid.uuid4().hex[:8]}",
            submission_id=sub.id,
            user_id=current_user.id,
            text=req.comment
        )
        db.add(comment)

    db.commit()
    db.refresh(sub)
    return serialize_submission(sub)

@router.post("/{id}/comments", response_model=CommentRead, status_code=status.HTTP_201_CREATED)
def add_comment(
    id: str,
    comment_in: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")

    cmt = Comment(
        id=f"cmt_{uuid.uuid4().hex[:8]}",
        submission_id=sub.id,
        user_id=current_user.id,
        text=comment_in.text
    )
    db.add(cmt)
    db.commit()
    db.refresh(cmt)
    return {
        "id": cmt.id,
        "submission_id": cmt.submission_id,
        "user_id": cmt.user_id,
        "user_name": current_user.name,
        "text": cmt.text,
        "created_at": cmt.created_at
    }

@router.post("/inspect-asset")
async def inspect_graphic_asset(
    file: Optional[UploadFile] = File(None),
    use_sample: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user)
):
    """
    Round 3: Multimodal Computer Vision Analysis of creative posters / banner graphics.
    Evaluates color palette adherence, WCAG 2.1 contrast, safe-zone margins, and brand asset alignment.
    """
    if use_sample == "true" or file is None:
        content = create_sample_brand_poster()
        filename = "novafest_social_launch_banner.png"
    else:
        ext = file.filename.split(".")[-1].lower() if "." in file.filename else ""
        if ext not in {"png", "jpg", "jpeg", "webp", "svg"}:
            raise HTTPException(
                status_code=400,
                detail="Supported image formats: .png, .jpg, .jpeg, .webp, .svg"
            )
        content = await file.read()
        if len(content) > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=413,
                detail=f"Image file exceeds maximum {MAX_FILE_SIZE_BYTES // (1024*1024)}MB limit."
            )
        filename = file.filename

    try:
        result = analyze_graphic_asset(content, filename=filename)
        return result
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Visual asset analysis failed: {e}")

