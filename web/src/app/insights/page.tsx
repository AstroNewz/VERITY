"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { InsightsData } from "@/lib/types";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  PieChart, 
  CheckCircle2, 
  Layers
} from "lucide-react";

export default function InsightsPage() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await api.insights.get();
        setData(res);
      } catch (err) {
        console.error("Failed to load insights:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, []);

  if (loading || !data) {
    return (
      <div className="py-20 text-center font-mono text-sm text-gray-500">
        Aggregating brand governance analytics...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-yellow border-3 border-ink shadow-brutal-card">
        <div>
          <span className="brutal-chip bg-white text-ink text-[10px] mb-1 inline-block">
            ENTERPRISE BRAND INTELLIGENCE
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight uppercase text-ink">
            Governance Insights & Drift
          </h1>
          <p className="text-xs font-mono text-gray-800 mt-1">
            Real-time analytics on repeated brand errors, creator overrides, and publishing cycle efficiency.
          </p>
        </div>
      </div>

      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="brutal-card p-5 bg-white space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-gray-500 block">
            Submissions Reviewed
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-heading font-black text-ink">{data.total_submissions}</span>
            <Layers className="w-5 h-5 text-gray-400" />
          </div>
          <span className="text-[11px] font-mono text-emerald-700 font-bold">100% pre-publication</span>
        </div>

        <div className="brutal-card p-5 bg-mint space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-ink block">
            Published Passports
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-heading font-black text-ink">{data.total_approved}</span>
            <ShieldCheck className="w-5 h-5 text-ink" />
          </div>
          <span className="text-[11px] font-mono text-ink font-bold">Sealed with SHA-256</span>
        </div>

        <div className="brutal-card p-5 bg-white space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-gray-500 block">
            Brand Errors Prevented
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-heading font-black text-ink">{data.total_findings_caught}</span>
            <AlertTriangle className="w-5 h-5 text-danger" />
          </div>
          <span className="text-[11px] font-mono text-danger font-bold">Caught before public eyes</span>
        </div>

        <div className="brutal-card p-5 bg-periwinkle space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-ink block">
            Avg Time to Approval
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-heading font-black text-ink">{data.avg_approval_time_hours}h</span>
            <Clock className="w-5 h-5 text-ink" />
          </div>
          <span className="text-[11px] font-mono text-ink font-bold">Down from 48h manual review</span>
        </div>
      </div>

      {/* 2-Column Analytical Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Repeated Brand Errors */}
        <div className="brutal-card p-6 bg-white space-y-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-ink">
            <h2 className="font-heading font-black text-base uppercase">
              Top Repeated Brand Mistakes
            </h2>
            <span className="text-xs font-mono font-bold text-gray-500">Frequency Count</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {data.repeated_mistakes.map((m, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-ink font-semibold">
                  <span>
                    <strong className="text-ink mr-1">[{m.rule_id}]</strong> {m.title}
                  </span>
                  <span className="font-bold">{m.count}x</span>
                </div>
                {/* Visual Bar */}
                <div className="w-full h-4 bg-gray-100 border border-ink overflow-hidden">
                  <div
                    className="h-full bg-yellow border-r border-ink"
                    style={{ width: `${Math.min(100, (m.count / 30) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Overridden Rules (Creator Rejection Rates) */}
        <div className="brutal-card p-6 bg-white space-y-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-ink">
            <h2 className="font-heading font-black text-base uppercase">
              Most Overridden Rules (Creator Rejection)
            </h2>
            <span className="text-xs font-mono font-bold text-danger">Radar Trigger: ≥50%</span>
          </div>

          <p className="text-xs font-mono text-gray-600">
            Rules with high creator pushback indicate ambiguous policy language or unrealistic creative constraints.
          </p>

          <div className="space-y-3 font-mono text-xs">
            {data.most_overridden_rules.map((r, idx) => (
              <div key={idx} className="p-3 border-2 border-ink bg-danger-light/40 space-y-1">
                <div className="flex justify-between items-center font-bold">
                  <span>
                    [{r.rule_id}] {r.title}
                  </span>
                  <span className="brutal-chip bg-danger text-white text-[9px] py-0 px-1 border">
                    {r.override_rate} Overridden
                  </span>
                </div>
                <div className="flex flex-wrap justify-between items-center gap-1 text-[11px] text-gray-600">
                  <span>Total creator rejections: {r.overrides}</span>
                  <a href="/radar" className="font-bold underline text-ink">
                    Clarify in Health Radar →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Findings by Category Breakdown */}
        <div className="brutal-card p-6 bg-white space-y-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-ink">
            <h2 className="font-heading font-black text-base uppercase">
              Findings Distribution by Category
            </h2>
            <span className="text-xs font-mono font-bold text-gray-500">Categorical Breakdown</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
            {Object.entries(data.findings_by_type).map(([category, count]) => (
              <div key={category} className="p-3 border-2 border-ink bg-cream text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-600 block">
                  {category}
                </span>
                <span className="text-2xl font-heading font-black text-ink block">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Drift Over Time */}
        <div className="brutal-card p-6 bg-white space-y-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-ink">
            <h2 className="font-heading font-black text-base uppercase">
              Brand Drift Reduction Over Time
            </h2>
            <span className="text-xs font-mono font-bold text-mint-dark">4-Week Trend</span>
          </div>

          <p className="text-xs font-mono text-gray-600">
            As creators receive citations before publishing, recurring violations decrease by over 75% across four weeks.
          </p>

          <div className="space-y-2 font-mono text-xs">
            {data.drift_by_category.map((w, idx) => (
              <div key={idx} className="flex flex-wrap items-center justify-between gap-2 p-2 border border-ink bg-cream">
                <span className="font-bold text-ink w-16">{w.week}</span>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <span className="text-[11px]">Terminology: <strong>{w.terminology}</strong></span>
                  <span className="text-[11px]">Claims: <strong>{w.claims}</strong></span>
                  <span className="text-[11px]">Tone: <strong>{w.tone}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
