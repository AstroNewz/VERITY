import pytest
from app.engine.claim_ledger import check_claim_ledger

def test_claim_matching_statuses(db_session):
    # 1. Verified claim
    text_verified = "Over 10,000 attendees are expected on campus."
    findings_v = check_claim_ledger(text_verified, db_session)
    assert len(findings_v) >= 1
    assert any("VERIFIED" in f["message"] for f in findings_v)
    assert any("F-1" in f["source_cited"] for f in findings_v)

    # 2. Expired claim
    text_expired = "We are the #1 student fest in India with record engagement."
    findings_e = check_claim_ledger(text_expired, db_session)
    assert len(findings_e) >= 1
    assert any("EXPIRED" in f["message"] for f in findings_e)
    assert any("F-2" in f["source_cited"] for f in findings_e)

    # 3. Expiring soon claim
    text_soon = "Enjoy free entry for students with campus credentials."
    findings_s = check_claim_ledger(text_soon, db_session)
    assert len(findings_s) >= 1
    assert any("EXPIRES IN" in f["message"] for f in findings_s)
    assert any("F-3" in f["source_cited"] for f in findings_s)

    # 4. Unsupported claim
    text_unsupported = "Over 50,000 visitors attended our festival last year."
    findings_u = check_claim_ledger(text_unsupported, db_session)
    assert len(findings_u) >= 1
    assert any("UNSUPPORTED" in f["message"] for f in findings_u)
