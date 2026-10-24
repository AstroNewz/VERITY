import json
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Text, Boolean, Integer, Float, DateTime, ForeignKey, Index
)
from sqlalchemy.orm import relationship
from app.database import Base

def utcnow():
    return datetime.now(timezone.utc)

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String(64), primary_key=True)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    users = relationship("User", back_populates="organization")

class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    role = Column(String(32), nullable=False)  # creator | reviewer | owner
    org_id = Column(String(64), ForeignKey("organizations.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    organization = relationship("Organization", back_populates="users")
    submissions = relationship("Submission", back_populates="creator")

class Rule(Base):
    __tablename__ = "rules"

    id = Column(String(32), primary_key=True)  # T-1, V-1, A-1, C-1, P-1
    type = Column(String(64), nullable=False)  # terminology | voice | accessibility | claims | privacy
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(32), default="warning")  # critical | warning | info
    source_ref = Column(String(255), nullable=False)  # e.g. "Nova Fest Brand Book 2026, Section 2"
    owner = Column(String(255), default="Brand Governance Council")
    active = Column(Boolean, default=True)
    version = Column(String(32), default="1.0")
    examples_allowed = Column(Text, default="[]")  # JSON string list
    examples_banned = Column(Text, default="[]")   # JSON string list
    created_at = Column(DateTime(timezone=True), default=utcnow)

    versions = relationship("RuleVersion", back_populates="rule", cascade="all, delete-orphan")

class RuleVersion(Base):
    __tablename__ = "rule_versions"

    id = Column(String(64), primary_key=True)
    rule_id = Column(String(32), ForeignKey("rules.id"), nullable=False)
    version = Column(String(32), nullable=False)
    clause_diff = Column(Text, nullable=False)
    approved_by = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    rule = relationship("Rule", back_populates="versions")

class ClaimLedger(Base):
    __tablename__ = "claims_ledger"

    id = Column(String(32), primary_key=True)  # F-1, F-2, F-3
    claim_text = Column(Text, nullable=False)
    source = Column(String(255), nullable=False)  # e.g. "Registrar Audit Report 2026"
    owner = Column(String(255), nullable=False)   # e.g. "Festival Operations"
    valid_until = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)

class ConfidentialTerm(Base):
    __tablename__ = "confidential_terms"

    id = Column(String(64), primary_key=True)
    term = Column(String(255), nullable=False)
    replacement_hint = Column(String(255), default="CONFIDENTIAL")
    org_id = Column(String(64), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(String(64), primary_key=True)
    creator_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), default="Untitled Draft")
    original_text = Column(Text, nullable=False)
    revised_text = Column(Text, default="")
    input_type = Column(String(32), default="text")  # text | docx | pptx | pdf | image
    intent_json = Column(Text, default="{}")        # JSON string of intent
    status = Column(String(32), default="draft")    # draft | analyzed | pending_approval | approved | changes_requested
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    creator = relationship("User", back_populates="submissions")
    findings = relationship("Finding", back_populates="submission", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="submission", cascade="all, delete-orphan")
    passport = relationship("Passport", back_populates="submission", uselist=False)

class Finding(Base):
    __tablename__ = "findings"

    id = Column(String(64), primary_key=True)
    submission_id = Column(String(64), ForeignKey("submissions.id"), nullable=False)
    rule_id = Column(String(32), nullable=True)
    type = Column(String(64), nullable=False)       # terminology | confidential | tone | accessibility | claim | voice
    severity = Column(String(32), default="warning") # critical | warning | info
    span_start = Column(Integer, default=0)
    span_end = Column(Integer, default=0)
    quote = Column(Text, nullable=False)
    message = Column(Text, nullable=False)
    source_cited = Column(Text, nullable=False)     # e.g. "Rule T-1 (Nova Fest Brand Book)" or "Ledger F-1 (Registrar)"
    suggestion = Column(Text, nullable=False)
    confidence = Column(Float, default=1.0)
    origin = Column(String(32), default="deterministic") # deterministic | ai
    decision = Column(String(32), nullable=True)    # accept | reject | None
    decided_by = Column(String(64), nullable=True)
    decided_at = Column(DateTime(timezone=True), nullable=True)

    submission = relationship("Submission", back_populates="findings")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(String(64), primary_key=True)
    submission_id = Column(String(64), ForeignKey("submissions.id"), nullable=False)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    submission = relationship("Submission", back_populates="comments")

class Passport(Base):
    __tablename__ = "passports"

    id = Column(String(64), primary_key=True)
    submission_id = Column(String(64), ForeignKey("submissions.id"), unique=True, nullable=False)
    content_hash = Column(String(64), nullable=False)  # SHA-256
    rules_version = Column(String(32), default="1.0")
    approver_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    ai_used = Column(Boolean, default=False)
    ai_model = Column(String(64), default="none")
    redactions_count = Column(Integer, default=0)
    summary_json = Column(Text, default="{}")
    issued_at = Column(DateTime(timezone=True), default=utcnow)

    submission = relationship("Submission", back_populates="passport")

class AIUsageLog(Base):
    __tablename__ = "ai_usage_log"

    id = Column(String(64), primary_key=True)
    submission_id = Column(String(64), nullable=True)
    model = Column(String(64), nullable=False)
    purpose = Column(String(128), nullable=False)
    redactions_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=utcnow)
