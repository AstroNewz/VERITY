from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# Auth Schemas
class DemoLoginRequest(BaseModel):
    role: str = Field(..., description="Role: creator, reviewer, or owner")
    session_id: Optional[str] = Field(None, description="Client session ID for isolated multi-tenant demo sandbox")

class UserRead(BaseModel):
    id: str
    name: str
    email: str
    role: str
    org_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead

# Rule Schemas
class RuleRead(BaseModel):
    id: str
    type: str
    title: str
    description: str
    severity: str
    source_ref: str
    owner: str
    active: bool
    version: str
    examples_allowed: List[str]
    examples_banned: List[str]
    created_at: datetime

    class Config:
        from_attributes = True

class RuleCreate(BaseModel):
    id: str
    type: str
    title: str
    description: str
    severity: str = "warning"
    source_ref: str
    owner: str = "Brand Governance Council"
    examples_allowed: List[str] = []
    examples_banned: List[str] = []

class RuleUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = None
    source_ref: Optional[str] = None
    owner: Optional[str] = None
    active: Optional[bool] = None
    examples_allowed: Optional[List[str]] = None
    examples_banned: Optional[List[str]] = None

# Claim Ledger Schemas
class ClaimLedgerRead(BaseModel):
    id: str
    claim_text: str
    source: str
    owner: str
    valid_until: datetime
    status: str  # verified | expires_soon | expired
    days_until_expiry: int
    created_at: datetime

    class Config:
        from_attributes = True

class ClaimLedgerCreate(BaseModel):
    id: str
    claim_text: str
    source: str
    owner: str
    valid_until: datetime

# Confidential Terms
class ConfidentialTermRead(BaseModel):
    id: str
    term: str
    replacement_hint: str
    created_at: datetime

    class Config:
        from_attributes = True

class ConfidentialTermCreate(BaseModel):
    term: str
    replacement_hint: Optional[str] = "CONFIDENTIAL"

# Intent Lock
class IntentLockModel(BaseModel):
    goal: str = ""
    audience: str = ""
    key_message: str = ""
    tone: str = ""
    must_keep_phrases: List[str] = []
    call_to_action: str = ""
    status: str = "locked"  # locked | at_risk
    reason: Optional[str] = None

# Findings
class FindingRead(BaseModel):
    id: str
    submission_id: str
    rule_id: Optional[str] = None
    type: str
    severity: str
    span_start: int
    span_end: int
    quote: str
    message: str
    source_cited: str
    suggestion: str
    confidence: float
    origin: str
    decision: Optional[str] = None
    decided_by: Optional[str] = None
    decided_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class FindingDecisionUpdate(BaseModel):
    decision: str = Field(..., description="'accept' or 'reject'")

# Comments
class CommentRead(BaseModel):
    id: str
    submission_id: str
    user_id: str
    user_name: Optional[str] = None
    text: str
    created_at: datetime

    class Config:
        from_attributes = True

class CommentCreate(BaseModel):
    text: str

# Passports
class PassportRead(BaseModel):
    id: str
    submission_id: str
    content_hash: str
    rules_version: str
    approver_id: str
    approver_name: Optional[str] = None
    ai_used: bool
    ai_model: str
    redactions_count: int
    summary_json: Dict[str, Any]
    issued_at: datetime

    class Config:
        from_attributes = True

# Submissions
class SubmissionCreate(BaseModel):
    title: str = "Untitled Draft"
    original_text: str
    input_type: str = "text"

class SubmissionRead(BaseModel):
    id: str
    creator_id: str
    creator_name: Optional[str] = None
    title: str
    original_text: str
    revised_text: str
    input_type: str
    intent: Optional[IntentLockModel] = None
    status: str
    findings: List[FindingRead] = []
    comments: List[CommentRead] = []
    passport: Optional[PassportRead] = None
    ai_status: Optional[str] = "offline_fallback"
    ai_model: Optional[str] = None
    ai_notice: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SubmissionReviseRequest(BaseModel):
    revised_text: Optional[str] = None

class SubmissionReviewRequest(BaseModel):
    action: str = Field(..., description="'approve' or 'changes'")
    comment: Optional[str] = None

class PassportVerifyResponse(BaseModel):
    is_valid: bool
    status: str  # VALID or TAMPERED
    tamper_reason: Optional[str] = None
    computed_hash: str
    stored_hash: str
    passport: Optional[PassportRead] = None
    submission_title: Optional[str] = None
    submission_text: Optional[str] = None
    rules_version: Optional[str] = None
    approver: Optional[str] = None
    issued_at: Optional[datetime] = None

# Health Radar & Insights
class HealthRadarItem(BaseModel):
    rule_id: str
    title: str
    type: str
    reject_rate: float
    total_decisions: int
    is_unclear: bool
    clarified_clause: Optional[str] = None
    example_allowed: Optional[str] = None
    example_banned: Optional[str] = None

class InsightsResponse(BaseModel):
    total_submissions: int
    total_approved: int
    total_findings_caught: int
    avg_approval_time_hours: float
    repeated_mistakes: List[Dict[str, Any]]
    most_overridden_rules: List[Dict[str, Any]]
    findings_by_type: Dict[str, int]
    drift_by_category: List[Dict[str, Any]]

class AIUsageLogRead(BaseModel):
    id: str
    submission_id: Optional[str]
    model: str
    purpose: str
    redactions_count: int
    created_at: datetime

    class Config:
        from_attributes = True
