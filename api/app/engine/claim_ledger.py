import re
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models import ClaimLedger

def utcnow():
    return datetime.now(timezone.utc)

CLAIM_PATTERNS = [
    # 1. Rankings & Superlatives: e.g. "#1 student fest in India", "largest fest"
    (r'(#\d+\s+[^.,!\n]+|top\s+\d+\s+[^.,!\n]+|largest\s+[^.,!\n]+|biggest\s+[^.,!\n]+|best\s+[^.,!\n]+)', "ranking_superlative"),
    # 2. Specific Counts / Attendees: e.g. "10,000 attendees", "5,000 participants"
    (r'(\b\d{1,3}(?:,\d{3})*(?:\+)?\s+(?:attendees|students|visitors|participants|tickets|passes|delegates)\b)', "count_statistic"),
    # 3. Percentages: e.g. "99% satisfaction", "50% discount"
    (r'(\b\d+(?:\.\d+)?%\s+[^.,!\n]+)', "percentage_claim"),
    # 4. Free claims: e.g. "free entry for students", "free admission"
    (r'(free\s+(?:entry|admission|access|passes|tickets)(?:\s+for\s+[^.,!\n]+)?)', "free_pricing")
]

def find_best_ledger_match(phrase: str, ledger_entries: List[ClaimLedger]) -> Optional[ClaimLedger]:
    phrase_lower = phrase.lower().strip()
    
    # Exact or substring containment
    for entry in ledger_entries:
        entry_text = entry.claim_text.lower().strip()
        if entry_text in phrase_lower or phrase_lower in entry_text:
            return entry
            
    # Word token overlap match
    phrase_tokens = set(re.findall(r'\w+', phrase_lower))
    best_entry = None
    best_overlap = 0
    for entry in ledger_entries:
        entry_tokens = set(re.findall(r'\w+', entry.claim_text.lower()))
        overlap = len(phrase_tokens & entry_tokens)
        if overlap >= 2 and overlap > best_overlap:
            best_overlap = overlap
            best_entry = entry

    return best_entry

def check_claim_ledger(text: str, db: Session) -> List[Dict[str, Any]]:
    findings = []
    now = utcnow()
    ledger_entries = db.query(ClaimLedger).all()

    # Find claim candidates in text
    spans_evaluated = []
    
    for pattern, claim_type in CLAIM_PATTERNS:
        for match in re.finditer(pattern, text, re.IGNORECASE):
            start, end = match.start(), match.end()
            # Avoid duplicate overlapping captures
            if any(s <= start and end <= e for s, e in spans_evaluated):
                continue
            spans_evaluated.append((start, end))

            quote = match.group().strip()
            matched_ledger = find_best_ledger_match(quote, ledger_entries)

            if matched_ledger:
                valid_until = matched_ledger.valid_until
                if valid_until.tzinfo is None:
                    valid_until = valid_until.replace(tzinfo=timezone.utc)

                expiry_str = valid_until.strftime("%Y-%m-%d")
                days_left = (valid_until - now).days

                if valid_until < now:
                    # Outcome: EXPIRED
                    findings.append({
                        "rule_id": "C-1",
                        "type": "claim",
                        "severity": "critical",
                        "span_start": start,
                        "span_end": end,
                        "quote": quote,
                        "message": f"Claim cites EXPIRED ledger record ({matched_ledger.id} expired on {expiry_str}). Public statistics must be based on valid, current evidence.",
                        "source_cited": f"Claim Ledger {matched_ledger.id} | Source: {matched_ledger.source} | Owner: {matched_ledger.owner} | Expired: {expiry_str}",
                        "suggestion": f"Renew substantiation for {matched_ledger.id} or rephrase without the expired statistic",
                        "confidence": 0.96,
                        "origin": "deterministic"
                    })
                elif days_left <= 30:
                    # Outcome: EXPIRES SOON
                    findings.append({
                        "rule_id": "C-1",
                        "type": "claim",
                        "severity": "warning",
                        "span_start": start,
                        "span_end": end,
                        "quote": quote,
                        "message": f"Claim is verified under Ledger {matched_ledger.id}, but EXPIRES IN {days_left} DAYS ({expiry_str}). Verify continuity with {matched_ledger.owner}.",
                        "source_cited": f"Claim Ledger {matched_ledger.id} | Source: {matched_ledger.source} | Owner: {matched_ledger.owner} | Valid Until: {expiry_str}",
                        "suggestion": quote,
                        "confidence": 0.95,
                        "origin": "deterministic"
                    })
                else:
                    # Outcome: VERIFIED
                    findings.append({
                        "rule_id": "C-1",
                        "type": "claim",
                        "severity": "info",
                        "span_start": start,
                        "span_end": end,
                        "quote": quote,
                        "message": f"VERIFIED: Substantiated by approved Claim Ledger entry {matched_ledger.id}.",
                        "source_cited": f"Claim Ledger {matched_ledger.id} | Source: {matched_ledger.source} | Owner: {matched_ledger.owner} | Valid Until: {expiry_str}",
                        "suggestion": quote,
                        "confidence": 0.99,
                        "origin": "deterministic"
                    })
            else:
                # Outcome: UNSUPPORTED
                findings.append({
                    "rule_id": "C-1",
                    "type": "claim",
                    "severity": "critical",
                    "span_start": start,
                    "span_end": end,
                    "quote": quote,
                    "message": f"UNSUPPORTED CLAIM: '{quote}' is not documented in the approved Claim Ledger.",
                    "source_cited": "Rule C-1: University Public Communications Governance Code, Clause 14",
                    "suggestion": "Submit claim documentation to Brand Owner for ledger entry or remove claim",
                    "confidence": 0.92,
                    "origin": "deterministic"
                })

    return findings
