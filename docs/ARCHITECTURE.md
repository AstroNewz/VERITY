# Verity — Architecture & Implementation Record

**Product:** Verity | **Team:** BraKet | **Round:** CodeAxis Round 2 ("The Build")  
**Tagline:** *"Brand governance that cites before it flags."*  
**Promise:** *"Brand errors caught before they are public."*  
**Execution Status:** **AUDITED, HARDENED & VERIFIED**

---

## 1. System Architecture & Order of Operations

The Verity Governance Pipeline enforces a strict order of operations: all deterministic, confidential-term, and claim-ledger checks run on the **raw unredacted text** first. The Privacy Gateway sits strictly in front of external LLM (Groq) calls, shielding PII and confidential project codenames before external transit, then restores real codenames server-side.

```mermaid
graph TD
    User([Creator / Reviewer / Brand Owner]) -->|Next.js 14 Web App| UI[Neo-Brutalist Frontend /web]
    UI -->|REST API with X-Session-ID| API[FastAPI Backend /api]

    subgraph Pipeline [Verity Order of Operations]
        API --> RawText[Raw Text Input]
        RawText --> DetCheck[1. Deterministic Checks: Terminology, Tone Hygiene, WCAG AA Contrast, Alt-Text]
        RawText --> ConfCheck[2. Confidential Term Detector: Project Falcon & Secret Codenames]
        RawText --> LedgerMatch[3. Claim Ledger: Regex Extraction & Substring/Lexical Overlap against Ledger F-1..F-3]
        
        RawText --> PrivacyGW[4. Privacy Gateway: Redact PII & Confidential Terms -> [CONFIDENTIAL_PROJECT_1]]
        PrivacyGW --> GroqAI[5. Groq AI (GROQ_MODEL): Nuanced Voice, Tone & Intent Lock Analysis]
        GroqAI --> Restorer[6. Token Restorer: Restore Real Codenames in Suggested Fixes]
    end

    subgraph Storage [Isolated Multi-Tenant Ledger]
        API --> DB[(Neon / Supabase PostgreSQL / Local SQLite)]
        DB --> OrgRules[Rules Scoped by org_session_id]
        DB --> OrgLedger[Claim Ledger Scoped by org_session_id]
        DB --> Submissions[Submissions, Findings & Audit Logs]
        DB --> Passports[Publish Passports with Cryptographic SHA-256]
    end

    subgraph Verification [Public Verification]
        Public([Public Verifier / Auditor / Phone]) -->|GET /verify/:passport_id| VerifyUI[Public Passport Verification]
        VerifyUI -->|Recompute Live SHA-256| API
        VerifyUI -->|Simulate Tamper / Restore| API
    end
```

---

## 2. Directory Structure & Key Files

- `/api`:
  - `app/config.py`: Environment configuration reading `DATABASE_URL`, `GROQ_MODEL`, `AI_DAILY_CAP`, `JWT_SECRET`.
  - `app/engine/deterministic.py`: Raw-text terminology, tone hygiene, confidential terms, WCAG AA contrast ratio calculator.
  - `app/engine/claim_ledger.py`: Raw-text claim regex detectors & status categorizer (Verified, Expired, Expires Soon, Unsupported).
  - `app/engine/intent_lock.py`: Creator intent extractor and continuous rewrite validator.
  - `app/engine/passport.py`: Canonical SHA-256 Publish Passport generator and tamper-detection verifier.
  - `app/engine/privacy_gateway.py`: PII and confidential terms tokenizer with memory-safe token restoration (sits only in front of Groq calls).
  - `app/engine/document_parser.py`: Multi-format text extractor for DOCX, PPTX, PDF, and TXT with 10 MB payload enforcement.
  - `app/engine/groq_reviewer.py`: High-speed Groq brand voice reviewer with exact substring validation and offline fallback degradation.
  - `app/routers/`: Versioned API endpoints (`/auth`, `/rules`, `/ledger`, `/submissions`, `/findings`, `/passports`, `/radar`, `/insights`, `/ai-logs`).
  - `tests/`: 12 pytest unit tests covering all engine modules, document parsers, and tamper verification.
- `/web`:
  - `src/app/page.tsx`: Neo-Brutalist landing page with 1-click role demo login.
  - `src/app/workspace/page.tsx`: Core Creator Review Workspace (Upload, Findings, Intent Lock, Revise, AI telemetry status banner).
  - `src/app/approvals/page.tsx`: Reviewer Approvals Queue & Publish Passport issuance.
  - `src/app/verify/[id]/page.tsx`: Public Passport Verification screen with live hash comparison, QR code, and Owner-only Simulate Tamper action.
  - `src/app/constitution/page.tsx`: Brand Constitution rules manager and guideline import.
  - `src/app/ledger/page.tsx`: Claim Ledger manager with 30-day expiry timeline strip.
  - `src/app/radar/page.tsx`: Guideline Health Radar with AI clarified clause drafter.
  - `src/app/insights/page.tsx`: Real-time governance mistake distribution and drift reduction metrics.
  - `src/app/ai-logs/page.tsx`: Privacy Gateway audit trail and token redaction log.
  - `src/components/Navbar.tsx`: Neo-Brutalist navbar with cold-start server wakeup alert and 10-minute keep-alive ping.
- `/scripts`:
  - `run_accuracy_check.py`: Automated accuracy benchmark evaluating Seeded Set and Fresh Set independently.
- `/docs`:
  - `AUDIT.md`: Truthful line-by-line audit record across all 10 criteria.
  - `ARCHITECTURE.md`: System design and order-of-operations diagram.
  - `FEATURES.md`: Completed features and honest limitations.
