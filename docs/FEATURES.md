# Verity — Verified Feature Matrix & Known Limitations

**Product:** Verity | **Team:** BraKet | **Round:** CodeAxis Round 2 ("The Build")  
**Tagline:** *"Brand governance that cites before it flags."*  
**Promise:** *"Brand errors caught before they are public."*  
**Audit Reference:** [docs/AUDIT.md](file:///c:/Users/ISHAN%20SHUKLA/Desktop/Verity_CodeAxis/docs/AUDIT.md)

---

## 1. Verified Completed Features (Audit Confirmed)

### Core Governance & Deterministic Checks (Raw Text First)
- **Cites Before It Flags (100% Citing Rate)**:
  - Every finding points to a specific rule ID (e.g. `Rule T-1`), source document, page/section reference, and owning governance committee.
  - No uncited flags or vague error messages.
- **Order of Operations**:
  - Deterministic checks (Terminology, Confidential, Tone, Accessibility) and Claim Ledger matching execute directly on the creator's raw text.
  - The Privacy Gateway sits strictly in front of external LLM calls to sanitize confidential and PII tokens before inference.
- **Rule Engine**:
  - **Terminology (`T-1`, `T-2`, `T-3`)**: Enforces official festival name casing (`Nova Fest` vs `NovaFest`) and vocabulary (`affordable` vs `cheap`, bans on unsubstantiated guarantees).
  - **Confidential Terms (`P-1`)**: Blocks publication of unreleased codenames (e.g. `Project Falcon`) until official embargo lifts.
  - **Tone Hygiene (`V-1`, `V-2`)**: Enforces exclamation point limits (max 1 per paragraph, blocks `!!!`) and flags shouting ALL-CAPS words.
  - **Digital Accessibility (`A-1`, `A-2`)**: Mathematically computes WCAG 2.1 AA luminance contrast ratio on hex colors (e.g. `#FFFF00` on `#FFFFFF` = 1.07:1, failing 4.5:1 minimum) and flags missing markdown alt-text (`![]()`).
- **Claim Ledger™**:
  - Detects candidate claims via regex (rankings, counts, percentages, free pricing).
  - Matches claims against the database via exact substring and lexical token overlap.
  - Classifies into four distinct statuses: `VERIFIED` (cites approved source and validity date), `EXPIRES SOON` (<30 days remaining), `EXPIRED` (outdated evidence), and `UNSUPPORTED`.
- **Intent Lock™**:
  - Automatically extracts creator purpose: goal, target audience, core message, and key phrases.
  - Continuously validates suggested fixes against original intent, tagging copy as `INTENT PRESERVED` or `INTENT AT RISK`.
- **Privacy Gateway**:
  - Tokenizes sensitive entities (`[REDACTED-CONFIDENTIAL-1]`) prior to Claude calls.
  - Restores tokens in suggested fixes so creators receive clear copy.
  - Logs model and redaction counts into `ai_usage_log`.
- **Publish Passport™**:
  - Authorized reviewers issue a cryptographic SHA-256 seal across `(revised_text + rules_version + approver_id + issued_at + summary)`.
  - Public `/verify/[id]` screen verifies the seal and computes the live content hash to detect any post-approval tampering.
- **Guideline Health Radar™ & Governance Insights**:
  - Monitors rule performance, creator rejection rates, and reviewer overrides.
  - Auto-drafts clarified clauses for disputed rules.
  - Real-time KPIs, repeated mistake distribution, and drift tracking.

---

## 2. Known Limitations & Audit Findings (Transparent Disclosure)

1. **Claim Matching Algorithm (Lexical vs Semantic)**:
   - Claim matching currently uses regex candidate pattern matching and multi-token lexical overlap against the Claim Ledger database. It does **not** use vector embeddings or cosine similarity. Truthfully reported as deterministic lexical matching, not semantic embeddings.
2. **Visual Review Scope (Mathematical vs Computer Vision)**:
   - Visual governance is strictly based on mathematical WCAG 2.1 AA luminance contrast calculations on color codes (Rule `A-1`) and alt-text markdown validation (Rule `A-2`). Verity does **not** transmit raster image pixels to Claude Vision or run multimodal image segmentation.
3. **Multi-Tenant Session Sandboxing**:
   - Each judge browser receives an isolated organization sandbox (`org_{session_id}`) seeded on-demand via `X-Session-ID`. Resetting demo data impacts only the caller's organization.
4. **AI Availability & Rate Caps**:
   - When running without an `ANTHROPIC_API_KEY` or when the `AI_DAILY_CAP` is reached, Claude brand voice review pauses and the app degrades gracefully to deterministic checks with a visible notice badge.
5. **Document Ingestion Limits**:
   - In-memory document parsing for `.docx`, `.pptx`, `.pdf`, `.txt`, and `.md` does not store files on disk. Payload sizes are strictly capped at 10 MB. Files exceeding 10 MB or with unsupported extensions are rejected with HTTP 413 and 400.

