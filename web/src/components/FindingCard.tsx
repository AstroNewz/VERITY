"use client";

import React from "react";
import { Finding } from "@/lib/types";
import { 
  Check, 
  X, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  BookOpen, 
  Scale, 
  Sparkles, 
  Cpu, 
  ArrowRight,
  Database
} from "lucide-react";

interface FindingCardProps {
  finding: Finding;
  onDecision: (findingId: string, decision: "accept" | "reject") => void;
  onSelectFinding?: (finding: Finding) => void;
  isSelected?: boolean;
}

export default function FindingCard({
  finding,
  onDecision,
  onSelectFinding,
  isSelected,
}: FindingCardProps) {
  const isCritical = finding.severity === "critical";
  const isWarning = finding.severity === "warning";
  const isInfo = finding.severity === "info";

  const isAccepted = finding.decision === "accept";
  const isRejected = finding.decision === "reject";

  return (
    <div
      onClick={() => onSelectFinding && onSelectFinding(finding)}
      className={`brutal-card p-4 transition-all cursor-pointer relative ${
        isSelected
          ? "border-4 border-ink shadow-brutal-lg bg-cream"
          : isAccepted
          ? "bg-mint/15 border-mint-dark"
          : isRejected
          ? "opacity-60 bg-gray-50"
          : "bg-white hover:translate-x-1"
      }`}
    >
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Severity chip */}
          <span
            className={`brutal-chip text-[10px] ${
              isCritical
                ? "bg-danger text-white border-ink"
                : isWarning
                ? "bg-yellow text-ink border-ink"
                : "bg-mint text-ink border-ink"
            }`}
          >
            {isCritical && <AlertCircle className="w-3 h-3" />}
            {isWarning && <AlertTriangle className="w-3 h-3" />}
            {isInfo && <Info className="w-3 h-3" />}
            {finding.severity.toUpperCase()}
          </span>

          {/* Type chip */}
          <span className="brutal-chip bg-white text-[10px] border-ink text-gray-800">
            {finding.type.toUpperCase()}
          </span>

          {/* Origin Badge */}
          <span className="brutal-chip bg-cream text-[10px] text-gray-700 border-gray-400">
            {finding.origin === "ai" ? (
              <>
                <Sparkles className="w-2.5 h-2.5 text-pink-500" />
                GROQ AI
              </>
            ) : finding.origin === "semantic_vector" || finding.match_type === "semantic_vector" ? (
              <>
                <Database className="w-2.5 h-2.5 text-purple-600" />
                DENSE VECTOR (SEMANTIC)
              </>
            ) : (
              <>
                <Cpu className="w-2.5 h-2.5 text-blue-500" />
                DETERMINISTIC
              </>
            )}
          </span>
        </div>

        {/* Confidence Badge */}
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-gray-100 border border-ink text-ink">
          {Math.round(finding.confidence * 100)}% CONFIDENCE
        </span>
      </div>

      {/* Main Issue Message */}
      <p className="font-heading font-bold text-sm text-ink mb-2 leading-snug">
        {finding.message}
      </p>

      {/* Citation Box (The Core Verity Differentiator) */}
      <div className="mb-3 p-2.5 bg-yellow/20 border-2 border-ink flex items-start gap-2 text-xs font-mono">
        <BookOpen className="w-4 h-4 text-ink shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase text-[10px] text-gray-600 block">
            CITED RULE / APPROVED SOURCE:
          </span>
          <span className="font-semibold text-ink break-words block">
            {finding.source_cited}
          </span>
        </div>
      </div>

      {/* Dense Vector Semantic Match Highlight Box (Round 3 Improvement) */}
      {(finding.origin === "semantic_vector" || finding.match_type === "semantic_vector" || finding.source_cited.includes("Dense Vector Sim") || finding.source_cited.includes("Vector Match")) && (
        <div className="mb-3 p-2.5 bg-purple-50 border-2 border-purple-900 text-purple-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="bg-purple-900 text-white font-bold text-[9px] px-1.5 py-0.5 uppercase tracking-wider">
              ROUND 3: DENSE EMBEDDING
            </span>
            <span className="text-[11px] font-semibold text-purple-900">
              Matched via BAAI/bge-small-en-v1.5
            </span>
          </div>
          <span className="font-bold text-xs bg-white px-2 py-0.5 border border-purple-900 text-purple-900 self-start sm:self-auto">
            {Math.round((finding.match_score || finding.confidence) * 100)}% COSINE SIMILARITY
          </span>
        </div>
      )}

      {/* Before / After Diff Visualizer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-xs font-mono">
        <div className="p-2 bg-danger-light border-2 border-danger text-ink">
          <span className="text-[9px] font-bold text-danger uppercase block mb-0.5">
            CURRENT QUOTE (FLAGS):
          </span>
          <span className="line-through decoration-danger decoration-2 font-bold text-gray-800">
            "{finding.quote}"
          </span>
        </div>

        <div className="p-2 bg-mint-light border-2 border-mint-dark text-ink">
          <span className="text-[9px] font-bold text-emerald-800 uppercase block mb-0.5">
            SUGGESTED INTENT-PRESERVING FIX:
          </span>
          <span className="font-bold text-emerald-950">
            "{finding.suggestion}"
          </span>
        </div>
      </div>

      {/* Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t-2 border-gray-100">
        <div className="flex items-center gap-1">
          {finding.decision ? (
            <span
              className={`brutal-chip text-[10px] ${
                isAccepted ? "bg-mint text-ink border-ink" : "bg-danger text-white border-ink"
              }`}
            >
              {isAccepted ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              DECISION: {finding.decision.toUpperCase()}
            </span>
          ) : (
            <span className="text-[10px] font-mono text-gray-500 uppercase">
              Action Required:
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDecision(finding.id, "reject");
            }}
            className={`brutal-btn text-xs py-1.5 px-3 border-2 min-h-[38px] ${
              isRejected
                ? "bg-ink text-white border-ink shadow-none"
                : "brutal-btn-white hover:bg-danger hover:text-white"
            }`}
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Reject
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDecision(finding.id, "accept");
            }}
            className={`brutal-btn text-xs py-1.5 px-3 border-2 min-h-[38px] ${
              isAccepted
                ? "bg-mint text-ink border-ink shadow-none ring-2 ring-ink"
                : "brutal-btn-mint"
            }`}
          >
            <Check className="w-3.5 h-3.5 mr-1" />
            Accept Fix
          </button>
        </div>
      </div>
    </div>
  );
}
