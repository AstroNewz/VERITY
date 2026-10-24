"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Compass, 
  CheckCircle2, 
  ShieldCheck, 
  Scale, 
  Activity, 
  Lock,
  Layers,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Play
} from "lucide-react";

export type TourTrack = "all" | "creator" | "reviewer" | "owner";

export interface TourStep {
  id: string;
  targetId: string;
  path: string;
  track: TourTrack;
  role: "creator" | "reviewer" | "owner";
  badge: string;
  title: string;
  whyItMatters: string;
  howToTest: string;
}

const CREATOR_STEPS: TourStep[] = [
  {
    id: "cr-1",
    targetId: "tour-creator-card",
    path: "/",
    track: "creator",
    role: "creator",
    badge: "CREATOR TRACK // 1 OF 7",
    title: "1. Creator Role: Pre-Publication Safety Net",
    whyItMatters: "Content creators often produce promotional copy in silos without knowing all 50+ brand rules. Verity provides an instant, pre-publication governance net before any social blunders happen.",
    howToTest: "Click 'Next Step' or click 'Enter Workspace' to enter the creator drafting workspace.",
  },
  {
    id: "cr-2",
    targetId: "tour-presets-bar",
    path: "/workspace",
    track: "creator",
    role: "creator",
    badge: "CREATOR TRACK // 2 OF 7",
    title: "2. Load Seed Judge Scenarios (1-Click)",
    whyItMatters: "No manual typing needed during judging. Verity ships with 6 pre-seeded real-world festival scenarios with intentional casing errors, expired attendance claims, and confidential codenames.",
    howToTest: "Click the dropdown to select a preset (e.g. 'Nova Fest Launch Announcement' or 'Spring Gala Concert') to auto-populate copy.",
  },
  {
    id: "cr-3",
    targetId: "tour-editor-box",
    path: "/workspace",
    track: "creator",
    role: "creator",
    badge: "CREATOR TRACK // 3 OF 7",
    title: "3. Draft Editor & Multi-Format Ingestion",
    whyItMatters: "Creators can paste raw drafts directly or upload TXT, DOCX, PPTX, or PDF files. Verity extracts clean text while calculating real-time character and word counts.",
    howToTest: "Type, edit, or upload any campaign copy into the text area. Auto-save ensures work is never lost.",
  },
  {
    id: "cr-4",
    targetId: "tour-run-check-btn",
    path: "/workspace",
    track: "creator",
    role: "creator",
    badge: "CREATOR TRACK // 4 OF 7",
    title: "4. Run Verity Governance Check",
    whyItMatters: "Executes a sub-second, multi-stage pipeline: deterministic regex rules first, Claim Ledger database verification second, PII & codename redaction third, and Groq LLM tone evaluation fourth.",
    howToTest: "Click 'RUN VERITY GOVERNANCE CHECK'. Analysis completes in sub-second time with cited findings.",
  },
  {
    id: "cr-5",
    targetId: "tour-findings-panel",
    path: "/workspace",
    track: "creator",
    role: "creator",
    badge: "CREATOR TRACK // 5 OF 7",
    title: "5. Citations Before Flags (The Core Innovation)",
    whyItMatters: "Generic AI linters give vague advice. Verity cites the exact rule ID (e.g. Rule T-1) and brand book page for every violation, explaining exactly why it breaches policy.",
    howToTest: "Inspect the findings cards. Notice how each card lists Rule ID, Severity, Department, and the official source citation.",
  },
  {
    id: "cr-6",
    targetId: "tour-findings-panel",
    path: "/workspace",
    track: "creator",
    role: "creator",
    badge: "CREATOR TRACK // 6 OF 7",
    title: "6. Creator Autonomy: Accept Fix vs Reject",
    whyItMatters: "Humans always make the final call. Creators can click 'Accept Fix' to apply a suggested rewrite, or 'Reject' to preserve their raw copy. Verity records decisions for audit without blocking creativity.",
    howToTest: "Click 'Accept Fix' on any finding to auto-update the revised copy, or click 'Reject' to log a creative override.",
  },
  {
    id: "cr-7",
    targetId: "tour-submit-approval-btn",
    path: "/workspace",
    track: "creator",
    role: "creator",
    badge: "CREATOR TRACK // 7 OF 7",
    title: "7. Submit for Reviewer Approval",
    whyItMatters: "Creates a formal boundary between creative copy generation and editorial sign-off. Submits the draft along with full decision history and Intent Lock status into the Reviewer's queue.",
    howToTest: "Click 'SUBMIT FOR REVIEWER APPROVAL' to hand off your revised draft to the editorial queue.",
  },
];

