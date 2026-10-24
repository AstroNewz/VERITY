# Verity — Architecture & Implementation Plan
**Tagline:** "Brand governance that cites before it flags."  
**Promise:** "Brand errors caught before they are public."  
**Team:** BraKet | **Round:** CodeAxis Round 2 ("The Build")

---

## 1. System Architecture

```mermaid
graph TD
    User([User: Creator / Reviewer / Brand Owner]) -->|Next.js 14 Web App| UI[Neo-Brutalist Frontend /web]
    UI -->|JWT Auth & REST API| API[FastAPI Backend /api]
    
    subgraph Engine [Verity Governance Engine]
        API --> Privacy[Privacy Gateway & Token Redactor]
        Privacy --> DetCheck[Deterministic Engine: Terminology, Tone, Accessibility, Confidential]
        Privacy --> LedgerMatch[Claim Ledger Matcher: Exact, Pattern & Semantic]
        Privacy --> IntentLock[Intent Lock Extractor & Rewrite Validator]
        Privacy --> ClaudeAI[Claude 3.5 Sonnet: Tone, Voice, Ambiguity Review]
    end
    
    subgraph Data [Persistent Storage & Ledger]
        API --> DB[(SQLAlchemy / Postgres / SQLite)]
        DB --> Rules[Brand Constitution & Versions]
        DB --> Claims[Claim Ledger with Expiry Dates]
        DB --> Submissions[Submissions & Findings]
        DB --> Passports[Publish Passports with SHA-256]
        DB --> Audit[AI Usage & Redaction Logs]
    end
    
    subgraph Verification [Public Verification]
        Public([Public / Verifier]) -->|/verify/:passport_id| VerifyUI[Passport Verification Screen]
        VerifyUI -->|Recompute SHA-256| API
    end
```

---

## 2. Monorepo Directory Tree

- `/api`: FastAPI Python 3.11/3.12, Pydantic v2, SQLAlchemy 2, SQLite/PostgreSQL, Claude Anthropic SDK, Pytest
- `/web`: Next.js 14+ App Router, TypeScript, Tailwind CSS, Neo-Brutalist design tokens
- `/docs`: Architecture, Features, API guide
- `/scripts`: Automated accuracy check benchmark
