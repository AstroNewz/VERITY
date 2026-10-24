import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Rule, User
from app.schemas import RuleRead, RuleCreate, RuleUpdate
from app.auth import get_current_user, require_role

router = APIRouter(prefix="/rules", tags=["Brand Constitution Rules"])

def serialize_rule(r: Rule) -> dict:
    try:
        allowed = json.loads(r.examples_allowed) if r.examples_allowed else []
    except Exception:
        allowed = []
    try:
        banned = json.loads(r.examples_banned) if r.examples_banned else []
    except Exception:
        banned = []
    return {
        "id": r.id,
        "type": r.type,
        "title": r.title,
        "description": r.description,
        "severity": r.severity,
        "source_ref": r.source_ref,
        "owner": r.owner,
        "active": r.active,
        "version": r.version,
        "examples_allowed": allowed,
        "examples_banned": banned,
        "created_at": r.created_at
    }

@router.get("", response_model=List[RuleRead])
def list_rules(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_org = current_user.org_id or "org_novafest"
    rules = db.query(Rule).filter(Rule.org_id == target_org).all()
    if not rules and target_org != "org_novafest":
        rules = db.query(Rule).filter(Rule.org_id == "org_novafest").all()
    return [serialize_rule(r) for r in rules]

@router.get("/{id}", response_model=RuleRead)
def get_rule(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_org = current_user.org_id or "org_novafest"
    rule = db.query(Rule).filter(Rule.id == id, Rule.org_id == target_org).first()
    if not rule and target_org != "org_novafest":
        rule = db.query(Rule).filter(Rule.id == id, Rule.org_id == "org_novafest").first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    return serialize_rule(rule)

@router.post("", response_model=RuleRead, status_code=status.HTTP_201_CREATED)
def create_rule(
    rule_in: RuleCreate,
    current_user: User = Depends(require_role(["owner"])),
    db: Session = Depends(get_db)
):
    target_org = current_user.org_id or "org_novafest"
    existing = db.query(Rule).filter(Rule.id == rule_in.id, Rule.org_id == target_org).first()
    if existing:
        raise HTTPException(status_code=400, detail="Rule with this ID already exists in this organization")

    rule = Rule(
        id=rule_in.id,
        org_id=target_org,
        type=rule_in.type,
        title=rule_in.title,
        description=rule_in.description,
        severity=rule_in.severity,
        source_ref=rule_in.source_ref,
        owner=rule_in.owner,
        active=True,
        version="1.0",
        examples_allowed=json.dumps(rule_in.examples_allowed),
        examples_banned=json.dumps(rule_in.examples_banned)
    )
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return serialize_rule(rule)

@router.patch("/{id}", response_model=RuleRead)
def update_rule(
    id: str,
    rule_in: RuleUpdate,
    current_user: User = Depends(require_role(["owner"])),
    db: Session = Depends(get_db)
):
    rule = db.query(Rule).filter(Rule.id == id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")

    if rule_in.title is not None:
        rule.title = rule_in.title
    if rule_in.description is not None:
        rule.description = rule_in.description
    if rule_in.severity is not None:
        rule.severity = rule_in.severity
    if rule_in.source_ref is not None:
        rule.source_ref = rule_in.source_ref
    if rule_in.owner is not None:
        rule.owner = rule_in.owner
    if rule_in.active is not None:
        rule.active = rule_in.active
    if rule_in.examples_allowed is not None:
        rule.examples_allowed = json.dumps(rule_in.examples_allowed)
    if rule_in.examples_banned is not None:
        rule.examples_banned = json.dumps(rule_in.examples_banned)

    db.commit()
    db.refresh(rule)
    return serialize_rule(rule)