const REVIEWER_STEPS: TourStep[] = [
  {
    id: "rev-1",
    targetId: "tour-submissions-queue",
    path: "/approvals",
    track: "reviewer",
    role: "reviewer",
    badge: "REVIEWER TRACK // 1 OF 6",
    title: "1. Editorial Approvals Queue",
    whyItMatters: "Reviewers have a centralized inbox of all incoming student and campaign drafts with pending status, creation timestamps, and priority tags.",
    howToTest: "Click on any submission in the left queue to inspect its contents and governance decisions.",
  },
  {
    id: "rev-2",
    targetId: "tour-side-by-side-diff",
    path: "/approvals",
    track: "reviewer",
    role: "reviewer",
    badge: "REVIEWER TRACK // 2 OF 6",
    title: "2. Side-By-Side Revision Diff & Intent Lock",
    whyItMatters: "Inspect original copy vs revised copy side-by-side. The 'INTENT PRESERVED' chip guarantees that brand fixes did not soften or destroy creator excitement.",
    howToTest: "Compare the original raw text with the revised copy in the mint container.",
  },
  {
    id: "rev-3",
    targetId: "tour-findings-decision-log",
    path: "/approvals",
    track: "reviewer",
    role: "reviewer",
    badge: "REVIEWER TRACK // 3 OF 6",
    title: "3. Governance Decisions Audit Trail",
    whyItMatters: "Reviewers see every single decision the creator made (ACCEPTED / REJECTED) on each cited rule, ensuring zero rogue overrides go unnoticed.",
    howToTest: "Scroll the findings log to verify that all critical terminology and claims citations were addressed.",
  },
  {
    id: "rev-4",
    targetId: "tour-request-changes-btn",
    path: "/approvals",
    track: "reviewer",
    role: "reviewer",
    badge: "REVIEWER TRACK // 4 OF 6",
    title: "4. Editorial Feedback & Request Changes",
    whyItMatters: "If a draft fails policy or the creator rejected a critical rule without justification, reviewers can request changes with constructive notes instead of a flat rejection.",
    howToTest: "Type editorial feedback into the notes box and click 'Request Changes' to return the draft to the creator.",
  },
  {
    id: "rev-5",
    targetId: "tour-approve-passport-btn",
    path: "/approvals",
    track: "reviewer",
    role: "reviewer",
    badge: "REVIEWER TRACK // 5 OF 6",
    title: "5. Issue Cryptographic Publish Passport™",
    whyItMatters: "Approval generates a SHA-256 cryptographic seal. The public verify page recomputes this hash to guarantee post-approval text was never tampered with.",
    howToTest: "Click 'APPROVE & ISSUE PUBLISH PASSPORT' to seal the post with confetti and generate a public receipt.",
  },
  {
    id: "rev-6",
    targetId: "tour-verify-receipt-link",
    path: "/approvals",
    track: "reviewer",
    role: "reviewer",
    badge: "REVIEWER TRACK // 6 OF 6",
    title: "6. Public Verification Receipt & Tamper Test",
    whyItMatters: "Every approved post gets a public link (/verify/[id]). Reviewers and the public can verify the cryptographic hash or test tampering live by changing a single letter.",
    howToTest: "Click 'Verify Receipt' to open the public verification page in a new tab.",
  },
];

