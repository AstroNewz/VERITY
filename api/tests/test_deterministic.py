import pytest
from app.engine.deterministic import run_deterministic_checks, calculate_contrast_ratio

def test_deterministic_terminology_and_hygiene(db_session):
    text = "NovaFest is CHEAP and tickets are guaranteed to sell out!!!"
    findings = run_deterministic_checks(text, db_session)
    rule_ids = [f["rule_id"] for f in findings]

    assert "T-1" in rule_ids, "Should catch NovaFest spelling"
    assert "T-2" in rule_ids, "Should catch 'cheap'"
    assert "T-3" in rule_ids, "Should catch 'guaranteed to'"
    assert "V-1" in rule_ids, "Should catch repeated exclamation marks"
    assert "V-2" in rule_ids, "Should catch ALL-CAPS word CHEAP"

def test_confidential_terms(db_session):
    text = "We are secretly preparing Project Falcon for the main stage."
    findings = run_deterministic_checks(text, db_session)
    p1_findings = [f for f in findings if f["rule_id"] == "P-1"]

    assert len(p1_findings) >= 1
    assert p1_findings[0]["severity"] == "critical"
    assert "Project Falcon" in p1_findings[0]["quote"]

def test_accessibility_contrast_and_alt_text(db_session):
    text = "Button text color #FFFF00 on #FFFFFF. Layout: ![](stage.jpg)"
    findings = run_deterministic_checks(text, db_session)
    rule_ids = [f["rule_id"] for f in findings]

    assert "A-1" in rule_ids, "Should catch low contrast yellow on white"
    assert "A-2" in rule_ids, "Should catch empty image alt text"

def test_clean_text_no_false_positives(db_session):
    text = "Join us at Nova Fest 2026 for an unforgettable weekend of music. Tickets are available now at affordable student rates."
    findings = run_deterministic_checks(text, db_session)
    # Should not produce critical or warning findings
    actionable = [f for f in findings if f["severity"] in ["critical", "warning"]]
    assert len(actionable) == 0, f"Clean text should have no actionable findings, got {actionable}"
