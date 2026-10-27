import json
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.models import (
    Organization, User, Rule, RuleVersion, ClaimLedger, ConfidentialTerm,
    Submission, Finding, Comment, Passport, AIUsageLog
)

def utcnow():
    return datetime.now(timezone.utc)

DEMO_POSTS = [
    {
        "id": "demo_post_comprehensive",
        "title": "NovaFest 2026 Campus Launch Announcement",
        "description": "Comprehensive planted errors across terminology, claims, tone, and privacy.",
        "text": "NovaFest 2026 is back and it is CHEAP! We are the #1 student fest in India with over 10,000 attendees expected on campus! Tickets are guaranteed to sell out, but do not mention Project Falcon yet!!!"
    },
    {
        "id": "demo_post_clean",
        "title": "Clean & Verified Official Invitation",
        "description": "Pristine copy that strictly adheres to brand guidelines and approved claims.",
        "text": "Join us at Nova Fest 2026 for an unforgettable weekend of music, innovation, and culture. With over 10,000 attendees gathered on the main campus lawn, our student stages celebrate emerging talent from across the region. Tickets are available now at affordable student rates."
    },
    {
        "id": "demo_post_subtle_ai_voice",
        "title": "Subtle Hype & Brand Voice Violation",
        "description": "Tests AI tone and voice detection against Nova Fest brand personality.",
        "text": "Nova Fest presents an unimaginably paradigm-shifting, hyper-exclusive extravaganza that will utterly revolutionize campus life beyond human comprehension. Don't be a loser; witness the ultimate spectacle."
    },
    {
        "id": "demo_post_claims_expiring",
        "title": "Student Pass Announcement (Expiring Claim)",
        "description": "Demonstrates Claim Ledger 30-day expiry threshold warning.",
        "text": "Great news for campus! Nova Fest offers free entry for students with a valid university ID badge. Register early at our student union desk."
    },
    {
        "id": "demo_post_tone_hygiene",
        "title": "All-Caps & Excessive Punctuation Flyer",
        "description": "Flags shouty typography and repeated exclamation marks.",
        "text": "GET READY EVERYONE!!!!! THIS IS THE BIGGEST PARTY OF THE YEAR! DO NOT MISS OUT!!!"
    },
    {
        "id": "demo_post_accessibility",
        "title": "Stage Banner Spec with Accessibility Defect",
        "description": "Fails WCAG AA contrast ratio and lacks image alt text.",
        "text": "Stage Banner Spec: The text color is #FFFF00 on background #FFFFFF. See visual layout: ![](https://assets.novafest.edu/banner.png)"
    },
    {
        "id": "demo_post_semantic_embedding",
        "title": "Round 3: Dense Vector Paraphrase Match",
        "description": "Demonstrates BAAI/bge-small-en-v1.5 dense vector embeddings matching paraphrased claims with 0 shared words.",
        "text": "Welcome scholars! Nova Fest offers complimentary admission for college scholars on opening night. We were voted the premier university celebration across the nation, with over ten thousand visitors attending!"
    }
]

