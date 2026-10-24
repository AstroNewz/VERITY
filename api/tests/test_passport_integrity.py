import pytest
from app.models import Submission, User
from app.engine.passport import create_publish_passport, verify_passport_integrity

def test_passport_generation_and_tamper_detection(db_session):
    creator = db_session.query(User).filter(User.role == "creator").first()
    reviewer = db_session.query(User).filter(User.role == "reviewer").first()

    sub = Submission(
        id="sub_test_001",
        creator_id=creator.id,
        title="Official Invitation",
        original_text="Original text here.",
        revised_text="Approved and revised text for Nova Fest.",
        status="approved"
    )
    db_session.add(sub)
    db_session.commit()

    # Create passport
    passport = create_publish_passport(
        submission=sub,
        approver=reviewer,
        ai_used=False,
        ai_model="none",
        redactions_count=0,
        db=db_session
    )

    assert passport.id is not None
    assert len(passport.content_hash) == 64

    # 1. Verify pristine state -> VALID
    is_valid, msg, details = verify_passport_integrity(passport.id, db_session)
    assert is_valid is True
    assert "VALID" in msg

    # 2. Alter text maliciously after approval -> TAMPERED
    sub.revised_text = "Malicious altered text after approval."
    db_session.commit()

    is_valid_tampered, msg_tampered, details_tampered = verify_passport_integrity(passport.id, db_session)
    assert is_valid_tampered is False
    assert "TAMPERED" in msg_tampered
