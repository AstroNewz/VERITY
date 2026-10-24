"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { api } from "@/lib/api";
import { HealthRadarItem } from "@/lib/types";
import { useTour } from "@/components/InteractiveTour";
import { 
  Activity, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  RefreshCw,
  GitBranch,
  Check,
  X,
  Compass
} from "lucide-react";

export default function RadarPage() {
  const { user, role, loginAsRole } = useAuth();
  const { startTour } = useTour();
  const [radarItems, setRadarItems] = useState<HealthRadarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingRuleId, setActingRuleId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    fetchRadar();
  }, []);

  const fetchRadar = async () => {
    setLoading(true);
    try {
      const data = await api.radar.get();
      setRadarItems(data);
    } catch (err) {
      console.error("Failed to fetch radar:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClarification = async (ruleId: string) => {
    setActingRuleId(ruleId);
    try {
      const res = await api.radar.approve(ruleId);
      setNotice(`Rule ${ruleId} clarified and incremented to version ${res.new_version}!`);
      await fetchRadar();
    } catch (err: any) {
      alert(`Approval error: ${err.message}`);
    } finally {
      setActingRuleId(null);
    }
  };

  const unclearRules = radarItems.filter((r) => r.is_unclear);
  const healthyRules = radarItems.filter((r) => !r.is_unclear);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-pink border-3 border-ink shadow-brutal-card">
        <div>
          <span className="brutal-chip bg-white text-ink text-[10px] mb-1 inline-block">
            GUIDELINE HEALTH & ADAPTATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight uppercase text-ink">
            Guideline Health Radar™
          </h1>
          <p className="text-xs font-mono text-gray-800 mt-1">
            Detects ambiguous rules with high creator rejection rates (≥50%) and drafts clearer clauses automatically.
          </p>
        </div>

        {role !== "owner" && (
          <button
            type="button"
            onClick={() => loginAsRole("owner")}
            className="brutal-btn brutal-btn-yellow text-xs py-2 px-4 shadow-brutal-btn self-start sm:self-auto"
          >
            Switch to Brand Owner Role
          </button>
        )}
      </div>

      {/* Contextual Brand Owner Tour Assistant Banner */}
      <div className="p-3 bg-pink border-3 border-ink shadow-brutal-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-ink stroke-[2.5]" />
          <span className="font-bold text-ink">
            HEALTH RADAR WALKTHROUGH: Identify ambiguous rules with high creator rejection rates and auto-generate clarified clauses.
          </span>
        </div>
        <button
          type="button"
          onClick={() => startTour("owner")}
          className="brutal-btn brutal-btn-white text-[11px] py-1 px-3 border-2 font-bold uppercase hover:bg-ink hover:text-white transition-colors shrink-0 self-start sm:self-auto"
        >
          ▶ Start Owner Tour (8 Steps)
        </button>
      </div>

      {notice && (
        <div className="p-3 bg-mint-light border-2 border-mint-dark text-xs font-mono font-bold flex items-center justify-between">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice(null)} className="underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Unclear Rules Section */}
      <div id="tour-flagged-rules" className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-danger stroke-[2.5]" />
          <h2 className="font-heading font-black text-xl uppercase text-ink">
            Flagged Ambiguous Rules ({unclearRules.length})
          </h2>
        </div>

        <p className="text-xs font-mono text-gray-600">
          These rules have high creator rejection rates or reviewer disagreements, suggesting creators found the guidance vague or misaligned.
        </p>

        {loading ? (
          <div className="py-8 text-center text-xs font-mono text-gray-500">
            Scanning guideline health signals...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {unclearRules.map((item) => (
              <div key={item.rule_id} className="brutal-card p-6 bg-white space-y-4 border-danger">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="brutal-chip bg-yellow text-ink font-bold text-xs">
                      {item.rule_id}
                    </span>
                    <span className="brutal-chip bg-danger text-white text-[10px]">
                      HIGH REJECT RATE: {Math.round(item.reject_rate * 100)}%
                    </span>
                  </div>
                  <span className="text-xs font-mono text-gray-500">
                    {item.total_decisions} Creator Decisions
                  </span>
                </div>

                <h3 className="font-heading font-black text-base uppercase text-ink">
                  {item.title}
                </h3>

                {/* AI Drafted Clarified Clause */}
                {item.clarified_clause && (
                  <div id="tour-clarified-clause" className="p-4 bg-yellow-light/60 border-2 border-ink space-y-2 font-mono text-xs">
                    <div className="flex items-center gap-1.5 text-ink font-bold uppercase text-[10px]">
                      <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                      <span>AI Proposed Clarified Clause:</span>
                    </div>
                    <p className="font-sans text-xs font-semibold text-gray-900">
                      {item.clarified_clause}
                    </p>

                    <div className="grid grid-cols-1 gap-2 pt-2 border-t border-gray-300">
                      <div className="p-1.5 bg-mint-light border border-mint-dark text-[11px]">
                        <span className="font-bold text-emerald-800 uppercase flex items-center gap-1 mb-0.5">
                          <Check className="w-3 h-3 stroke-[3]" /> Allowed Example:
                        </span>
                        <span>"{item.example_allowed}"</span>
                      </div>
                      <div className="p-1.5 bg-danger-light border border-danger text-[11px]">
                        <span className="font-bold text-danger uppercase flex items-center gap-1 mb-0.5">
                          <X className="w-3 h-3 stroke-[3]" /> Banned Example:
                        </span>
                        <span>"{item.example_banned}"</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Owner Approval Action */}
                <div className="pt-2 flex justify-end">
                  <button
                    id="tour-bump-version-btn"
                    type="button"
                    onClick={() => handleApproveClarification(item.rule_id)}
                    disabled={actingRuleId === item.rule_id}
                    className="brutal-btn brutal-btn-mint text-xs py-2.5 px-4 shadow-brutal-btn flex items-center justify-center gap-1.5 min-h-[44px] w-full sm:w-auto"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>
                      {actingRuleId === item.rule_id
                        ? "Versioning..."
                        : "Approve Clause & Bump Version"}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Healthy Rules Section */}
      <div className="brutal-card p-6 bg-white space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b-2 border-ink">
          <CheckCircle2 className="w-5 h-5 text-mint-dark stroke-[2.5]" />
          <h2 className="font-heading font-black text-lg uppercase">
            Healthy & High-Adoption Rules ({healthyRules.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {healthyRules.map((rule) => (
            <div key={rule.rule_id} className="p-3 border-2 border-ink bg-cream font-mono text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink">{rule.rule_id}</span>
                <span className="brutal-chip bg-mint text-ink text-[9px] py-0 px-1 border">
                  {Math.round((1 - rule.reject_rate) * 100)}% Accepted
                </span>
              </div>
              <h4 className="font-sans font-bold text-xs truncate">{rule.title}</h4>
              <span className="text-[10px] text-gray-500 block">
                {rule.total_decisions} decisions recorded
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
