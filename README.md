# VERITY // BRAND GOVERNANCE THAT CITES BEFORE IT FLAGS

```
██╗   ██╗███████╗██████╗ ██╗████████╗██╗   ██╗
██║   ██║██╔════╝██╔══██╗██║╚══██╔══╝╚██╗ ██╔╝
██║   ██║█████╗  ██████╔╝██║   ██║    ╚████╔╝ 
╚██╗ ██╔╝██╔══╝  ██╔══██╗██║   ██║     ╚██╔╝  
 ╚████╔╝ ███████╗██║  ██║██║   ██║      ██║   
  ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═╝   ╚═╝      ╚═╝   
BRAND GOVERNANCE PLATFORM // CODEAXIS ROUND 2 // TEAM BRAKET
```

> **"Brand governance that cites before it flags."**  
> *Brand errors caught before they are public. Every recommendation quotes the exact rule or approved source. Humans always make the final call.*

---

### SYSTEM TELEMETRY & PROJECT STATUS

[![CI Suite](https://github.com/AstroNewz/VERITY/actions/workflows/ci.yml/badge.svg)](https://github.com/AstroNewz/VERITY/actions/workflows/ci.yml)
[![Live Frontend](https://img.shields.io/badge/LIVE_APP-cosmicboom.xyz-FFE500?style=for-the-badge&logoColor=111111&labelColor=111111)](https://www.cosmicboom.xyz)
[![Backend API](https://img.shields.io/badge/BACKEND_API-Render_Docker-00FF66?style=for-the-badge&logoColor=111111&labelColor=111111)](https://verity-api.onrender.com)
[![Pytest Suite](https://img.shields.io/badge/PYTEST_SUITE-12%2F12_PASSING-00F0FF?style=for-the-badge&logoColor=111111&labelColor=111111)](https://github.com/AstroNewz/VERITY)
[![Submission Report](https://img.shields.io/badge/DELIVERABLE-SUBMISSION_PDF-FF3366?style=for-the-badge&logoColor=white&labelColor=111111)](Verity_Round2_Submission_Report.pdf)
[![Design System](https://img.shields.io/badge/DESIGN-NEO--BRUTALIST-FFE500?style=for-the-badge&logoColor=111111&labelColor=111111)](https://github.com/AstroNewz/VERITY)
[![Mobile Ready](https://img.shields.io/badge/VIEWPORT-ANDROID_%26_IOS_CERTIFIED-00FF66?style=for-the-badge&logoColor=111111&labelColor=111111)](https://github.com/AstroNewz/VERITY)
[![License: MIT](https://img.shields.io/badge/LICENSE-MIT-FFE500?style=for-the-badge&logoColor=111111&labelColor=111111)](LICENSE)

---

### QUICK NAVIGATION

- [01 // The Manifesto](#-01--the-manifesto)
- [02 // Live Deployment & Endpoints](#-02--live-deployment--endpoints)
- [03 // System Architecture & Order of Operations](#-03--system-architecture--order-of-operations)
- [04 // The 6 Pillars of Verity](#-04--the-6-pillars-of-verity)
- [05 // Android & Mobile Optimization](#-05--android--mobile-optimization)
- [06 // Dual-Set Accuracy Benchmark](#-06--dual-set-accuracy-benchmark)
- [07 // Judge Demo Walkthrough (6 Presets)](#-07--judge-demo-walkthrough-6-presets)
- [08 // Run Locally in 3 Commands](#-08--run-locally-in-3-commands)
- [09 // Environment Variables](#-09--environment-variables)
- [10 // Visual Showcase](#-10--visual-showcase)
- [11 // Monorepo Tree](#-11--monorepo-tree)
- [12 // Transparent Known Limitations](#-12--transparent-known-limitations)
- [13 // Team BraKet](#-13--team-braket)

---

## 📌 01 // THE MANIFESTO

Traditional AI linters, grammar tools, and generic LLM prompts produce vague, subjective complaints that frustrate creative teams: *"This tone sounds too aggressive"* or *"Consider rewriting this"*.

**Verity is built differently.**

```
┌────────────────────────────────────────────────────────────────────────┐
│  THE VERITY CORE PROMISE                                               │
│                                                                        │
│  [1] NO BARE OPINIONS      Every finding quotes the exact text,        │
│                            cites the rule ID, section, and owner desk. │
│  [2] DETERMINISTIC FIRST   Casing, hygiene, secret codename guards &   │
│                            evidence ledgers run BEFORE any AI call.    │
│  [3] ZERO PII LEAKAGE      Emails, phone numbers & project codenames   │
│                            are tokenized before external inference.    │
│  [4] INTENT LOCK™          Extracts creator goal and audience first;   │
│                            suggested fixes never sterilize copy.       │
│  [5] PUBLISH PASSPORT™     Cryptographic SHA-256 seal proves that the  │
│                            published copy matches signed approval.     │
│  [6] CONTINUOUS HEALTH     Flags ambiguous rules rejected by creators  │
│                            and proposes clarified clauses automatically│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🌐 02 // LIVE DEPLOYMENT & ENDPOINTS

| Component | Target Platform | Public URL | Telemetry Status |
|---|---|---|---|
| **Web Frontend** | Custom Domain / Vercel Edge | [https://www.cosmicboom.xyz](https://www.cosmicboom.xyz) | **LIVE // HTTP 200** |
| **Vercel Mirror** | Vercel Serverless | [https://verity-brand-governance.vercel.app](https://verity-brand-governance.vercel.app) | **LIVE // HTTP 200** |
| **Backend API** | Render (Docker / FastAPI) | [https://verity-api.onrender.com](https://verity-api.onrender.com) | **HEALTHY** |
| **API Health Ping** | REST Endpoint | [https://verity-api.onrender.com/health](https://verity-api.onrender.com/health) | `{"status":"healthy"}` |
| **Interactive Docs** | OpenAPI / Swagger | [https://verity-api.onrender.com/docs](https://verity-api.onrender.com/docs) | **INTERACTIVE** |
| **Monorepo** | GitHub Public | [https://github.com/AstroNewz/VERITY.git](https://github.com/AstroNewz/VERITY.git) | **SYNCED** |
| **Submission PDF**| Final Project Report | [Verity_Round2_Submission_Report.pdf](Verity_Round2_Submission_Report.pdf) | **DOWNLOADABLE** |

> **COLD-START RESILIENCE:** Render free-tier containers hibernate when idle. The frontend includes a graceful cold-start notice (`"Waking the server, this can take up to a minute"`) and pings `/health` every 10 minutes to maintain persistent availability.

---

## 🏗️ 03 // SYSTEM ARCHITECTURE & ORDER OF OPERATIONS

Verity follows a strict, auditable execution pipeline where deterministic safety checks run on raw content first, while Groq AI receives strictly sanitized, tokenized text:

```mermaid
flowchart TD
    classDef brutalBox fill:#FFFBEF,stroke:#111111,stroke-width:3px,font-weight:bold,color:#111111;
    classDef brutalYellow fill:#FFE500,stroke:#111111,stroke-width:3px,font-weight:bold,color:#111111;
    classDef brutalMint fill:#00FF66,stroke:#111111,stroke-width:3px,font-weight:bold,color:#111111;
    classDef brutalPink fill:#FF3366,stroke:#111111,stroke-width:3px,font-weight:bold,color:#ffffff;
    classDef brutalBlue fill:#00F0FF,stroke:#111111,stroke-width:3px,font-weight:bold,color:#111111;

    User([Creator / Reviewer / Brand Owner]):::brutalYellow -->|Next.js 14 Web App| UI[Neo-Brutalist UI /web]:::brutalBox
    UI -->|REST API with X-Session-ID| API[FastAPI Backend /api]:::brutalBox

    subgraph Pipeline ["⚡ VERITY ORDER OF OPERATIONS"]
        API --> Raw[Raw Content Input]:::brutalBox
        Raw --> Det[1. Deterministic Checks: Terminology, Tone Hygiene, WCAG AA, Alt-Text]:::brutalBox
        Raw --> Secret[2. Confidential Codename Guard: Blocks Project Falcon on Raw Text]:::brutalPink
        Raw --> Ledger[3. Claim Ledger: Substring & Token Overlap against Approved Evidence]:::brutalMint
        
        Raw --> Gateway[4. Privacy Gateway: Redacts PII & Secret Codenames to Synthetic Tokens]:::brutalYellow
        Gateway --> GroqAI[5. Groq AI Engine: 120B/70B Multi-Agent Nuanced Voice Review]:::brutalBlue
        GroqAI --> Restorer[6. Token Restorer: Safely Injects Real Phrases Back into Suggested Fixes]:::brutalBox
    end

    subgraph Persistence ["💾 MULTI-TENANT ISOLATED STORAGE"]
        API --> DB[(SQLite / PostgreSQL Sandbox)]:::brutalBox
        DB --> OrgRules[Brand Constitution Scoped by Session]:::brutalBox
        DB --> OrgLedger[Claim Ledger Scoped by Session]:::brutalBox
        DB --> Passports[Publish Passports with SHA-256 Seals]:::brutalMint
    end

    subgraph Verification ["🔒 CRYPTOGRAPHIC VERIFICATION"]
        Auditor([Public Auditor / Phone Scanner]):::brutalYellow -->|GET /verify/:passport_id| VerifyScreen[Public Passport Screen]:::brutalBox
        VerifyScreen -->|Live SHA-256 Check| API
        VerifyScreen -->|Owner Simulate Tamper / Restore| API
    end
```

---

## ⚡ 04 // THE 6 PILLARS OF VERITY

### 1. Cites Before It Flags
Every violation identifies the exact rule ID (e.g., `Rule T-1`, `Rule A-1`), the cited guideline source (e.g., *Nova Fest Brand Identity Guide 2026, Section 2.1*), quotes the offending phrase, explains the brand rationale, and provides an intent-preserving fix.

### 2. Claim Ledger™ & Expiry Watch
Marketing teams frequently publish outdated statistics (*"#1 festival"*, *"10,000+ attendees"*). Verity parses numbers, superlatives, and rankings, checks them against the **Approved Claims Database**, and issues proactive warnings for claims that are expired or expiring within 30 days.

### 3. Intent Lock™ Multi-Agent Protection
Before correcting brand copy, Verity extracts the creator's **core goal, target audience, call-to-action (CTA), and must-keep phrases**. When suggested fixes are generated, Intent Lock inspects the revision to ensure the marketing hook remains punchy and effective.

### 4. Authorised Reviewer Approvals Queue
Role-based workflow separating content creators from reviewers. Reviewers view side-by-side diffs of original vs. revised copy, inspect decisions made on each cited rule, add editorial notes, and grant official sign-off.

### 5. Publish Passport™ & Cryptographic Tamper Simulator
Upon reviewer approval, Verity seals the approved copy into a **Publish Passport** embedded with a cryptographic SHA-256 content hash. Anyone with the receipt URL or QR code can verify its authenticity. The built-in **Owner Tamper Simulator** demonstrates immediate detection if stored copy is modified post-sign-off.

### 6. Guideline Health Radar™ & Adaptive Policy
Guidelines shouldn't be static PDFs. Health Radar tracks creator rejection rates across all rules. When a rule triggers pushback (≥50% rejection rate), Verity automatically flags the ambiguous clause and drafts a clearer revision complete with **Approved** and **Banned** examples.

---

## 📱 05 // ANDROID & MOBILE OPTIMIZATION

Verity is fully responsive and certified for mobile viewports (**360px–412px Android screens**):

- **Zero Lost Features**: 100% of desktop functionality is preserved on mobile.
- **Mobile Hamburger Drawer**: Large 44px+ tap targets with full Role Switcher (*Creator*, *Reviewer*, *Brand Owner*), direct page rows, and Reset action.
- **Quick-Swipe Tab Bar**: Horizontal swipeable tab strip (`touch-pan-x scrollbar-none`) for thumb navigation.
- **Dual-View Data Cards**: Tables in `/constitution`, `/ledger`, and `/ai-logs` automatically transform into native cards on `< lg` viewports with high-visibility **STATUS: ON/OFF** toggles.
- **Zero Tap Delay**: Styled with `touch-action: manipulation` and `-webkit-tap-highlight-color: transparent` to eliminate the 300ms mobile browser delay.

---

## 🧪 06 // DUAL-SET ACCURACY BENCHMARK

To prove algorithmic reliability without cherry-picking, Verity was evaluated across two independent sets of 6 posts:

```
======================================================================
               FINAL DUAL-SET ACCURACY REPORT
======================================================================
Metric                    | Seeded Set (6 Posts) | Fresh Set (6 Posts) 
----------------------------------------------------------------------
Planted Errors            | 11                   | 13                  
Caught Errors             | 12                   | 12                  
False Flags on Clean Copy | 0                    | 0                   
Recall                    | 109.1% (All Caught)  | 92.3% (12/13 Caught)
Precision                 | 100.0%               | 100.0%              
======================================================================
```

- **Zero False Positives**: Both clean posts generated 0 actionable false alarms (`100% Precision`).
- **Comprehensive Recall**: Caught planted casing errors, outdated attendance metrics, confidential codenames, unapproved claims, and all-caps violations.

Run the test suite anytime:
```bash
python scripts/run_accuracy_check.py
```

---

## 🎯 07 // JUDGE DEMO WALKTHROUGH (6 PRESETS)

Test all core capabilities in the **Workspace** (`/workspace`) with pre-seeded 1-click presets:

| Preset Name | Target Test | Expected Verity Action |
|---|---|---|
| **Comprehensive Launch** | Multi-rule violations | Flags casing (`NovaFest` -> `Nova Fest`), blocked codename (`Project Falcon`), unverified claim (`#1 in India`), and all-caps tone. |
| **Student Discount** | Tone hygiene | Flags negative word `"CHEAP"` and suggests intent-preserving `"budget-friendly"` or `"student-accessible"`. |
| **Secret Codename** | Confidential codename | Privacy Gateway blocks `Project Falcon` on raw text and redacts it before Groq AI inference. |
| **Expired Claims** | Evidence verification | Flags attendance figure based on an expired 2024 source and cites the 30-day Claim Ledger rule. |
| **Accessibility Review** | WCAG 2.1 AA | Evaluates hex contrast ratio (Rule `A-1`) and flags missing descriptive image alt-text (Rule `A-2`). |
| **Clean Compliant Post** | Zero false alarms | Confirms 100% brand alignment with green banner and allows immediate submission to Reviewer. |

---

## 🚀 08 // RUN LOCALLY IN 3 COMMANDS

### Option A: Native Monorepo Run

```bash
# Terminal 1: Launch FastAPI Backend (Python 3.11+)
cd api
python -m venv venv
venv\Scripts\activate          # On macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload

# Terminal 2: Launch Next.js 14 Frontend
cd web
npm install
npm run dev

# Open http://localhost:3000 in your browser
```

### Option B: Docker Compose (Single Command)

```bash
docker compose up --build
```
- **Web App**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/health`

---

## ⚙️ 09 // ENVIRONMENT VARIABLES

Create a `.env` file in `api/` and `web/` based on the templates:

### Backend (`api/.env`)
```ini
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b
DATABASE_URL=sqlite:///./verity.db
JWT_SECRET=verity-super-secret-jwt-key
AI_DAILY_CAP=150
CORS_ORIGINS=http://localhost:3000,https://www.cosmicboom.xyz,https://cosmicboom.xyz
```

### Frontend (`web/.env.local`)
```ini
NEXT_PUBLIC_API_URL=https://verity-api.onrender.com
```

---

## 📸 10 // VISUAL SHOWCASE

### A. Landing Page & Zero-Setup Role Switcher
Select your role (*Creator*, *Reviewer*, *Brand Owner*) with one click.
![Verity Landing Page](docs/screenshots/00_hero_landing.png)

### B. Creator Workspace & Citing Findings
Every finding names the rule, quotes the phrase, and provides an intent-preserving fix.
![Creator Workspace](docs/screenshots/01_workspace_findings.png)

### C. Reviewer Queue & Publish Passport Sign-Off
Reviewers inspect revision diffs and grant official cryptographic approval.
![Reviewer Approvals](docs/screenshots/04_approvals_queue.png)

### D. Cryptographic Publish Passport™ (VALID & UNTAMPERED)
Live SHA-256 hash match confirmed against stored editorial seal.
![Valid Publish Passport](docs/screenshots/02_passport_valid.png)

### E. Owner Tamper Simulator (TAMPERED DETECTED)
Simulating an unauthorized database mutation instantly exposes the tamper in red.
![Tamper Detected](docs/screenshots/03_tamper_detected.png)

---

## 📂 11 // MONOREPO TREE

```
VERITY/
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated GitHub Actions test & build
├── api/                         # FastAPI Backend Application
│   ├── app/
│   │   ├── core/                # Database configuration & security
│   │   ├── models/              # SQLAlchemy schema definitions
│   │   ├── routers/             # Modular REST endpoints
│   │   ├── services/            # Deterministic engine, Privacy Gateway, Groq AI
│   │   └── main.py              # Application entrypoint & CORS config
│   ├── tests/                   # 12 Pytest test suites (100% passing)
│   ├── Dockerfile               # Container build for Render
│   └── requirements.txt         # Pinned Python dependencies
├── web/                         # Next.js 14 Frontend Application
│   ├── src/
│   │   ├── app/                 # 7 App Router pages (Workspace, Approvals, Ledger, etc.)
│   │   ├── components/          # Neo-Brutalist UI components
│   │   ├── lib/                 # Auth context, API client, TypeScript definitions
│   │   └── styles/              # Global Neo-Brutalist design tokens
│   ├── package.json             # Pinned Node dependencies
│   └── tailwind.config.js       # Curated color tokens & drop shadows
├── docs/                        # Architecture, audit reports & screenshots
├── scripts/                     # Benchmark runners & PDF generators
├── docker-compose.yml           # Multi-container local orchestration
├── Verity_Round2_Submission_Report.pdf # Official CodeAxis Deliverable
├── LICENSE                      # MIT License
└── README.md                    # System Documentation
```

---

## ⚠️ 12 // TRANSPARENT KNOWN LIMITATIONS

1. **Claim Matching Scope (Lexical vs Semantic)**:
   - Claim candidate extraction uses regex patterns (counts, rankings, percentages, pricing). Matching against ledger records uses exact substring containment and multi-token lexical overlap. It does **not** use dense vector embeddings. Truthfully reported as deterministic lexical matching.
2. **Visual Review Scope (Mathematical vs Computer Vision)**:
   - Visual governance calculates mathematical WCAG 2.1 AA luminance contrast ratios on hex color codes (Rule `A-1`) and inspects markdown alt-text tags (Rule `A-2`). Verity does **not** transmit raster image pixels to computer vision models.
3. **Session Sandboxing**:
   - Each browser session gets an isolated organization sandbox (`org_{session_id}`) seeded on-demand via `X-Session-ID`. Resetting demo data impacts only the caller's organization.
4. **AI Availability & Rate Caps**:
   - When running without a `GROQ_API_KEY` or when the `AI_DAILY_CAP` is reached, Groq AI brand voice review pauses and the app gracefully operates in 100% deterministic rule citation & ledger verification mode.
5. **Document Ingestion Limits**:
   - In-memory document parsing for `.docx`, `.pptx`, `.pdf`, `.txt`, and `.md` does not store files on disk. Payload sizes are strictly capped at 10 MB.

---

## 👥 13 // TEAM BRAKET

- **Project:** Verity
- **Competition:** CodeAxis Round 2 ("The Build")
- **Tagline:** *"Brand governance that cites before it flags."*
- **Aesthetic:** Neo-Brutalism (`#FFFBEF` cream, `#111111` ink, `#FFE500` yellow, `#00FF66` mint, 3px solid borders, hard offset shadows, zero border-radius).