const OWNER_STEPS: TourStep[] = [
  {
    id: "own-1",
    targetId: "tour-rules-list",
    path: "/constitution",
    track: "owner",
    role: "owner",
    badge: "BRAND OWNER TRACK // 1 OF 8",
    title: "1. Brand Constitution & Active Standards",
    whyItMatters: "Brand owners govern active standards. Every rule has an ID, specification, severity level, cited brand book source, and department owner.",
    howToTest: "Browse the active rules table showing casing standards, prohibited terms, and accessibility guidelines.",
  },
  {
    id: "own-2",
    targetId: "tour-rules-list",
    path: "/constitution",
    track: "owner",
    role: "owner",
    badge: "BRAND OWNER TRACK // 2 OF 8",
    title: "2. Live ON / OFF Rule Toggles (No Restarts)",
    whyItMatters: "Rules can be toggled live in real-time. If brand leadership relaxes a rule, creators immediately stop getting flagged without restarting the backend.",
    howToTest: "Click the 'STATUS: ON / OFF' toggle button on any rule card to instantly toggle live enforcement.",
  },
  {
    id: "own-3",
    targetId: "tour-import-guidelines",
    path: "/constitution",
    track: "owner",
    role: "owner",
    badge: "BRAND OWNER TRACK // 3 OF 8",
    title: "3. AI Guideline Parser & Auto-Extraction",
    whyItMatters: "Paste raw PDF text, committee memos, or styleguide memos. Verity automatically parses sentences into structured JSON brand rules for sign-off.",
    howToTest: "Paste any guideline excerpt into the box and click 'Parse & Propose New Rules'.",
  },
  {
    id: "own-4",
    targetId: "tour-expiry-strip",
    path: "/ledger",
    track: "owner",
    role: "owner",
    badge: "BRAND OWNER TRACK // 4 OF 8",
    title: "4. Claim Ledger™ & 30-Day Expiry Watch",
    whyItMatters: "Tracks approved metrics, attendance numbers, and rankings with expiration dates. Flags metrics expiring in < 30 days to prevent outdated claims.",
    howToTest: "Inspect the top calendar cards showing verified, expiring soon, and expired metrics.",
  },
  {
    id: "own-5",
    targetId: "tour-claims-table",
    path: "/ledger",
    track: "owner",
    role: "owner",
    badge: "BRAND OWNER TRACK // 5 OF 8",
    title: "5. Approved Claims Evidence Database",
    whyItMatters: "Central source of truth for public marketing claims. Every claim maps to an official substantiation document and verified department owner.",
    howToTest: "Inspect the claims table or click 'Add Claim Entry' to register a new approved metric.",
  },
  {
    id: "own-6",
    targetId: "tour-confidential-terms",
    path: "/ledger",
    track: "owner",
    role: "owner",
    badge: "BRAND OWNER TRACK // 6 OF 8",
    title: "6. Confidential Codename Guard (Rule P-1)",
    whyItMatters: "Restricted project codenames like 'Project Falcon' are blocked from public copy and redacted before any text touches external AI inference.",
    howToTest: "Review the blocked codenames and safe replacement hints managed by the brand council.",
  },
  {
    id: "own-7",
    targetId: "tour-flagged-rules",
    path: "/radar",
    track: "owner",
    role: "owner",
    badge: "BRAND OWNER TRACK // 7 OF 8",
    title: "7. Guideline Health Radar™ & Auto-Clarification",
    whyItMatters: "When creator rejection rates hit ≥50%, the rule is flagged as ambiguous. Verity automatically generates clarified wording with allowed & banned examples.",
    howToTest: "Inspect the high-rejection rule card and click 'Approve Clause & Bump Version' to adapt policy.",
  },
  {
    id: "own-8",
    targetId: "tour-privacy-card",
    path: "/ai-logs",
    track: "owner",
    role: "owner",
    badge: "BRAND OWNER TRACK // 8 OF 8",
    title: "8. Zero-Leakage Privacy Gateway Audit",
    whyItMatters: "Provides complete transparency: logs every external AI model dispatch, timestamp, purpose, and exact count of redacted confidential tokens.",
    howToTest: "Inspect the prompt audit trail confirming zero raw PII or secret codenames were sent to external LLMs.",
  },
];

const COMBINED_ALL_STEPS: TourStep[] = [
  ...CREATOR_STEPS,
  ...REVIEWER_STEPS,
  ...OWNER_STEPS,
];

interface TourContextType {
  isActive: boolean;
  activeTrack: TourTrack;
  currentStepIndex: number;
  currentStep: TourStep | null;
  totalStepsInTrack: number;
  startTour: (track?: TourTrack) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  switchTrack: (track: TourTrack) => void;
}

const TourContext = createContext<TourContextType>({
  isActive: false,
  activeTrack: "all",
  currentStepIndex: 0,
  currentStep: null,
  totalStepsInTrack: 0,
  startTour: () => {},
  nextStep: () => {},
  prevStep: () => {},
  skipTour: () => {},
  switchTrack: () => {},
});

export function useTour() {
  return useContext(TourContext);
}

