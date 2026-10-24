import re
import math
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.models import Rule, ConfidentialTerm

def hex_to_rgb(hex_code: str) -> Tuple[int, int, int]:
    hex_code = hex_code.strip().lstrip("#")
    if len(hex_code) == 3:
        hex_code = "".join([c * 2 for c in hex_code])
    if len(hex_code) != 6:
        return (0, 0, 0)
    return (int(hex_code[0:2], 16), int(hex_code[2:4], 16), int(hex_code[4:6], 16))

def relative_luminance(rgb: Tuple[int, int, int]) -> float:
    def channel_lum(val: int) -> float:
        c = val / 255.0
        return c / 12.92 if c <= 0.03928 else math.pow((c + 0.055) / 1.055, 2.4)
    r, g, b = rgb
    return 0.2126 * channel_lum(r) + 0.7152 * channel_lum(g) + 0.0722 * channel_lum(b)

def calculate_contrast_ratio(hex1: str, hex2: str) -> float:
    try:
        lum1 = relative_luminance(hex_to_rgb(hex1))
        lum2 = relative_luminance(hex_to_rgb(hex2))
        l_max = max(lum1, lum2)
        l_min = min(lum1, lum2)
        return (l_max + 0.05) / (l_min + 0.05)
    except Exception:
        return 21.0

