import pytest
from app.database import SessionLocal, Base, engine
from app.models import ClaimLedger
from app.engine.claim_ledger import check_claim_ledger, find_best_ledger_match
from app.engine.semantic_embeddings import get_semantic_engine
from datetime import datetime, timezone, timedelta

@pytest.fixture
def db_session():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    yield session
    session.close()

def test_semantic_engine_singleton_and_embed():
    engine = get_semantic_engine()
    assert engine is not None
    vec = engine.embed_text("10,000 attendees")
    assert vec is not None
    assert len(vec) > 0
    # Test cosine similarity
    sim_same = engine.compute_similarity("10,000 attendees", "10,000 attendees")
    assert sim_same >= 0.99
    
    # Paraphrased similarity
    sim_para = engine.compute_similarity("half-price student tickets", "50% admission concession for verified university students")
    assert sim_para >= 0.65

def test_semantic_ledger_matching_paraphrases(db_session):
    # Ensure test claims exist in ClaimLedger
    org_id = "org_test_semantic"
    db_session.query(ClaimLedger).filter(ClaimLedger.org_id == org_id).delete()
    
    c1 = ClaimLedger(
        id="c_test_1",
        org_id=org_id,
        claim_text="free entry for students",
        source="Registrar Policy 2026",
        owner="Dean of Student Affairs",
        valid_until=datetime.now(timezone.utc) + timedelta(days=60)
    )
    c2 = ClaimLedger(
        id="c_test_2",
        org_id=org_id,
        claim_text="10,000 attendees",
        source="Audited Turnstile Data 2025",
        owner="Campus Operations",
        valid_until=datetime.now(timezone.utc) + timedelta(days=60)
    )
    db_session.add_all([c1, c2])
    db_session.commit()

    ledger_entries = [c1, c2]

    # 1. Paraphrase with ZERO shared words: "complimentary admission for college scholars" -> "free entry for students"
    matched, match_type, score, text = find_best_ledger_match("complimentary admission for college scholars", ledger_entries)
    assert matched is not None
    assert matched.id == "c_test_1"
    assert match_type == "semantic_vector"
    assert score >= 0.65

    # 2. Spelled out count paraphrase: "over ten thousand visitors" -> "10,000 attendees"
    matched_cnt, match_type_cnt, score_cnt, _ = find_best_ledger_match("over ten thousand visitors", ledger_entries)
    assert matched_cnt is not None
    assert matched_cnt.id == "c_test_2"
    assert match_type_cnt == "semantic_vector"
    assert score_cnt >= 0.65

    # 3. Full text check via check_claim_ledger
    test_text = "Welcome everyone! We offer complimentary admission for college scholars tonight on the lawn."
    findings = check_claim_ledger(test_text, db_session, org_id=org_id)
    assert len(findings) >= 1
    sem_finding = next((f for f in findings if f["match_type"] == "semantic_vector"), None)
    assert sem_finding is not None
    assert sem_finding["severity"] == "info"
    assert sem_finding["origin"] == "semantic_vector"
    assert "DENSE VECTOR" in sem_finding["message"] or "Semantically substantiated" in sem_finding["message"]

    # Clean up test records
    db_session.query(ClaimLedger).filter(ClaimLedger.org_id == org_id).delete()
    db_session.commit()
