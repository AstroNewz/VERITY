import pytest

def test_confidence_routing_thresholds():
    findings_raw = [
        {"confidence": 0.95, "issue": "Definite brand violation"},
        {"confidence": 0.75, "issue": "Potential stylistic ambiguity"},
        {"confidence": 0.50, "issue": "Very speculative nuance"}
    ]

    normal_findings = []
    please_check_findings = []
    reviewer_queue = []

    for f in findings_raw:
        conf = f["confidence"]
        if conf >= 0.85:
            normal_findings.append(f)
        elif 0.60 <= conf < 0.85:
            f_copy = f.copy()
            f_copy["issue"] = f"[Please check] {f_copy['issue']}"
            please_check_findings.append(f_copy)
        else:
            reviewer_queue.append(f)

    assert len(normal_findings) == 1
    assert normal_findings[0]["confidence"] == 0.95

    assert len(please_check_findings) == 1
    assert "[Please check]" in please_check_findings[0]["issue"]

    assert len(reviewer_queue) == 1
    assert reviewer_queue[0]["confidence"] == 0.50
