# Verity — Completed Features & Known Limitations

**Product:** Verity | **Team:** BraKet | **Round:** CodeAxis Round 2 ("The Build")  
**Tagline:** *"Brand governance that cites before it flags."*  
**Promise:** *"Brand errors caught before they are public."*

---

## 1. Completed Features

### Core Journey & Governance Engine (P0 & P1)
- **Cites Before It Flags**: Every single finding points to a specific rule ID (e.g. `Rule T-1`), source document, page, and owning committee.
- **Claim Ledger™**:
  - Automatically detects statistics, rankings, percentages, and attendee counts.
  - Matches claims against the approved ledger and tags them with one of four statuses:
    - `VERIFIED`: Approved source cited with validity date.
    - `EXPIRES SOON`: Active claim with less than 30 days remaining on validity window.
    - `EXPIRED`: Flags claims that cite outdated evidence (e.g. `Ledger F-2` expired in 2025).
    - `UNSUPPORTED`: Flags claims lacking documentation in the ledger.
  - 30-Day Expiry Timeline strip on the Claims Ledger dashboard.
- **Intent Lock™**:
  - Extracts `{goal, audience, key_message, tone, must_keep_phrases[], call_to_action}` before suggested fixes are applied.
  - Re-evaluates revised copy against the Intent Lock to verify that brand corrections did not distort the creator's promotional message. Displays `INTENT PRESERVED` or `INTENT AT RISK`.
- **Deterministic Check Engine (100% Free & Fast)**:
  - **Terminology**: Enforces official brand casing (`Nova Fest` vs `NovaFest`) and vocabulary standards (`affordable` vs `cheap`, prohibitions on unverified guarantees).
  - **Confidential Terms**: Immediate publication block on unreleased project codenames (`Project Falcon`).
  - **Tone Hygiene**: Flags repeated exclamation points (`!!!`), excessive ALL-CAPS words, and shouting.
  - **Accessibility**: Real mathematical WCAG AA contrast ratio calculation (`#FFFF00` on `#FFFFFF` = 1.07:1, failing 4.5:1 requirement) and missing image alt-text checks.
- **Claude AI Brand Voice Review**:
  - Evaluates copy against brand voice attributes (*warm, energetic, plain English, no hype*).
  - Strict substring quote validation: any model output that does not match an exact substring in the source text is discarded.
  - Delimited inside `<untrusted_content>` tags to prevent prompt injection.
  - Confidence routing: `≥ 0.85` shown as normal finding; `0.60 – 0.85` marked `[Please check]`; `< 0.60` sent to reviewer queue.
- **Privacy Gateway**:
  - Server-side redactor scrubs emails, phone numbers, and confidential terms into tokens like `[REDACTED-CONFIDENTIAL-1]` prior to any external LLM call.
  - De-redaction engine restores original tokens inside suggested fixes so the creator sees their actual text.
  - Audit trail logged in `ai_usage_log`.
- **Publish Passport™**:
  - Upon authorized Reviewer approval, computes a canonical SHA-256 seal over `(final_text + rules_version + approver_id + issued_at + ai_used + findings_summary)`.
  - Public verification screen at `/verify/[id]` that recomputes the cryptographic hash from current database copy and displays `VALID & UNTAMPERED` (mint) or `TAMPERED DETECTED` (red).
  - Includes scannable QR Code and one-click JSON receipt download.
- **Guideline Health Radar™**:
  - Calculates rejection rates and reviewer disagreements per rule.
  - Flags rules with `≥ 50%` creator rejection rate as `UNCLEAR`.
  - Automatically drafts clarified clauses with 1 approved and 1 banned example.
  - One-click Brand Owner approval increments rule version from `1.0` to `1.1`.
- **Governance Insights Dashboard**:
  - Real-time KPIs: Submissions reviewed, passports issued, brand errors caught, average approval time.
  - Top repeated mistakes bar chart.
  - Most overridden rules table with direct radar jump links.
  - Categorical mistake distribution and 4-week drift reduction tracking.
- **Frictionless Demo Experience**:
  - Zero-setup 1-click role switcher in navbar: Creator, Reviewer, Brand Owner.
  - 6 seeded demo posts with planted errors and clean copy controls.
  - One-click "Reset Demo Data" button to restore pristine state at any time.

---

## 2. Honest Known Limitations

1. **AI Degradation Under Missing Keys**:
   - When `ANTHROPIC_API_KEY` is not present, Verity degrades to deterministic checks. While all terminology, claim ledger, tone hygiene, and accessibility rules operate at 100% accuracy, subjective tone nuance checks require an active API key.
2. **Local Vector Search Fallback**:
   - In local development without a running pgvector Postgres instance, Claim Ledger matching operates via exact phrase containment and token overlap heuristics. Full semantic embedding matching requires an active PostgreSQL + pgvector connection.
3. **Complex Document Formatting**:
   - The document parser extracts raw paragraphs and text blocks from `.docx`, `.pptx`, and `.pdf`. Visual clear-space checking for layered vector graphics currently relies on text and slide metadata rather than full rendering engine rasterization.
