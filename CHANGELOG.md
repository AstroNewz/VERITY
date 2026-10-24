# Changelog — Verity

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-10-24
### Complete Product Build (P0, P1, P2) — CodeAxis Round 2 ("The Build")
- **Neo-Brutalist Visual Design System**:
  - Implemented strict Neo-Brutalist design tokens: `#FFFBEF` cream background, `#111111` ink, `#FFD93D` primary yellow, `#6EE7B7` mint, `#E5484D` danger red.
  - 3px solid `#111` borders, 6px hard offset shadows, zero radius, Fraunces display headings, and Space Grotesk/Mono typography.
- **Backend Governance Architecture (FastAPI)**:
  - Developed full FastAPI backend with SQLAlchemy 2, Pydantic v2 schemas, and JWT role-based security.
  - Zero-friction demo authentication with 1-click role swapping (Creator, Reviewer, Brand Owner).
  - Seeded complete Nova Fest brand dataset (Rules T-1, T-2, T-3, V-1, V-2, A-1, A-2, C-1, P-1; Claim Ledger F-1, F-2, F-3; Confidential Terms; 6 demo posts).
- **Verity Governance Engine**:
  - **Deterministic Engine**: Terminology casing, value proposition vocabulary, guarantee prohibitions, confidential codename blockers, WCAG AA contrast ratio calculator, image alt text validator.
  - **Claim Ledger™**: Detects metrics and superlatives; categorizes claims as `VERIFIED`, `EXPIRED`, `EXPIRES SOON`, or `UNSUPPORTED`.
  - **Intent Lock™**: Extracts `{goal, audience, key_message, tone, must_keep_phrases[], call_to_action}`; continuously verifies revised text to guarantee intent preservation.
  - **Claude AI Reviewer**: Structured Anthropic Claude review with strict exact-substring quote validation and confidence threshold routing.
  - **Privacy Gateway**: Automatic PII & confidential codename redaction with memory-safe token restoration.
  - **Publish Passport™**: SHA-256 cryptographic seal generation and tamper-detection verification with scannable QR code.
  - **Guideline Health Radar™**: Rejection-rate tracking with automated clarified clause generator and rule versioning.
  - **Governance Insights**: Real-time mistakedistribution analytics, override tracking, and 4-week drift reduction graphs.
- **Testing & Verification**:
  - 8/8 pytest unit tests passing (claim ledger, confidence routing, deterministic rules, passport tamper detection, privacy gateway round-trip).
  - Automated accuracy benchmark: 12/12 planted errors caught (100% recall), 0 false flags on clean copy (100% precision).
  - Browser subagent verified end-to-end user journey with visual screenshots and session recording.
