import re
from typing import Tuple, Dict, List
from sqlalchemy.orm import Session
from app.models import ConfidentialTerm

def redact_sensitive_content(text: str, db: Session) -> Tuple[str, Dict[str, str], int]:
    """
    Sanitizes user content prior to external LLM dispatch.
    Redacts:
    1. Confidential terms from database
    2. Email addresses
    3. Phone numbers
    Returns: (sanitized_text, token_map, total_redactions)
    """
    token_map: Dict[str, str] = {}
    redaction_counter = 1
    sanitized = text

    # 1. Confidential project terms
    conf_terms = db.query(ConfidentialTerm).all()
    for ct in conf_terms:
        pattern = re.compile(re.escape(ct.term), re.IGNORECASE)
        matches = list(pattern.finditer(sanitized))
        for m in reversed(matches):
            token = f"[REDACTED-CONFIDENTIAL-{redaction_counter}]"
            token_map[token] = m.group()
            sanitized = sanitized[:m.start()] + token + sanitized[m.end():]
            redaction_counter += 1

    # 2. Email addresses
    email_pattern = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b')
    for m in reversed(list(email_pattern.finditer(sanitized))):
        token = f"[REDACTED-EMAIL-{redaction_counter}]"
        token_map[token] = m.group()
        sanitized = sanitized[:m.start()] + token + sanitized[m.end():]
        redaction_counter += 1

    # 3. Phone numbers (e.g. +91 9876543210, 123-456-7890)
    phone_pattern = re.compile(r'\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b')
    for m in reversed(list(phone_pattern.finditer(sanitized))):
        token = f"[REDACTED-PHONE-{redaction_counter}]"
        token_map[token] = m.group()
        sanitized = sanitized[:m.start()] + token + sanitized[m.end():]
        redaction_counter += 1

    total_redactions = len(token_map)
    return sanitized, token_map, total_redactions

def restore_tokens(text: str, token_map: Dict[str, str]) -> str:
    """
    Reconstructs original tokens inside Claude suggestions or responses.
    """
    restored = text
    for token, original in token_map.items():
        restored = restored.replace(token, original)
    return restored
