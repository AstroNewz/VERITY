import re
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional, Tuple
from sqlalchemy.orm import Session
from app.models import ClaimLedger
from app.engine.semantic_embeddings import get_semantic_engine

def utcnow():
    return datetime.now(timezone.utc)

CLAIM_PATTERNS = [
    # 1. Rankings & Superlatives: e.g. "#1 student fest in India", "largest fest", "best fest", "premier"
    (r'(#\d+\s+[^.,!\n]+|top\s+\d+\s+[^.,!\n]+|largest\s+[^.,!\n]+|biggest\s+[^.,!\n]+|best\s+[^.,!\n]+|premier\s+[^.,!\n]+|foremost\s+[^.,!\n]+|leading\s+[^.,!\n]+|rated\s+[^.,!\n]+|voted\s+[^.,!\n]+)', "ranking_superlative"),
    # 2. Specific Counts / Attendees: e.g. "10,000 attendees", "5,000 participants", "over 10,000 visitors"
    (r'(\b(?:over|more than|nearly|around|up to)?\s*\d{1,3}(?:,\d{3})*(?:\+)?\s+(?:attendees|students|visitors|participants|tickets|passes|delegates|guests)\b)', "count_statistic"),
    # 3. Spelled-out Counts: e.g. "over ten thousand visitors", "thousands of attendees"
    (r'(\b(?:over|more than|nearly|around|up to)?\s*(?:ten|twenty|fifty|hundred|thousand|thousands of)\s+(?:attendees|students|visitors|participants|delegates|guests)\b)', "spelled_count"),
    # 4. Percentages: e.g. "99% satisfaction", "50% discount"
    (r'(\b\d+(?:\.\d+)?%\s+[^.,!\n]+)', "percentage_claim"),
    # 5. Free claims: e.g. "free entry for students", "free admission"
    (r'(free\s+(?:entry|admission|access|passes|tickets)(?:\s+for\s+[^.,!\n]+)?)', "free_pricing"),
    # 6. Pricing concessions & paraphrases (e.g. "complimentary admission for college scholars", "half-price student tickets")
    (r'((?:complimentary|subsidized|half-price|zero-cost|free of charge|student concession|discounted passes)\s+[^.,!\n]+)', "pricing_concession")
]

def find_best_ledger_match(phrase: str, ledger_entries: List[ClaimLedger]) -> Tuple[Optional[ClaimLedger], str, float, Optional[str]]:
    """
    Finds the best matching Claim Ledger record for a candidate phrase.
    Returns: (matched_entry, match_type, match_score, closest_claim_text)
    match_type is one of: "exact", "exact_substring", "token_overlap", "semantic_vector", "none"
    """
    if not ledger_entries:
        return None, "none", 0.0, None

    phrase_lower = phrase.lower().strip()

    # 1. Exact or substring containment
    for entry in ledger_entries:
        entry_text = entry.claim_text.lower().strip()
        if entry_text == phrase_lower:
            return entry, "exact", 1.0, entry.claim_text
        if entry_text in phrase_lower or phrase_lower in entry_text:
            return entry, "exact_substring", 0.98, entry.claim_text

    # 2. Word token overlap match
    phrase_tokens = set(re.findall(r'\w+', phrase_lower))
    best_overlap_entry = None
    best_overlap = 0
    for entry in ledger_entries:
        entry_tokens = set(re.findall(r'\w+', entry.claim_text.lower()))
        overlap = len(phrase_tokens & entry_tokens)
        if overlap >= 2 and overlap > best_overlap:
            best_overlap = overlap
            best_overlap_entry = entry

    if best_overlap_entry and best_overlap >= 2:
        overlap_score = min(0.85 + best_overlap * 0.04, 0.96)
        return best_overlap_entry, "token_overlap", round(overlap_score, 2), best_overlap_entry.claim_text

    # 3. Dense Semantic Vector Embedding Match (Round 3 Improvement)
    def extract_digits(s: str) -> set:
        clean = re.sub(r'[,]', '', s)
        return set(re.findall(r'\b\d+(?:\.\d+)?\b', clean))

    phrase_digits = extract_digits(phrase_lower)
    compatible_candidates = []
    for e in ledger_entries:
        entry_digits = extract_digits(e.claim_text.lower())
        # If both contain explicit numbers and they contradict, they are not substantiations
        if phrase_digits and entry_digits and phrase_digits != entry_digits:
            continue
        compatible_candidates.append((e.claim_text, e))

    engine = get_semantic_engine()
    best_semantic_entry, sim_score, matched_text = engine.find_best_semantic_match(
        phrase, compatible_candidates, threshold=0.65
    )

    if best_semantic_entry:
        return best_semantic_entry, "semantic_vector", round(sim_score, 2), matched_text

    return None, "none", round(sim_score, 2), matched_text