def seed_organization(db: Session, org_id: str = "org_novafest", force_reset: bool = False):
    if force_reset:
        subs = db.query(Submission).filter(Submission.org_id == org_id).all()
        sub_ids = [s.id for s in subs]
        if sub_ids:
            db.query(AIUsageLog).filter(AIUsageLog.submission_id.in_(sub_ids)).delete(synchronize_session=False)
            db.query(Passport).filter(Passport.submission_id.in_(sub_ids)).delete(synchronize_session=False)
            db.query(Comment).filter(Comment.submission_id.in_(sub_ids)).delete(synchronize_session=False)
            db.query(Finding).filter(Finding.submission_id.in_(sub_ids)).delete(synchronize_session=False)
            db.query(Submission).filter(Submission.id.in_(sub_ids)).delete(synchronize_session=False)

        db.query(ConfidentialTerm).filter(ConfidentialTerm.org_id == org_id).delete(synchronize_session=False)
        db.query(ClaimLedger).filter(ClaimLedger.org_id == org_id).delete(synchronize_session=False)
        db.query(RuleVersion).filter(RuleVersion.org_id == org_id).delete(synchronize_session=False)
        db.query(Rule).filter(Rule.org_id == org_id).delete(synchronize_session=False)
        db.query(User).filter(User.org_id == org_id).delete(synchronize_session=False)
        db.query(Organization).filter(Organization.id == org_id).delete(synchronize_session=False)
        db.commit()

    # 1. Organization
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        org = Organization(
            id=org_id,
            name="Nova Fest Executive Council"
        )
        db.add(org)
        db.commit()

    # 2. Users (Scoped to org)
    if org_id == "org_novafest":
        users_data = [
            {"id": "user_creator", "name": "Maya Lin", "email": "creator@novafest.edu", "role": "creator"},
            {"id": "user_reviewer", "name": "Dr. Arvind Rao", "email": "reviewer@novafest.edu", "role": "reviewer"},
            {"id": "user_owner", "name": "Anya Sharma", "email": "owner@novafest.edu", "role": "owner"}
        ]
    else:
        users_data = [
            {"id": f"creator_{org_id}", "name": "Maya Lin", "email": f"creator_{org_id}@novafest.edu", "role": "creator"},
            {"id": f"reviewer_{org_id}", "name": "Dr. Arvind Rao", "email": f"reviewer_{org_id}@novafest.edu", "role": "reviewer"},
            {"id": f"owner_{org_id}", "name": "Anya Sharma", "email": f"owner_{org_id}@novafest.edu", "role": "owner"}
        ]

    for u in users_data:
        if not db.query(User).filter(User.id == u["id"]).first():
            db.add(User(
                id=u["id"],
                name=u["name"],
                email=u["email"],
                role=u["role"],
                org_id=org_id
            ))
    db.commit()

    # 3. Rules (Brand Constitution)
    rules_data = [
        {
            "id": "T-1",
            "type": "terminology",
            "title": "Official Brand Name Casing",
            "description": "Always write the festival name with a space and title case: 'Nova Fest'. Do not use 'NovaFest', 'Nova fest', or 'novafest'.",
            "severity": "critical",
            "source_ref": "Nova Fest Brand Identity Guide 2026, Section 1.2",
            "owner": "Anya Sharma (Brand Owner)",
            "examples_allowed": json.dumps(["Nova Fest 2026 launches this Friday.", "Welcome to Nova Fest."]),
            "examples_banned": json.dumps(["Come to NovaFest!", "Nova fest tickets are live."])
        },
        {
            "id": "T-2",
            "type": "terminology",
            "title": "Value Proposition Vocabulary ('Affordable' vs 'Cheap')",
            "description": "Never refer to student pricing as 'cheap'. Use 'affordable', 'student-friendly', or 'accessible'.",
            "severity": "warning",
            "source_ref": "Nova Fest Messaging Guide 2026, Page 8",
            "owner": "Anya Sharma (Brand Owner)",
            "examples_allowed": json.dumps(["Affordable student tickets available.", "Accessible admission."]),
            "examples_banned": json.dumps(["Tickets are cheap!", "Super cheap entry."])
        },
        {
            "id": "T-3",
            "type": "terminology",
            "title": "Unsubstantiated Guarantee Prohibition",
            "description": "Do not promise absolute guarantees like 'guaranteed to sell out' or '100% guarantee'. Use 'expected to sell out' or 'anticipated'.",
            "severity": "warning",
            "source_ref": "Legal & Risk Advisory Circular 2026, Section 4",
            "owner": "Legal & Governance",
            "examples_allowed": json.dumps(["Passes are expected to sell quickly.", "High demand anticipated."]),
            "examples_banned": json.dumps(["Tickets are guaranteed to sell out.", "Guaranteed admission."])
        },
        {
            "id": "V-1",
            "type": "voice",
            "title": "Punctuation Hygiene: Repeated Exclamations",
            "description": "Limit exclamation points to at most one per paragraph. Never use repeated exclamation points (e.g. '!!', '!!!').",
            "severity": "warning",
            "source_ref": "Nova Fest Editorial Standard 2026, Rule 3.4",
            "owner": "Editorial Board",
            "examples_allowed": json.dumps(["We are excited to see you!", "Doors open at 5 PM."]),
            "examples_banned": json.dumps(["Don't miss out!!!", "Unbelievable night!!!!!"])
        },
        {
            "id": "V-2",
            "type": "voice",
            "title": "Typography Hygiene: ALL-CAPS Prohibition",
            "description": "Do not write complete words in ALL CAPS (except standardized acronyms: VIP, DJ, EDM, ID, FAQ). Use bold or italics for emphasis instead of shouting.",
            "severity": "warning",
            "source_ref": "Nova Fest Typography Guide 2026, Section 2",
            "owner": "Creative Direction",
            "examples_allowed": json.dumps(["Get ready for an amazing festival.", "VIP passes include backstage access."]),
            "examples_banned": json.dumps(["GET READY EVERYONE!", "This is the BIGGEST night!"])
        },
        {
            "id": "A-1",
            "type": "accessibility",
            "title": "WCAG AA Color Contrast Standard",
            "description": "Text and interactive elements must meet WCAG AA contrast ratio of at least 4.5:1 against their background color.",
            "severity": "critical",
            "source_ref": "Nova Fest Digital Accessibility Policy (WCAG 2.1 AA)",
            "owner": "Accessibility Officer",
            "examples_allowed": json.dumps(["#111111 on #FFFBEF (16.2:1)", "#000000 on #FFFFFF (21:1)"]),
            "examples_banned": json.dumps(["#FFFF00 on #FFFFFF (1.07:1)", "#A0A0A0 on #FFFFFF (2.3:1)"])
        },
        {
            "id": "A-2",
            "type": "accessibility",
            "title": "Image Alt Text Requirement",
            "description": "All embedded images, banners, and diagrams must include descriptive alternative text for screen readers.",
            "severity": "warning",
            "source_ref": "Nova Fest Digital Accessibility Policy (WCAG 2.1 AA)",
            "owner": "Accessibility Officer",
            "examples_allowed": json.dumps(["![Students cheering at Nova Fest mainstage](stage.png)"]),
            "examples_banned": json.dumps(["![](stage.png)", "![image](banner.jpg)"])
        },
        {
            "id": "C-1",
            "type": "claims",
            "title": "Verified Claim Substantiation",
            "description": "Every public statistic, ranking, attendance figure, or price claim must cite an approved, unexpired entry in the Claim Ledger.",
            "severity": "critical",
            "source_ref": "University Public Communications Governance Code, Clause 14",
            "owner": "Fact-Checking & Audit Desk",
            "examples_allowed": json.dumps(["Over 10,000 attendees gathered (Ledger F-1)."]),
            "examples_banned": json.dumps(["Ranked #1 student fest in India (expired citation F-2).", "50,000 students attended (unsupported)."])
        },
        {
            "id": "P-1",
            "type": "privacy",
            "title": "Confidential Project Code Names",
            "description": "Never mention unreleased, internal project codenames in public drafts. Immediate block on publication.",
            "severity": "critical",
            "source_ref": "Confidentiality Agreement & Embargo Protocol 2026",
            "owner": "Executive Secretariat",
            "examples_allowed": json.dumps(["Our secret headliner will be revealed on Monday."]),
            "examples_banned": json.dumps(["Do not mention Project Falcon yet.", "Project Falcon artists arrive tonight."])
        }
    ]

    for r in rules_data:
        rule_obj = db.query(Rule).filter(Rule.id == r["id"], Rule.org_id == org_id).first()
        if not rule_obj:
            rule_obj = Rule(
                id=r["id"],
                org_id=org_id,
                type=r["type"],
                title=r["title"],
                description=r["description"],
                severity=r["severity"],
                source_ref=r["source_ref"],
                owner=r["owner"],
                active=True,
                version="1.0",
                examples_allowed=r["examples_allowed"],
                examples_banned=r["examples_banned"]
            )
            db.add(rule_obj)
    db.commit()

    # 4. Claim Ledger
    now = utcnow()
    ledger_data = [
        {
            "id": "F-1",
            "claim_text": "10,000 attendees",
            "source": "Registrar Campus Safety & Turnstile Audit 2026",
            "owner": "Operations Directorate",
            "valid_until": now + timedelta(days=365)  # Valid until 2027
        },
        {
            "id": "F-2",
            "claim_text": "#1 student fest in India",
            "source": "National Youth Cultural Federation Survey 2024",
            "owner": "External Relations Desk",
            "valid_until": now - timedelta(days=90)   # Expired 3 months ago!
        },
        {
            "id": "F-3",
            "claim_text": "free entry for students",
            "source": "Student Welfare Board Resolution 2026-B",
            "owner": "Finance Committee",
            "valid_until": now + timedelta(days=24)   # Expiring soon (in 24 days)!
        }
    ]

    for item in ledger_data:
        claim_obj = db.query(ClaimLedger).filter(ClaimLedger.id == item["id"], ClaimLedger.org_id == org_id).first()
        if not claim_obj:
            claim_obj = ClaimLedger(
                id=item["id"],
                org_id=org_id,
                claim_text=item["claim_text"],
                source=item["source"],
                owner=item["owner"],
                valid_until=item["valid_until"]
            )
            db.add(claim_obj)
    db.commit()

    # 5. Confidential Terms
    conf_terms = [
        {"id": f"ct_1_{org_id}", "term": "Project Falcon", "replacement_hint": "Surprise Headliner Announcement"}
    ]
    for ct in conf_terms:
        if not db.query(ConfidentialTerm).filter(ConfidentialTerm.id == ct["id"]).first():
            db.add(ConfidentialTerm(
                id=ct["id"],
                term=ct["term"],
                replacement_hint=ct["replacement_hint"],
                org_id=org_id
            ))
    db.commit()

def seed_database(db: Session, force_reset: bool = False):
    """Seed default organization org_novafest"""
    seed_organization(db, org_id="org_novafest", force_reset=force_reset)
