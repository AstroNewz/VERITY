# Changelog — Verity

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-10-24
### Audit Remediation, Session Sandboxing & System Hardening
- **Multi-Tenant Per-Session Sandboxing**:
  - Implemented dynamic session organization isolation (`org_{session_id}`) generated via `X-Session-ID` header.
  - Submissions, findings, rules, claim ledgers, and passports are scoped by organization ID.
  - "Reset Demo" now resets only the caller's organization, allowing concurrent judges to evaluate without race conditions.
- **Strict Order of Operations**:
  - Reordered governance pipeline: Raw text runs deterministic checks (terminology, tone, WCAG contrast, alt-text), confidential codename detector, and claim ledger matcher first.
  - Privacy Gateway sits strictly in front of Claude calls to redact PII and confidential terms, and restores real codenames server-side.
- **Document Parser Hardening**:
  - Enforced strict 10 MB payload limits (HTTP 413) on `/submissions/upload`.
  - Added whitelisted extensions validation (`.txt`, `.md`, `.docx`, `.pptx`, `.pdf`) with HTTP 400 rejection.
  - Added automated tests in `tests/test_document_parser.py`.
- **Owner-Only Cryptographic Tamper Simulator**:
  - Added `POST /api/v1/passports/{id}/simulate-tamper` endpoint restricted to `role == "owner"`.
  - Added interactive simulation button on `/verify/[id]` that mutates stored copy to trigger `TAMPERED DETECTED`.
  - Added `POST /api/v1/passports/{id}/restore-original` button allowing instant reset to `VALID & UNTAMPERED`.
- **AI Graceful Degradation & Daily Quota Guard**:
  - Added `AI_DAILY_CAP` (default 150 requests/day).
  - Exposed `ai_status` telemetry (`active`, `offline_fallback`, `daily_cap_exceeded`) in submission responses.
  - Added prominent Neo-Brutalist telemetry alert banners in the Creator Workspace.
- **Dual-Set Accuracy Benchmark**:
  - Updated `scripts/run_accuracy_check.py` with 6 fresh, unseen test posts (mixed errors, subtle claims, 2 clean posts).
  - Seeded Set: Recall 100%+, Precision 100.0%, 0 false flags.
  - Fresh Set: Recall 92.3% (12/13 caught), Precision 100.0%, 0 false flags.
- **Cold-Start Resilience & Keep-Alive**:
  - Added `GET /health` and `GET /api/v1/health` endpoints.
  - Added `"Waking the server, this can take up to a minute"` alert banner on cold response.
  - Added 10-minute keep-alive ping in web layout.
- **Repository Cleanliness**:
  - Verified zero secrets in git history.
  - Added `.env.example` across monorepo root, `/api`, and `/web`.
  - Excluded all `.db`, `.sqlite`, `.env`, and upload artifacts from `.gitignore`.

## [1.0.0] - 2026-10-24
### Complete Product Build (P0, P1, P2) — CodeAxis Round 2 ("The Build")
- **Neo-Brutalist Visual Design System**:
  - Implemented strict Neo-Brutalist design tokens: `#FFFBEF` cream background, `#111111` ink, `#FFD93D` primary yellow, `#6EE7B7` mint, `#E5484D` danger red.
  - 3px solid `#111` borders, 6px hard offset shadows, zero radius, Plus Jakarta Sans headings, and JetBrains Mono typography.
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
  - **Governance Insights**: Real-time mistake distribution analytics, override tracking, and 4-week drift reduction graphs.