export function TourProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { loginAsRole, role } = useAuth();

  const [isActive, setIsActive] = useState(false);
  const [activeTrack, setActiveTrack] = useState<TourTrack>("all");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const getStepsForTrack = (track: TourTrack): TourStep[] => {
    switch (track) {
      case "creator":
        return CREATOR_STEPS;
      case "reviewer":
        return REVIEWER_STEPS;
      case "owner":
        return OWNER_STEPS;
      case "all":
      default:
        return COMBINED_ALL_STEPS;
    }
  };

  const steps = getStepsForTrack(activeTrack);
  const currentStep = steps[currentStepIndex] || null;

  // Start Tour for a specific role track or all
  const startTour = useCallback((track: TourTrack = "all") => {
    setActiveTrack(track);
    setCurrentStepIndex(0);
    setIsActive(true);
    const targetSteps = getStepsForTrack(track);
    const firstStep = targetSteps[0];
    if (firstStep) {
      loginAsRole(firstStep.role);
      if (pathname !== firstStep.path) {
        router.push(firstStep.path);
      }
    }
  }, [pathname, loginAsRole, router]);

  // Switch Track directly within tour
  const switchTrack = useCallback((newTrack: TourTrack) => {
    setActiveTrack(newTrack);
    setCurrentStepIndex(0);
    const targetSteps = getStepsForTrack(newTrack);
    const firstStep = targetSteps[0];
    if (firstStep) {
      loginAsRole(firstStep.role);
      if (pathname !== firstStep.path) {
        router.push(firstStep.path);
      }
    }
  }, [pathname, loginAsRole, router]);

  // Skip / Close Tour
  const skipTour = useCallback(() => {
    setIsActive(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("verity_tour_completed", "true");
    }
  }, []);

  // Next Step
  const nextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      const nextStp = steps[nextIdx];
      setCurrentStepIndex(nextIdx);
      if (nextStp.role !== role) {
        loginAsRole(nextStp.role);
      }
      if (nextStp.path !== pathname) {
        router.push(nextStp.path);
      }
    } else {
      skipTour();
    }
  }, [currentStepIndex, steps, role, pathname, loginAsRole, router, skipTour]);

  // Previous Step
  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      const prevStp = steps[prevIdx];
      setCurrentStepIndex(prevIdx);
      if (prevStp.role !== role) {
        loginAsRole(prevStp.role);
      }
      if (prevStp.path !== pathname) {
        router.push(prevStp.path);
      }
    }
  }, [currentStepIndex, steps, role, pathname, loginAsRole, router]);

  // Keyboard navigation (Escape to skip, Arrows for next/prev)
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        skipTour();
      } else if (e.key === "ArrowRight") {
        nextStep();
      } else if (e.key === "ArrowLeft") {
        prevStep();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, nextStep, prevStep, skipTour]);

  // Target element spotlight calculation & scrolling
  useEffect(() => {
    if (!isActive || !currentStep) return;

    let attempts = 0;
    const findTarget = () => {
      const el = document.getElementById(currentStep.targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        setTargetRect(null);
      }
      attempts++;
    };

    findTarget();
    // Continuous polling every 150ms for up to 4s to ensure target is found during route transitions
    const interval = setInterval(() => {
      findTarget();
      if (attempts > 25) clearInterval(interval);
    }, 150);

    const handleUpdate = () => findTarget();
    window.addEventListener("resize", handleUpdate);
    window.addEventListener("scroll", handleUpdate, true);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("scroll", handleUpdate, true);
    };
  }, [isActive, currentStepIndex, activeTrack, pathname, currentStep]);

  // Smart placement for desktop card: if target is on right half, put card on left
  const isTargetOnRight = targetRect ? targetRect.left > (typeof window !== "undefined" ? window.innerWidth / 2 : 700) : false;

  return (
    <TourContext.Provider
      value={{
        isActive,
        activeTrack,
        currentStepIndex,
        currentStep,
        totalStepsInTrack: steps.length,
        startTour,
        nextStep,
        prevStep,
        skipTour,
        switchTrack,
      }}
    >
      {children}

      {/* Spotlight Tour Overlay & Guidance Card */}
      {isActive && currentStep && (
        <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-auto">
          {/* Translucent Backdrop: darkens the entire page */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              targetRect ? "bg-transparent" : "bg-ink/80"
            }`}
          />

          {/* Dynamic Spotlight Bounding Ring & Cutout Shadow */}
          {targetRect && (
            <div
              style={{
                top: `${Math.max(4, targetRect.top - 6)}px`,
                left: `${Math.max(4, targetRect.left - 6)}px`,
                width: `${targetRect.width + 12}px`,
                height: `${targetRect.height + 12}px`,
              }}
              className="absolute pointer-events-none border-4 border-yellow ring-4 ring-ink ring-offset-2 ring-offset-white z-[101] shadow-[0_0_0_9999px_rgba(17,17,17,0.80)] transition-all duration-300"
            />
          )}

          {/* Neo-Brutalist Tour Guidance Card */}
          <div
            className={`absolute inset-x-3 bottom-3 sm:bottom-auto sm:inset-x-auto max-w-lg lg:max-w-xl z-[105] pointer-events-auto transition-all duration-300 ${
              isTargetOnRight ? "sm:left-6 sm:top-20" : "sm:right-6 sm:top-20"
            }`}
          >
            <div className="brutal-card p-4 sm:p-6 bg-white border-4 border-ink shadow-brutal-xl space-y-3.5 max-h-[85vh] overflow-y-auto">
              {/* Header: Track Selector Tabs & Dismiss Button */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink pb-3">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[10px] font-mono font-bold uppercase text-gray-500 mr-1 hidden sm:inline">
                    SELECT TRACK:
                  </span>
                  {[
                    { id: "all", label: "All Roles" },
                    { id: "creator", label: "Creator" },
                    { id: "reviewer", label: "Reviewer" },
                    { id: "owner", label: "Owner" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => switchTrack(t.id as TourTrack)}
                      className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase border-2 transition-all ${
                        activeTrack === t.id
                          ? "bg-yellow text-ink border-ink shadow-brutal-sm font-black"
                          : "border-gray-300 text-gray-600 hover:border-ink hover:text-ink bg-white"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={skipTour}
                  className="px-2 py-1 hover:bg-danger hover:text-white border border-gray-300 hover:border-ink text-[11px] font-mono font-bold uppercase transition-colors flex items-center gap-1"
                  title="Close tour (Esc)"
                >
                  <span>Skip</span>
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>

              {/* Step Badge & Title */}
              <div>
                <span className="brutal-badge bg-yellow text-ink text-[10px] mb-1.5 inline-block font-mono font-bold">
                  {currentStep.badge}
                </span>
                <h3 className="font-heading font-black text-base sm:text-lg text-ink uppercase tracking-tight">
                  {currentStep.title}
                </h3>
              </div>

              {/* The "Why It Matters" Explanation Box */}
              <div className="p-3 bg-cream border-2 border-ink space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-gray-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-pink-600 stroke-[2.5]" />
                  WHY THIS MATTERS (THE DIFFERENTIATOR):
                </span>
                <p className="font-mono text-xs text-gray-800 leading-relaxed">
                  {currentStep.whyItMatters}
                </p>
              </div>

              {/* The "How to Test" Action Hint Box */}
              <div className="p-2.5 bg-mint-light border-2 border-mint-dark text-xs font-mono font-bold text-emerald-950 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5 stroke-[2.5]" />
                <span>{currentStep.howToTest}</span>
              </div>

              {/* Navigation Controls Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t-2 border-ink">
                {/* Progress Indicators */}
                <div className="flex items-center gap-1 font-mono text-xs font-bold">
                  {steps.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-2 border border-ink transition-all ${
                        idx === currentStepIndex
                          ? "bg-yellow w-5"
                          : idx < currentStepIndex
                          ? "bg-mint w-2"
                          : "bg-gray-200 w-2"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-[10px] text-gray-500">
                    Step {currentStepIndex + 1} of {steps.length}
                  </span>
                </div>

                {/* Back & Next Action Buttons */}
                <div className="flex items-center gap-2">
                  {currentStepIndex > 0 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="brutal-btn brutal-btn-white text-xs py-1.5 px-3 border-2 min-h-[38px] flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={nextStep}
                    className="brutal-btn brutal-btn-yellow text-xs py-1.5 px-4 shadow-brutal-btn min-h-[38px] flex items-center gap-1.5 font-bold"
                  >
                    <span>
                      {currentStepIndex === steps.length - 1
                        ? "Finish Tour"
                        : "Next Step"}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </TourContext.Provider>
  );
}
