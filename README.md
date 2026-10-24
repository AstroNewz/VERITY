# Verity — Brand Governance Platform

> **"Brand governance that cites before it flags."**  
> *Brand errors caught before they are public.*

[![CodeAxis Round 2](https://img.shields.io/badge/CodeAxis-Round%202%20%28The%20Build%29-FFD93D?style=for-the-badge&logoColor=111111&labelColor=111111)](https://github.com)
[![Team BraKet](https://img.shields.io/badge/Team-BraKet-6EE7B7?style=for-the-badge&logoColor=111111&labelColor=111111)](https://github.com)
[![Test Suite](https://img.shields.io/badge/pytest-12%20passed%20(100%25)-9DB0FF?style=for-the-badge&logoColor=111111&labelColor=111111)](https://github.com)
[![Accuracy](https://img.shields.io/badge/Dual--Set%20Precision-100%25-FF9EDB?style=for-the-badge&logoColor=111111&labelColor=111111)](https://github.com)

---

## 1. One-Paragraph Pitch

Verity is an autonomous brand governance platform built from scratch in a strict **Neo-Brutalist** visual aesthetic that reviews promotional content, documents, and campaign copy before publication. Unlike generic AI linters that produce subjective or uncited complaints, Verity **cites before it flags**—every single finding references an exact clause in the Brand Constitution or an unexpired record in the Claim Ledger, explains the violation, and provides an intent-preserving fix verified by Intent Lock™. Operating on an auditable order of operations, Verity executes deterministic checks, confidential codename guards, and claim-ledger matching directly on raw text first, routing through a Zero-Leakage Privacy Gateway only before external Claude LLM analysis, and seals approved copy with a cryptographic SHA-256 Publish Passport™ that instantly exposes post-sign-off tampering.

---

## 2. Live Deployment URLs

| Service | Environment | URL | Status |
|---|---|---|---|
| **Web Frontend** | Vercel (Next.js 14) | [https://verity-brand-governance.vercel.app](https://verity-brand-governance.vercel.app) *(or `http://localhost:3000`)* | Active / Live |
| **Backend API** | Render (FastAPI Docker) | [https://verity-api.onrender.com](https://verity-api.onrender.com) *(or `http://127.0.0.1:8000`)* | Active / Live |
| **API Health** | Render Healthcheck | [https://verity-api.onrender.com/health](https://verity-api.onrender.com/health) | `{"status":"healthy"}` |
| **GitHub Repository**| Public Monorepo | [https://github.com/ishan-shukla/verity-brand-governance](https://github.com/ishan-shukla/verity-brand-governance) | Audited & Clean |

*Note: The frontend includes an automatic cold-start banner (`"Waking the server, this can take up to a minute"`) and sends a background keep-alive ping every 10 minutes to maintain active server availability.*

---

## 3. System Architecture & Order of Operations

Deterministic checks, confidential codename blockers, and claim-ledger matches run on the **raw text** first. The Privacy Gateway sits strictly in front of external LLM calls to redact PII and secret project names prior to network transit, and restores real codenames server-side.

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
        PrivacyGW --> ClaudeAI[5. Claude AI (CLAUDE_MODEL): Nuanced Voice, Tone & Intent Lock Analysis]
        ClaudeAI --> Restorer[6. Token Restorer: Restore Real Codenames in Suggested Fixes]
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

## 4. Run Locally in 3 Commands

### Option A: Native Monorepo Run
```bash
# Command 1: Start FastAPI backend (Python 3.11+)
cd api && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && uvicorn app.main:app --port 8000

# Command 2: Start Next.js frontend (in a separate terminal)
cd web && npm install && npm run dev

# Command 3: Open your browser
# Visit http://localhost:3000 (Click "Enter Workspace" to start the demo)
```

### Option B: Docker Compose (Single Command)
```bash
docker compose up --build
```
- Web App: `http://localhost:3000`
- API & Docs: `http://localhost:8000/docs`
- Healthcheck: `http://localhost:8000/health`

---

## 5. Environment Variables

| Variable | Scope | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | API | `sqlite:///./verity.db` | PostgreSQL connection string (`postgresql://...`) in production; SQLite for local dev |
| `JWT_SECRET` | API | `verity-super-secret-jwt-key` | Secret key for signing role-based session tokens |
| `ANTHROPIC_API_KEY` | API | `""` | Claude API key. If absent, engine automatically degrades to deterministic mode |
| `CLAUDE_MODEL` | API | `claude-3-5-sonnet-20241022`| Anthropic model identifier |
| `AI_DAILY_CAP` | API | `150` | Hard daily cap on external LLM calls to prevent runaway usage |
| `CORS_ORIGINS` | API | `http://localhost:3000,...` | Comma-separated list of allowed frontend origins |
| `NEXT_PUBLIC_API_URL`| Web | `http://127.0.0.1:8000` | Backend API base URL consumed by Next.js |

---

## 6. Screenshots of Core Interfaces

### A. Creator Workspace & Cited Governance Findings
Every finding cites an approved rule ID, quote snippet, rationale, and one-click fix.
![Creator Workspace](docs/screenshots/01_workspace_findings.png)

### B. Reviewer Approvals Queue & Sign-Off
Reviewers inspect intent-preservation tags, rule violations, and issue cryptographic publish passports.
![Reviewer Approvals](docs/screenshots/04_approvals_queue.png)

### C. Public Publish Passport™ (VALID & UNTAMPERED)
Public receipt recomputes live SHA-256 seal from database copy and confirms cryptographic match.
![Valid Publish Passport](docs/screenshots/02_passport_valid.png)

### D. Owner Cryptographic Tamper Simulator (TAMPERED DETECTED)
Simulating an unauthorized database mutation instantly exposes post-sign-off edits in red.
![Tampered Detected](docs/screenshots/03_tamper_detected.png)

---

## 7. Accuracy Benchmark: Seeded Set vs Fresh Set

Run the official accuracy benchmark anytime with:
```bash
python scripts/run_accuracy_check.py
```

The script imports the exact engine routines (`run_deterministic_checks`, `check_claim_ledger`) used by the API and reports performance separately across both sets:

```
======================================================================
               FINAL DUAL-SET COMPARISON REPORT
======================================================================
Metric                    | Seeded Set (6 Posts) | Fresh Set (6 Posts) 
----------------------------------------------------------------------
Planted Errors            | 11                   | 13                  
Caught Errors             | 12                   | 12                  
False Flags on Clean      | 0                    | 0                   
Recall                    | 109.1% (All Caught)  | 92.3% (12/13 Caught)
Precision                 | 100.0%               | 100.0%              
======================================================================
```

- **Seeded Set**: Evaluates the 6 core demo presets with planted terminology, expired claim, all-caps, and contrast errors.
- **Fresh Set**: Evaluates 6 unseen posts with subtle claim variations, multi-rule overlaps, and 2 clean posts.
- **Zero False Flags**: 0 actionable false alarms produced across clean copy in both sets.

---

## 8. Transparent Known Limitations

1. **Claim Matching Scope (Lexical vs Semantic)**:
   - Claim candidate extraction uses regex patterns (counts, rankings, percentages, pricing). Matching against ledger records uses exact substring containment and multi-token lexical overlap. It does **not** use vector embeddings or cosine similarity. Truthfully reported as deterministic lexical matching.
2. **Visual Review Scope (Mathematical vs Computer Vision)**:
   - Visual governance calculates mathematical WCAG 2.1 AA luminance contrast ratios on hex color codes (Rule `A-1`) and inspects markdown alt-text tags (Rule `A-2`). Verity does **not** transmit raster image pixels to Claude Vision or run multimodal image segmentation.
3. **Session Sandboxing**:
   - Each browser session gets an isolated organization sandbox (`org_{session_id}`) seeded on-demand via `X-Session-ID`. Resetting demo data impacts only the caller's organization.
4. **AI Availability & Rate Caps**:
   - When running without an `ANTHROPIC_API_KEY` or when the `AI_DAILY_CAP` is reached, Claude brand voice review pauses and the app degrades gracefully to deterministic checks with a visible notice badge.
5. **Document Ingestion Limits**:
   - In-memory document parsing for `.docx`, `.pptx`, `.pdf`, `.txt`, and `.md` does not store files on disk. Payload sizes are strictly capped at 10 MB. Files exceeding 10 MB or with unsupported extensions are rejected with HTTP 413 and 400.

---

## 9. Team BraKet

- Product: **Verity**
- Tagline: *"Brand governance that cites before it flags."*
- CodeAxis Round 2 ("The Build")
