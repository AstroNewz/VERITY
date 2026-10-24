"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  HelpCircle, 
  CheckCircle2, 
  Compass,
  Play
} from "lucide-react";

export interface TourStep {
  id: string;
  targetId: string;
  path: string;
  badge: string;
  title: string;
  description: string;
  actionHint?: string;
  roleToSet?: "creator" | "reviewer" | "owner";
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "step-start-creator",
    targetId: "tour-creator-card",
    path: "/",
    badge: "STEP 1 OF 6 // CHOOSE ROLE",
    title: "1. Start As Creator: Draft & Revise",
    description: "Click here to enter the Creator Workspace. This is where creative teams paste draft promotional copy, upload campaign documents, and get real-time citations before publishing.",
    actionHint: "Click 'Next Step' or tap 'Draft & Revise' below to enter the workspace.",
    roleToSet: "creator",
  },
  {
    id: "step-pick-preset",
    targetId: "tour-presets-bar",
    path: "/workspace",
    badge: "STEP 2 OF 6 // 1-CLICK PRESETS",
    title: "2. Load A Judge Preset (No Typing Needed)",
    description: "Click any pre-seeded scenario like 'Nova Fest Launch Announcement' or 'Secret Codename' to instantly populate festival copy containing realistic brand violations.",
    actionHint: "Click 'Next Step' to inspect the Governance Check action.",
  },
  {
    id: "step-run-check",
    targetId: "tour-run-check-btn",
    path: "/workspace",
    badge: "STEP 3 OF 6 // RUN VERITY ENGINE",
    title: "3. Run Verity Governance Check",
    description: "Click this button to trigger the analysis! Verity runs deterministic rules, checks the Claim Ledger for outdated attendance numbers, tokenizes PII, and invokes Groq AI.",
    actionHint: "Click 'Next Step' to review the findings and suggested fixes.",
  },
  {
    id: "step-findings-panel",
    targetId: "tour-findings-panel",
    path: "/workspace",
    badge: "STEP 4 OF 6 // CITED FINDINGS & FIXES",
    title: "4. Inspect Cited Rules & Accept Fixes",
    description: "Every finding quotes the exact rule ID (e.g. Rule T-1) and brand book page. Click 'Accept Fix' to apply intent-preserving rewrites, or 'Reject' to keep original phrasing.",
    actionHint: "Intent Lock™ verifies that marketing goals are preserved.",
  },
  {
    id: "step-submit-review",
    targetId: "tour-submit-approval-btn",
    path: "/workspace",
    badge: "STEP 5 OF 6 // EDITORIAL HANDOFF",
    title: "5. Submit For Reviewer Approval",
    description: "Once brand fixes are accepted and Intent Lock confirms 'INTENT PRESERVED', submit the draft to the Authorised Reviewer queue for official sign-off.",
    actionHint: "Click 'Next Step' to see the Reviewer Approvals Queue.",
  },
  {
    id: "step-issue-passport",
    targetId: "tour-approve-passport-btn",
    path: "/approvals",
    badge: "STEP 6 OF 6 // PUBLISH PASSPORT",
    title: "6. Approve & Issue Cryptographic Passport",
    description: "Reviewers inspect side-by-side diffs and issue a Publish Passport sealed with a SHA-256 hash. The public verify receipt proves the copy was never altered post-approval!",
    actionHint: "Congratulations! You've mastered the complete Verity workflow.",
    roleToSet: "reviewer",
  },
];

interface TourContextType {
  isActive: boolean;
  currentStepIndex: number;
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
}

const TourContext = createContext<TourContextType>({
  isActive: false,
  currentStepIndex: 0,
  startTour: () => {},
  nextStep: () => {},
  prevStep: () => {},
  skipTour: () => {},
});

export function useTour() {
  return useContext(TourContext);
}

