import pytest
from app.engine.privacy_gateway import redact_sensitive_content, restore_tokens

def test_privacy_redaction_and_restoration_round_trip(db_session):
    original = "Contact lead maya@novafest.edu or call 555-123-4567 regarding secret Project Falcon launch."
    sanitized, token_map, count = redact_sensitive_content(original, db_session)

    assert count >= 3
    assert "maya@novafest.edu" not in sanitized
    assert "555-123-4567" not in sanitized
    assert "Project Falcon" not in sanitized
    assert "[REDACTED-" in sanitized

    # Restoration round-trip
    restored = restore_tokens(sanitized, token_map)
    assert restored == original
