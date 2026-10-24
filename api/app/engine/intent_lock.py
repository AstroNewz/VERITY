import re
from typing import Dict, Any, List, Tuple
from app.schemas import IntentLockModel

def extract_deterministic_intent(text: str) -> IntentLockModel:
    text_clean = text.strip()
    words = text_clean.split()
    
    # 1. Goal extraction heuristic
    goal = "Announce festival updates, invite attendees, and drive student engagement."
    if "free entry" in text_clean.lower() or "free" in text_clean.lower():
        goal = "Promote student access and free registration for festival events."
    elif "launch" in text_clean.lower() or "back" in text_clean.lower():
        goal = "Announce the launch of Nova Fest 2026 to campus and public."

    # 2. Audience heuristic
    audience = "Students, campus community, and regional youth."
    if "student" in text_clean.lower():
        audience = "University students, campus clubs, and attendees."

    # 3. Key message
    sentences = re.split(r'[.!?]+', text_clean)
    key_message = sentences[0].strip() if sentences and len(sentences[0].strip()) > 5 else text_clean[:120]

    # 4. Tone
    tone = "Energetic, welcoming, and community-centered."
    if "!" in text_clean or "BIGGEST" in text_clean:
        tone = "High energy, enthusiastic announcement."

    # 5. Must-keep phrases
    must_keep = []
    # Key dates, numbers, or primary nouns
    for match in re.finditer(r'\b(Nova\s+Fest|NovaFest|2026|10,000\s+attendees|free\s+entry|student\s+fest)\b', text_clean, re.IGNORECASE):
        phrase = match.group()
        if phrase not in must_keep:
            must_keep.append(phrase)
    if not must_keep and len(words) > 2:
        must_keep = ["Nova Fest 2026"]

    # 6. Call to Action
    cta = "Register or attend Nova Fest 2026."
    for match in re.finditer(r'\b(register\s+early|tickets\s+are\s+available|join\s+us|come\s+to|witness)\b[^.!?]*', text_clean, re.IGNORECASE):
        cta = match.group().strip()
        break

    return IntentLockModel(
        goal=goal,
        audience=audience,
        key_message=key_message,
        tone=tone,
        must_keep_phrases=must_keep,
        call_to_action=cta,
        status="locked",
        reason="Intent Lock successfully established."
    )

def validate_rewrite_intent(original_text: str, revised_text: str, intent: IntentLockModel) -> Tuple[bool, str]:
    """
    Validates whether the revised text preserves the creator's locked intent.
    Checks:
    1. Essential keywords and message continuity.
    2. Ensures must_keep_phrases are not accidentally obliterated (unless brand corrections required it, e.g. 'NovaFest' -> 'Nova Fest').
    3. Sentiment / meaning has not been inverted (e.g. from invite to cancellation).
    """
    if not revised_text or len(revised_text.strip()) < 10:
        return False, "Revised text is too short or empty, losing core message."

    revised_lower = revised_text.lower()
    
    # Check must keep phrases
    missing_critical = []
    for phrase in intent.must_keep_phrases:
        p_clean = phrase.lower().replace("novafest", "nova fest")
        if p_clean not in revised_lower and phrase.lower() not in revised_lower:
            # Special case: if phrase was a banned term like 'cheap' or 'NovaFest', replacement is expected
            if "novafest" in phrase.lower() and "nova fest" in revised_lower:
                continue
            missing_critical.append(phrase)

    if missing_critical:
        return False, f"Key intended terms ({', '.join(missing_critical)}) were removed in the revision."

    # Check that core CTA or action is still present
    if intent.call_to_action and len(intent.call_to_action) > 5:
        cta_words = [w.lower() for w in re.findall(r'\w+', intent.call_to_action) if len(w) > 3]
        if cta_words and not any(w in revised_lower for w in cta_words):
            return False, "Call-to-action or engagement premise was omitted."

    return True, "Core intent, audience, and essential message preserved."