export function TourProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const currentStep = TOUR_STEPS[currentStepIndex];

  // Start Tour
  const startTour = () => {
    setIsActive(true);
    setCurrentStepIndex(0);
    if (pathname !== "/") {
      router.push("/");
    }
  };

  // Skip / End Tour
  const skipTour = () => {
    setIsActive(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("verity_tour_dismissed", "true");
    }
  };

  // Next Step
  const nextStep = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      const nextStp = TOUR_STEPS[nextIdx];
      setCurrentStepIndex(nextIdx);
      if (nextStp.path !== pathname) {
        router.push(nextStp.path);
      }
    } else {
      skipTour();
    }
  };

  // Previous Step
  const prevStep = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      const prevStp = TOUR_STEPS[prevIdx];
      setCurrentStepIndex(prevIdx);
      if (prevStp.path !== pathname) {
        router.push(prevStp.path);
      }
    }
  };

  // Update target rect on step or route change
  useEffect(() => {
    if (!isActive || !currentStep) return;

    const findTarget = () => {
      const el = document.getElementById(currentStep.targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
        // Scroll element smoothly into center view
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        setTargetRect(null);
      }
    };

    // Retry finding element (handles client route transitions)
    findTarget();
    const timer1 = setTimeout(findTarget, 200);
    const timer2 = setTimeout(findTarget, 600);
    const timer3 = setTimeout(findTarget, 1200);

    const handleResize = () => findTarget();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize, true);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize, true);
    };
  }, [isActive, currentStepIndex, pathname]);

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStepIndex,
        startTour,
        nextStep,
        prevStep,
        skipTour,
      }}
    >
      {children}

      {/* Interactive Tour Overlay & Popover */}
      {isActive && currentStep && (
        <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-auto">
          {/* Translucent Black Backdrop */}
          <div 
            onClick={skipTour}
            className="absolute inset-0 bg-ink/75 transition-opacity duration-300"
            title="Click anywhere to skip tour"
          />

          {/* Spotlight Highlight Box around Target */}
          {targetRect && (
            <div
              style={{
                top: `${Math.max(8, targetRect.top - 6)}px`,
                left: `${Math.max(8, targetRect.left - 6)}px`,
                width: `${targetRect.width + 12}px`,
                height: `${targetRect.height + 12}px`,
              }}
              className="absolute pointer-events-none border-4 border-yellow ring-4 ring-ink ring-offset-2 ring-offset-white animate-pulse z-[101] shadow-[0_0_0_9999px_rgba(17,17,17,0.75)] transition-all duration-300"
            />
          )}

          {/* Neo-Brutalist Tour Guidance Card */}
          <div className="absolute inset-x-3 bottom-6 sm:bottom-auto sm:inset-x-auto sm:right-8 sm:top-24 max-w-lg z-[105] pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="brutal-card p-5 sm:p-6 bg-white border-4 border-ink shadow-brutal-xl space-y-4">
              {/* Header: Badge & Skip Button */}
              <div className="flex items-center justify-between gap-2 border-b-2 border-ink pb-2">
                <span className="brutal-badge bg-yellow text-ink border-2 border-ink text-[10px] font-mono font-bold">
                  {currentStep.badge}
                </span>

                <button
                  type="button"
                  onClick={skipTour}
                  className="p-1 hover:bg-gray-100 border border-transparent hover:border-ink flex items-center gap-1 text-[11px] font-mono font-bold uppercase text-gray-600 hover:text-ink min-h-[36px]"
                  title="Close tutorial"
                >
                  <span>Skip</span>
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-heading font-black text-lg sm:text-xl text-ink uppercase tracking-tight mb-2">
                  {currentStep.title}
                </h3>
                <p className="font-mono text-xs sm:text-sm text-gray-800 leading-relaxed">
                  {currentStep.description}
                </p>
              </div>

              {/* Action Hint Box */}
              {currentStep.actionHint && (
                <div className="p-2.5 bg-yellow/20 border-2 border-ink text-xs font-mono font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-ink shrink-0" />
                  <span className="text-ink">{currentStep.actionHint}</span>
                </div>
              )}

              {/* Tour Controls Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t-2 border-ink">
                {/* Step dots */}
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                  {TOUR_STEPS.map((_, idx) => (
                    <span
                      key={idx}
                      className={`w-2.5 h-2.5 border border-ink ${
                        idx === currentStepIndex
                          ? "bg-yellow w-5 transition-all"
                          : idx < currentStepIndex
                          ? "bg-mint"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-[10px] text-gray-600">
                    {currentStepIndex + 1}/{TOUR_STEPS.length}
                  </span>
                </div>

                {/* Prev & Next Buttons */}
                <div className="flex items-center gap-2">
                  {currentStepIndex > 0 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="brutal-btn brutal-btn-white text-xs py-2 px-3 border-2 min-h-[40px] flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={nextStep}
                    className="brutal-btn brutal-btn-yellow text-xs py-2 px-4 shadow-brutal-btn min-h-[40px] flex items-center gap-1.5"
                  >
                    <span>
                      {currentStepIndex === TOUR_STEPS.length - 1
                        ? "Finish Tour"
                        : "Next Step"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
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