def run_deterministic_checks(text: str, db: Session, org_id: str = "org_novafest") -> List[Dict[str, Any]]:
    findings = []

    # 1. Confidential Terms Check (P-1)
    conf_terms = db.query(ConfidentialTerm).filter(ConfidentialTerm.org_id == org_id).all()
    if not conf_terms and org_id != "org_novafest":
        conf_terms = db.query(ConfidentialTerm).filter(ConfidentialTerm.org_id == "org_novafest").all()
    for ct in conf_terms:
        pattern = re.compile(re.escape(ct.term), re.IGNORECASE)
        for match in pattern.finditer(text):
            findings.append({
                "rule_id": "P-1",
                "type": "privacy",
                "severity": "critical",
                "span_start": match.start(),
                "span_end": match.end(),
                "quote": match.group(),
                "message": f"Confidential term '{match.group()}' detected. Blocks public release until embargo lifts.",
                "source_cited": "Rule P-1: Confidentiality Agreement & Embargo Protocol 2026",
                "suggestion": ct.replacement_hint or "Remove confidential codename",
                "confidence": 1.0,
                "origin": "deterministic"
            })

    # 2. Terminology: Official Brand Name Casing (T-1)
    # Target: "NovaFest", "Nova fest", "novafest", but NOT "Nova Fest"
    t1_pattern = re.compile(r'\b(NovaFest|Nova\s+fest|novafest|nova\s+fest|NOVAFEST)\b')
    for match in t1_pattern.finditer(text):
        if match.group() != "Nova Fest":
            findings.append({
                "rule_id": "T-1",
                "type": "terminology",
                "severity": "critical",
                "span_start": match.start(),
                "span_end": match.end(),
                "quote": match.group(),
                "message": f"Brand name '{match.group()}' has incorrect casing or spacing.",
                "source_cited": "Rule T-1: Nova Fest Brand Identity Guide 2026, Section 1.2",
                "suggestion": "Nova Fest",
                "confidence": 1.0,
                "origin": "deterministic"
            })

    # 3. Terminology: 'cheap' -> 'affordable' (T-2)
    t2_pattern = re.compile(r'\b(cheap|CHEAP|super\s+cheap|dirt\s+cheap)\b')
    for match in t2_pattern.finditer(text):
        findings.append({
            "rule_id": "T-2",
            "type": "terminology",
            "severity": "warning",
            "span_start": match.start(),
            "span_end": match.end(),
            "quote": match.group(),
            "message": f"The term '{match.group()}' devalues student admission.",
            "source_cited": "Rule T-2: Nova Fest Messaging Guide 2026, Page 8",
            "suggestion": "affordable",
            "confidence": 0.98,
            "origin": "deterministic"
        })

    # 4. Terminology: 'guaranteed' (T-3)
    t3_pattern = re.compile(r'\b(guaranteed\s+to|guaranteed|100%\s+guarantee)\b', re.IGNORECASE)
    for match in t3_pattern.finditer(text):
        matched_str = match.group()
        replacement = "expected to" if "to" in matched_str.lower() else "expected"
        findings.append({
            "rule_id": "T-3",
            "type": "terminology",
            "severity": "warning",
            "span_start": match.start(),
            "span_end": match.end(),
            "quote": matched_str,
            "message": f"Absolute claim '{matched_str}' poses regulatory and consumer risk.",
            "source_cited": "Rule T-3: Legal & Risk Advisory Circular 2026, Section 4",
            "suggestion": replacement,
            "confidence": 0.98,
            "origin": "deterministic"
        })

    # 5. Tone Hygiene: Repeated Exclamation Marks (V-1)
    v1_pattern = re.compile(r'!{2,}')
    for match in v1_pattern.finditer(text):
        findings.append({
            "rule_id": "V-1",
            "type": "voice",
            "severity": "warning",
            "span_start": match.start(),
            "span_end": match.end(),
            "quote": match.group(),
            "message": f"Repeated exclamation marks ('{match.group()}') violate our professional brand tone.",
            "source_cited": "Rule V-1: Nova Fest Editorial Standard 2026, Rule 3.4",
            "suggestion": "!",
            "confidence": 1.0,
            "origin": "deterministic"
        })

    # 6. Typography Hygiene: ALL-CAPS words (V-2)
    # Check words of length >= 4 that are all caps and not known acronyms
    allowed_acronyms = {"VIP", "DJ", "EDM", "FAQ", "ID", "RSVP", "TBA", "TBD", "URL", "HTML", "PDF", "WCAG", "USA", "IIT", "BITS"}
    v2_pattern = re.compile(r'\b([A-Z]{3,})\b')
    for match in v2_pattern.finditer(text):
        word = match.group()
        # Ignore hex colors preceded by '#'
        if match.start() > 0 and text[match.start() - 1] == '#':
            continue
        if word not in allowed_acronyms:
            # Generate title case suggestion
            suggestion = word.capitalize()
            findings.append({
                "rule_id": "V-2",
                "type": "voice",
                "severity": "warning",
                "span_start": match.start(),
                "span_end": match.end(),
                "quote": word,
                "message": f"ALL-CAPS word '{word}' reads as shouting. Use standard title or sentence casing.",
                "source_cited": "Rule V-2: Nova Fest Typography Guide 2026, Section 2",
                "suggestion": suggestion,
                "confidence": 0.95,
                "origin": "deterministic"
            })

    # 7. Accessibility: Color Contrast Check (A-1)
    # Pattern: text color #HEX on [a/an/the] [background] #HEX
    contrast_pattern = re.compile(r'#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\s+(?:on|against|over)\s+(?:(?:a|an|the)\s+)?(?:background\s+)?#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})', re.IGNORECASE)
    for match in contrast_pattern.finditer(text):
        fg_hex = "#" + match.group(1)
        bg_hex = "#" + match.group(2)
        ratio = calculate_contrast_ratio(fg_hex, bg_hex)
        if ratio < 4.5:
            findings.append({
                "rule_id": "A-1",
                "type": "accessibility",
                "severity": "critical",
                "span_start": match.start(),
                "span_end": match.end(),
                "quote": match.group(),
                "message": f"Color combination {fg_hex} on {bg_hex} has contrast ratio of {ratio:.2f}:1, failing WCAG AA (minimum 4.5:1).",
                "source_cited": "Rule A-1: Nova Fest Digital Accessibility Policy (WCAG 2.1 AA)",
                "suggestion": f"#111111 on {bg_hex}",
                "confidence": 1.0,
                "origin": "deterministic"
            })

    # 8. Accessibility: Missing Alt Text (A-2)
    alt_pattern = re.compile(r'!\[(\s*|image|banner|photo)\]\((.*?)\)', re.IGNORECASE)
    for match in alt_pattern.finditer(text):
        findings.append({
            "rule_id": "A-2",
            "type": "accessibility",
            "severity": "warning",
            "span_start": match.start(),
            "span_end": match.end(),
            "quote": match.group(),
            "message": "Embedded visual asset lacks descriptive alternative text for screen readers.",
            "source_cited": "Rule A-2: Nova Fest Digital Accessibility Policy (WCAG 2.1 AA)",
            "suggestion": "![Descriptive title of festival visual](...)",
            "confidence": 1.0,
            "origin": "deterministic"
        })

    return findings
