"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { Role } from "@/lib/types";
import { 
  ShieldCheck, 
  ArrowRight, 
  BookOpen, 
  Scale, 
  Lock, 
  Award, 
  Activity, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  Zap
} from "lucide-react";

export default function LandingPage() {
  const { loginAsRole, role } = useAuth();
  const router = useRouter();

  const handleStartRole = async (targetRole: Role, destination: string) => {
    await loginAsRole(targetRole);
    router.push(destination);
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-left space-y-6 max-w-4xl">
        <div className="inline-block transform -rotate-1">
          <span className="brutal-badge bg-yellow text-ink border-3 text-xs sm:text-sm px-3 py-1 shadow-brutal-btn">
            ★ CODEAXIS ROUND 2 — TEAM BRAKET ★
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-ink leading-[1.05]">
          BRAND GOVERNANCE THAT{" "}
          <span className="bg-yellow px-2 py-0.5 border-b-4 border-ink inline-block">
            CITES BEFORE IT FLAGS.
          </span>
        </h1>

        <p className="text-lg sm:text-xl font-sans text-gray-800 leading-relaxed max-w-2xl">
          Verity reviews content before publication. Every finding names the rule or approved source it breaks, explains why, and suggests an intent-preserving fix.{" "}
          <strong className="underline decoration-yellow decoration-4">Humans always make the final call.</strong>
        </p>

        {/* 1-Click Role Selection Card */}
        <div className="brutal-card p-6 sm:p-8 bg-white max-w-3xl mt-8">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-ink">
            <Zap className="w-5 h-5 text-yellow fill-yellow stroke-ink stroke-[2]" />
            <h2 className="font-heading font-black text-xl tracking-tight uppercase">
              Zero-Setup Demo: Choose Your Role
            </h2>
          </div>

          <p className="text-xs font-mono text-gray-600 mb-6">
            Click any role to test the complete end-to-end workflow immediately with pre-seeded Nova Fest data.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Creator Card */}
            <button
              type="button"
              onClick={() => handleStartRole("creator", "/workspace")}
              className="brutal-card p-5 text-left bg-yellow hover:translate-x-1 hover:-translate-y-1 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="brutal-chip bg-white text-ink text-[10px] mb-2 inline-block">
                  CREATOR
                </span>
                <h3 className="font-heading font-black text-lg text-ink uppercase mb-1">
                  Draft & Revise
                </h3>
                <p className="text-xs font-mono text-gray-800 mb-4">
                  Paste drafts, see citations, accept/reject fixes, protect Intent Lock.
                </p>
              </div>
              <div className="flex items-center gap-1 font-mono font-bold text-xs uppercase group-hover:translate-x-1 transition-transform">
                <span>Enter Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* Reviewer Card */}
            <button
              type="button"
              onClick={() => handleStartRole("reviewer", "/approvals")}
              className="brutal-card p-5 text-left bg-periwinkle hover:translate-x-1 hover:-translate-y-1 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="brutal-chip bg-white text-ink text-[10px] mb-2 inline-block">
                  REVIEWER
                </span>
                <h3 className="font-heading font-black text-lg text-ink uppercase mb-1">
                  Approve & Issue
                </h3>
                <p className="text-xs font-mono text-gray-800 mb-4">
                  Inspect revision diffs, approve drafts, issue SHA-256 Publish Passports.
                </p>
              </div>
              <div className="flex items-center gap-1 font-mono font-bold text-xs uppercase group-hover:translate-x-1 transition-transform">
                <span>Open Approvals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* Brand Owner Card */}
            <button
              type="button"
              onClick={() => handleStartRole("owner", "/constitution")}
              className="brutal-card p-5 text-left bg-pink hover:translate-x-1 hover:-translate-y-1 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="brutal-chip bg-white text-ink text-[10px] mb-2 inline-block">
                  BRAND OWNER
                </span>
                <h3 className="font-heading font-black text-lg text-ink uppercase mb-1">
                  Govern & Clarify
                </h3>
                <p className="text-xs font-mono text-gray-800 mb-4">
                  Manage Constitution, Claim Ledger, Health Radar & versioning.
                </p>
              </div>
              <div className="flex items-center gap-1 font-mono font-bold text-xs uppercase group-hover:translate-x-1 transition-transform">
                <span>Brand Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="stripe-divider my-10" />

      {/* Product Pillars Grid */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-500">
            ENGINE CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black uppercase text-ink mt-1">
            Engineered For Reliability & Trust
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1: Citation First */}
          <div className="brutal-card p-6 bg-white space-y-3">
            <div className="w-10 h-10 bg-yellow border-2 border-ink flex items-center justify-center font-bold shadow-brutal-sm">
              <BookOpen className="w-5 h-5 text-ink" />
            </div>
            <h3 className="font-heading font-black text-lg uppercase">
              1. Cites Before It Flags
            </h3>
            <p className="text-xs font-mono text-gray-700 leading-relaxed">
              No arbitrary "AI said so". Every finding quotes the exact rule ID (e.g. Rule T-1), official brand book page, or Claim Ledger citation.
            </p>
          </div>

          {/* Feature 2: Claim Ledger */}
          <div className="brutal-card p-6 bg-white space-y-3">
            <div className="w-10 h-10 bg-mint border-2 border-ink flex items-center justify-center font-bold shadow-brutal-sm">
              <Scale className="w-5 h-5 text-ink" />
            </div>
            <h3 className="font-heading font-black text-lg uppercase">
              2. Claim Ledger™
            </h3>
            <p className="text-xs font-mono text-gray-700 leading-relaxed">
              Detects rankings, attendance numbers, and superlatives. Cites approved evidence and flags expired or expiring claims (&lt; 30 days).
            </p>
          </div>

          {/* Feature 3: Intent Lock */}
          <div className="brutal-card p-6 bg-white space-y-3">
            <div className="w-10 h-10 bg-periwinkle border-2 border-ink flex items-center justify-center font-bold shadow-brutal-sm">
              <Lock className="w-5 h-5 text-ink" />
            </div>
            <h3 className="font-heading font-black text-lg uppercase">
              3. Intent Lock™
            </h3>
            <p className="text-xs font-mono text-gray-700 leading-relaxed">
              Extracts creator goal, audience, and must-keep terms before suggesting rewrites. Re-checks revisions to ensure marketing intent is never warped.
            </p>
          </div>

          {/* Feature 4: Publish Passport */}
          <div className="brutal-card p-6 bg-white space-y-3">
            <div className="w-10 h-10 bg-pink border-2 border-ink flex items-center justify-center font-bold shadow-brutal-sm">
              <Award className="w-5 h-5 text-ink" />
            </div>
            <h3 className="font-heading font-black text-lg uppercase">
              4. Publish Passport™
            </h3>
            <p className="text-xs font-mono text-gray-700 leading-relaxed">
              Upon reviewer approval, creates a cryptographic SHA-256 seal. Public verify page recomputes hash to guarantee zero post-approval tampering.
            </p>
          </div>

          {/* Feature 5: Health Radar */}
          <div className="brutal-card p-6 bg-white space-y-3">
            <div className="w-10 h-10 bg-cream border-2 border-ink flex items-center justify-center font-bold shadow-brutal-sm">
              <Activity className="w-5 h-5 text-ink" />
            </div>
            <h3 className="font-heading font-black text-lg uppercase">
              5. Guideline Health Radar
            </h3>
            <p className="text-xs font-mono text-gray-700 leading-relaxed">
              Flags ambiguous rules with high creator reject rates (≥50%). Automatically drafts clarified clauses with approved & banned examples.
            </p>
          </div>

          {/* Feature 6: Privacy Gateway */}
          <div className="brutal-card p-6 bg-white space-y-3">
            <div className="w-10 h-10 bg-gray-100 border-2 border-ink flex items-center justify-center font-bold shadow-brutal-sm">
              <EyeOff className="w-5 h-5 text-ink" />
            </div>
            <h3 className="font-heading font-black text-lg uppercase">
              6. Privacy Gateway
            </h3>
            <p className="text-xs font-mono text-gray-700 leading-relaxed">
              Redacts confidential project codenames, emails, and phone numbers before any external LLM call. Restores original tokens safely in suggestions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