def check_claim_ledger(text: str, db: Session, org_id: str = "org_novafest") -> List[Dict[str, Any]]:
    findings = []
    now = utcnow()
    ledger_entries = db.query(ClaimLedger).filter(ClaimLedger.org_id == org_id).all()
    if not ledger_entries and org_id != "org_novafest":
        ledger_entries = db.query(ClaimLedger).filter(ClaimLedger.org_id == "org_novafest").all()

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
            matched_ledger, match_type, match_score, closest_claim = find_best_ledger_match(quote, ledger_entries)

            if matched_ledger:
                valid_until = matched_ledger.valid_until
                if valid_until.tzinfo is None:
                    valid_until = valid_until.replace(tzinfo=timezone.utc)

                expiry_str = valid_until.strftime("%Y-%m-%d")
                days_left = (valid_until - now).days

                is_semantic = (match_type == "semantic_vector")
                vector_note = f" [Dense Vector Sim: {int(match_score * 100)}%]" if is_semantic else ""

                if valid_until < now:
                    # Outcome: EXPIRED
                    msg = (
                        f"Claim cites EXPIRED ledger record ({matched_ledger.id} expired on {expiry_str}) "
                        f"matched via dense vector embeddings ({int(match_score * 100)}% similarity with '{matched_ledger.claim_text}')."
                        if is_semantic else
                        f"Claim cites EXPIRED ledger record ({matched_ledger.id} expired on {expiry_str}). Public statistics must be based on valid, current evidence."
                    )
                    findings.append({
                        "rule_id": "C-1",
                        "type": "claim",
                        "severity": "critical",
                        "span_start": start,
                        "span_end": end,
                        "quote": quote,
                        "message": msg,
                        "source_cited": f"Claim Ledger {matched_ledger.id} | Source: {matched_ledger.source} | Owner: {matched_ledger.owner} | Expired: {expiry_str}{vector_note}",
                        "suggestion": f"Renew substantiation for {matched_ledger.id} or rephrase without the expired statistic",
                        "confidence": match_score if is_semantic else 0.96,
                        "origin": "semantic_vector" if is_semantic else "deterministic",
                        "match_type": match_type,
                        "match_score": match_score
                    })
                elif days_left <= 30:
                    # Outcome: EXPIRES SOON
                    msg = (
                        f"Claim verified via Dense Semantic Vector Match ({int(match_score * 100)}% similarity to '{matched_ledger.claim_text}'), "
                        f"but Ledger {matched_ledger.id} EXPIRES IN {days_left} DAYS ({expiry_str}). Verify continuity with {matched_ledger.owner}."
                        if is_semantic else
                        f"Claim is verified under Ledger {matched_ledger.id}, but EXPIRES IN {days_left} DAYS ({expiry_str}). Verify continuity with {matched_ledger.owner}."
                    )
                    findings.append({
                        "rule_id": "C-1",
                        "type": "claim",
                        "severity": "warning",
                        "span_start": start,
                        "span_end": end,
                        "quote": quote,
                        "message": msg,
                        "source_cited": f"Claim Ledger {matched_ledger.id} | Source: {matched_ledger.source} | Owner: {matched_ledger.owner} | Valid Until: {expiry_str}{vector_note}",
                        "suggestion": quote,
                        "confidence": match_score if is_semantic else 0.95,
                        "origin": "semantic_vector" if is_semantic else "deterministic",
                        "match_type": match_type,
                        "match_score": match_score
                    })
                else:
                    # Outcome: VERIFIED
                    msg = (
                        f"VERIFIED (DENSE VECTOR EMBEDDING MATCH: {int(match_score * 100)}%): "
                        f"Semantically substantiated by approved Claim Ledger entry {matched_ledger.id} ('{matched_ledger.claim_text}')."
                        if is_semantic else
                        f"VERIFIED: Substantiated by approved Claim Ledger entry {matched_ledger.id}."
                    )
                    findings.append({
                        "rule_id": "C-1",
                        "type": "claim",
                        "severity": "info",
                        "span_start": start,
                        "span_end": end,
                        "quote": quote,
                        "message": msg,
                        "source_cited": f"Claim Ledger {matched_ledger.id} | Source: {matched_ledger.source} | Owner: {matched_ledger.owner} | Valid Until: {expiry_str}{vector_note}",
                        "suggestion": quote,
                        "confidence": match_score if is_semantic else 0.99,
                        "origin": "semantic_vector" if is_semantic else "deterministic",
                        "match_type": match_type,
                        "match_score": match_score
                    })
            else:
                # Outcome: UNSUPPORTED
                unsupported_msg = f"UNSUPPORTED CLAIM: '{quote}' is not documented in the approved Claim Ledger."
                if match_score >= 0.40 and closest_claim:
                    unsupported_msg += f" Nearest approved claim was '{closest_claim}' (vector similarity: {int(match_score * 100)}%, below 65% verification threshold)."

                findings.append({
                    "rule_id": "C-1",
                    "type": "claim",
                    "severity": "critical",
                    "span_start": start,
                    "span_end": end,
                    "quote": quote,
                    "message": unsupported_msg,
                    "source_cited": "Rule C-1: University Public Communications Governance Code, Clause 14",
                    "suggestion": "Submit claim documentation to Brand Owner for ledger entry or remove claim",
                    "confidence": 0.92,
                    "origin": "deterministic",
                    "match_type": "none",
                    "match_score": match_score
                })

    return findings
