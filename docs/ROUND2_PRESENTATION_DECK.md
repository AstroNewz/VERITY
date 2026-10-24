# VERITY // CODEAXIS ROUND 2 PRESENTATION DECK
## Team BraKet — "The Build" (22–25 October 2026)

---

### SLIDE 1: TITLE & COVER SLIDE
```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│   ██╗   ██╗███████╗██████╗ ██╗████████╗██╗   ██╗                       │
│   ██║   ██║██╔════╝██╔══██╗██║╚══██╔══╝╚██╗ ██╔╝                       │
│   ██║   ██║█████╗  ██████╔╝██║   ██║    ╚████╔╝                        │
│   ╚██╗ ██╔╝██╔══╝  ██╔══██╗██║   ██║     ╚██╔╝                         │
│    ╚████╔╝ ███████╗██║  ██║██║   ██║      ██║                          │
│     ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═╝   ╚═╝      ╚═╝                          │
│                                                                        │
│   BRAND GOVERNANCE THAT CITES BEFORE IT FLAGS.                         │
│   CodeAxis Round 2: "The Build"  |  Team BraKet                        │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```
- **Headline:** Brand Governance That Cites Before It Flags
- **Core Value:** Brand errors caught before they are public. Every recommendation quotes the exact rule or approved source. Humans always make the final call.
- **Project Links:**
  - Primary Custom Domain: [https://www.cosmicboom.xyz](https://www.cosmicboom.xyz)
  - Direct Vercel Mirror: [https://verity-brand-governance.vercel.app](https://verity-brand-governance.vercel.app)
  - GitHub Monorepo: [https://github.com/AstroNewz/VERITY](https://github.com/AstroNewz/VERITY)
- **Presenter Note:** "Judges and evaluators, Verity is a pre-publication brand governance platform designed to bridge the trust gap between creative marketing teams and brand compliance councils."

---

### SLIDE 2: THE PROBLEM — WHY GENERIC AI LINTERS FAIL
- **Vague, Ungrounded Complaints:** Standard grammar tools and LLM prompts output subjective opinions like *"This tone sounds too aggressive"* without citing any rule or brand policy. Creators reject these suggestions because there is no authority behind them.
- **The "AI Sterilization" Trap:** When generic AI rewrites marketing copy, it routinely destroys the creator's emotional hook, enthusiasm, and punchy promotional voice, replacing it with corporate boilerplate.
- **Outdated Public Claims:** Marketing teams accidentally publish expired attendance numbers (*"10,000+ attendees"*) or outdated accolades (*"#1 student fest"*), leading to public embarrassment or regulatory scrutiny.
- **Confidential Codename Leaks:** Unreleased product codenames (e.g. *Project Falcon*) get accidentally leaked in drafts or pasted into third-party AI models without redaction.

---

### SLIDE 3: THE SOLUTION — THE VERITY MANIFESTO
- **1. Cites Before It Flags:** Every single issue quotes the exact substring, names the Rule ID (e.g. `Rule T-1`), and links to the official Brand Book Page citation.
- **2. Deterministic First:** Regex casing rules, confidential codename guards, and evidence ledgers run on **raw content** *before* external AI inference.
- **3. Zero-Leakage Privacy Gateway:** Strips emails, phone numbers, and secret codenames into synthetic tokens (`[REDACTED-CONFIDENTIAL-1]`) before external LLM transit.
- **4. Intent Lock™ Multi-Agent Protection:** Extracts creator goal, audience, and must-keep terms before suggesting rewrites; guarantees brand fixes never sterilize marketing energy.
- **5. Cryptographic Publish Passport™:** Authorised reviewer sign-off computes an immutable SHA-256 seal. Public verify screen detects any post-approval tampering in real-time.
- **6. Guideline Health Radar™:** When creator rejection rates reach $\ge 50\%$, Verity flags the ambiguous rule and auto-drafts clarified wording with allowed and banned examples.

---

### SLIDE 4: SYSTEM ARCHITECTURE & ORDER OF OPERATIONS
```
┌────────────────────────────────────────────────────────────────────────┐
│                        VERITY PIPELINE ARCHITECTURE                    │
│                                                                        │
│   [Creator Draft / Multi-Format Document Ingestion]                    │
│         │                                                              │
│         ▼                                                              │
│   [STAGE 1: Deterministic Engine]                                      │
│      ├── Terminology & Casing Rules (Regex on Raw Unredacted Text)     │
│      ├── Confidential Codename Guard (Rule P-1: Blocks Secret Projects)│
│      └── WCAG 2.1 AA Contrast Ratio & Image Alt-Text Validator         │
│         │                                                              │
│         ▼                                                              │
│   [STAGE 2: Claim Ledger™ Engine]                                      │
│      └── Lexical & Token Overlap against 4 Claim Statuses              │
│          (Verified, Expires Soon <30d, Expired, Unsupported)           │
│         │                                                              │
│         ▼                                                              │
│   [STAGE 3: Zero-Leakage Privacy Gateway]                              │
│      └── Redacts PII & Secret Codenames to [REDACTED-CONFIDENTIAL-1]   │
│         │                                                              │
│         ▼                                                              │
│   [STAGE 4: Groq AI Multi-Agent Engine]                                │
│      └── Sub-second nuanced tone evaluation (Llama 3.3 70B / 120B)     │
│         │                                                              │
│         ▼                                                              │
│   [STAGE 5: In-Memory Token Restorer & Intent Lock™ Verification]      │
│      └── Re-injects real terms into suggested fixes; checks intent     │
└────────────────────────────────────────────────────────────────────────┘
```

---

### SLIDE 5: SELF-GUIDED JUDGE WALKTHROUGH & TUTORIAL SYSTEM
- **The Challenge:** In remote hackathon judging, participants are not in the room to present features.
- **The Verity Solution:** A built-in, zero-assistance **Multi-Track Interactive Tour**:
  - **Translucent Blackout Curtain (`bg-ink/80`):** Focuses the evaluator's attention exclusively on the relevant element.
  - **Dynamic Spotlight Cutout Ring:** Frames buttons, textareas, and diff panels with an animated 4px yellow border + ink ring.
  - **"Why This Matters (The Differentiator)":** Directly explains why Verity's approach is mathematically and architecturally superior.
  - **"How to Test":** Provides 1-click actionable instructions.
- **Dedicated Role Tracks:**
  - **Creator Track (7 Steps):** Pre-publication net, 1-click seed scenarios, raw draft editor, sub-second governance engine, citing rules before flagging, accept/reject autonomy, and reviewer handoff.
  - **Reviewer Track (6 Steps):** Incoming queue, side-by-side diff with Intent Lock, decisions audit trail, editorial feedback/request changes, SHA-256 Publish Passport with confetti, and public verification receipt.
  - **Brand Owner Track (8 Steps):** Active constitution, live ON/OFF rule toggles, AI guideline importer, 30-day expiry strip, claim ledger database, codename guard, health radar, and privacy audit logs.
  - **Full Tour Track:** All 21 steps seamlessly traversing roles.

---

### SLIDE 6: EVALUATION ACCESSIBILITY & RESPONSE TIME TRANSPARENCY
- **Dual-Link Redundancy:**
  - **Primary Domain:** `https://www.cosmicboom.xyz` (Custom apex/www with SSL)
  - **Direct Vercel Mirror:** `https://verity-brand-governance.vercel.app` (Zero-DNS latency fallback)
  - *Judge Rationale:* If an evaluator's local corporate network or ISP experiences recursive DNS propagation delay on the custom domain, the native Vercel mirror provides instant access without configuration.
- **Cloud Spin-Up / Cold Boot Transparency:**
  - Free cloud containers (Render) hibernate after 15 minutes of inactivity. Initial boot takes 30–45 seconds.
  - **Proactive Solution:** Verity integrates a dedicated **10-minute keepalive heartbeat ping** (via cron-job.org and frontend client pings) that keeps the container warm 24/7.
  - **Graceful On-Screen Alert:** If a cold start ever occurs, an animated banner immediately informs the visitor: *"Waking the server, this can take up to a minute (Render / Cloud Spin-Up)... Cold Start Detected"*.

---

### SLIDE 7: PROGRESS FROM ROUND 1 PROPOSAL TO ROUND 2 "THE BUILD"
| Architectural Component | Round 1 Planned Scope | Round 2 Actual Delivered ("The Build") |
|:---|:---|:---|
| **AI Inference Latency** | Anthropic Claude 3.5 Sonnet (~4.2s latency) | **Groq Cloud AI SDK (<800ms sub-second latency)** with zero vendor lock-in and strict JSON schema enforcement |
| **Tamper Verification** | Static hash string display | **Interactive Tamper Simulator:** 1-click database mutation proves real-time cryptographic mismatch in public verify screen |
| **Multi-Judge Concurrency**| Shared global database | **Multi-Tenant `org_{session_id}` Sandboxing:** Every judge browser operates in an isolated workspace without data collision |
| **User Experience** | Unassisted static web forms | **Multi-Track Interactive Tour:** Translucent spotlight system guiding judges through Creator, Reviewer, and Owner journeys |
| **Mobile Accessibility** | Desktop-only layout | **Android & iOS Certified Responsive Viewport (360px–412px):** Mobile drawer, swipeable tab bar, zero tap delay |
| **Claim Verification** | Heuristic claim guesses | **Structured Claim Ledger™:** 4-state lifecycle tracking (Verified, Expires Soon <30d, Expired, Unsupported) |

---

### SLIDE 8: ACCURACY BENCHMARK & TEST SUITE VERIFICATION
- Evaluated on **Dual-Set Benchmark** (6 Seeded Posts + 6 Fresh Unseen Posts):
  - **Planted Defects Tested:** 24 total violations (casing errors, expired claims, secret codenames, negative tone, WCAG contrast).
  - **Caught Defects:** 24 / 24 caught (**100% Core Recall**).
  - **False Positives on Clean Copy:** **0 false alarms (100.0% Precision)**.
  - **Pytest Automated Suite:** **12 / 12 passing** in 0.87 seconds (`pytest api/tests/`).
  - **Next.js Production Build:** **11 / 11 routes prerendered** without type errors or warnings.

---

### SLIDE 9: THREE SUBSTANTIAL IMPROVEMENTS PLANNED FOR ROUND 3
*These are meaningful algorithmic and infrastructural expansions, not cosmetic changes:*

1. **Dense Semantic Vector Embeddings for Claim Ledger™ (pgvector / Qdrant):**
   - *Current Limitation:* Factual claim matching relies on regex patterns and lexical token overlap.
   - *Round 3 Solution:* Integrate dense semantic vector embeddings (`BAAI/bge-small-en-v1.5` / `text-embedding-3-small`). Enables semantic paraphrasing matching (e.g. *"half price student tickets"* automatically matching ledger claim *"50% admission concession"* despite zero shared words).

2. **Multimodal Computer Vision for Graphic & Banner Asset Governance:**
   - *Current Limitation:* Visual checks are limited to mathematical hex contrast formulas (WCAG 2.1 AA) and markdown alt-text tags.
   - *Round 3 Solution:* Integrate multimodal vision models (Llama 3.2 Vision / Claude 3.5 Sonnet Vision) to evaluate raster graphic assets (PNG, JPG, SVG). Evaluates unauthorized university crest alterations, brand color palette compliance in posters, banner typography hierarchy, and minimum margin clear space.

3. **In-Situ Browser Extension & Native Figma Brand Guard Plugin:**
   - *Current Limitation:* Creators must copy-paste drafts into the Verity web application.
   - *Round 3 Solution:* Build a Chromium extension for social CMS platforms (LinkedIn, X, WordPress, Webflow) and a native Figma/Canva plugin. Delivers real-time rule citations, Claim Ledger checks, and Intent Lock directly inside creators' native authoring environments before copy is exported.

---

### SLIDE 10: DELIVERABLES & SUBMISSION SUMMARY
- **Primary Working Project:** [https://www.cosmicboom.xyz](https://www.cosmicboom.xyz)
- **Direct Vercel Mirror:** [https://verity-brand-governance.vercel.app](https://verity-brand-governance.vercel.app)
- **Source-Code Monorepo:** [https://github.com/AstroNewz/VERITY.git](https://github.com/AstroNewz/VERITY.git)
- **Submission PDF Report:** [Verity_Round2_Submission_Report.pdf](Verity_Round2_Submission_Report.pdf)
- **Interactive Verification Proof:** [https://www.cosmicboom.xyz/verify/pass_sub_demo_1](https://www.cosmicboom.xyz/verify/pass_sub_demo_1)
- **FastAPI Documentation:** [https://verity-api.onrender.com/docs](https://verity-api.onrender.com/docs)
- **Team BraKet / CodeAxis Round 2 — "The Build"**
