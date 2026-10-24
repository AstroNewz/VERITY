"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { api } from "@/lib/api";
import { Rule } from "@/lib/types";
import { useTour } from "@/components/InteractiveTour";
import { 
  BookOpen, 
  Plus, 
  Upload, 
  Check, 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Compass
} from "lucide-react";

export default function ConstitutionPage() {
  const { user, role, loginAsRole } = useAuth();
  const { startTour } = useTour();
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [importText, setImportText] = useState("");
  const [importing, setImporting] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const data = await api.rules.list();
      setRules(data);
    } catch (err) {
      console.error("Failed to fetch rules:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRule = async (rule: Rule) => {
    try {
      const updated = await api.rules.update(rule.id, { active: !rule.active });
      setRules(rules.map((r) => (r.id === rule.id ? updated : r)));
    } catch (err) {
      console.error("Failed to toggle rule:", err);
    }
  };

  const handleSimulateImport = () => {
    if (!importText.trim()) return;
    setImporting(true);
    setTimeout(() => {
      setImportNotice(
        "AI Guideline Parser: Extracted 2 candidate rule clauses from text. Brand Owner approval required to commit."
      );
      setImporting(false);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-yellow border-3 border-ink shadow-brutal-card">
        <div>
          <span className="brutal-chip bg-white text-ink text-[10px] mb-1 inline-block">
            BRAND GOVERNANCE REPOSITORY
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight uppercase text-ink">
            Brand Constitution & Rules
          </h1>
          <p className="text-xs font-mono text-gray-800 mt-1">
            Official rules, terminology standards, accessibility requirements, and citation sources.
          </p>
        </div>

        {role !== "owner" && (
          <button
            type="button"
            onClick={() => loginAsRole("owner")}
            className="brutal-btn brutal-btn-white text-xs py-2 px-4 shadow-brutal-btn self-start sm:self-auto"
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
            BRAND OWNER WALKTHROUGH: Manage constitution rules, live toggles, AI guideline parsing, and Claim Ledger.
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

      {/* Rules Table */}
      <div id="tour-rules-list" className="brutal-card p-6 bg-white space-y-4">
        <div className="flex items-center justify-between pb-2 border-b-2 border-ink">
          <h2 className="font-heading font-black text-lg uppercase">
            Active Brand Rules ({rules.length})
          </h2>
          <span className="text-xs font-mono font-bold text-gray-600">
            Nova Fest Identity Standards v1.0
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-gray-500">
            Loading Brand Constitution rules...
          </div>
        ) : (
          <>
            {/* Mobile Card-Based Rule List (< lg) */}
            <div className="block lg:hidden space-y-3">
              {rules.map((rule) => {
                const isCrit = rule.severity === "critical";
                const isWarn = rule.severity === "warning";

                return (
                  <div
                    key={rule.id}
                    className={`brutal-card p-4 space-y-3 ${
                      !rule.active ? "opacity-50 bg-gray-50" : "bg-white"
                    }`}
                  >
                    {/* Header: ID, Type, Severity, Active Toggle */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink/20 pb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono font-bold text-xs bg-yellow px-2 py-0.5 border border-ink">
                          {rule.id}
                        </span>
                        <span className="brutal-chip text-[9px] uppercase font-bold bg-white text-ink border-ink">
                          {rule.type}
                        </span>
                        <span
                          className={`brutal-chip text-[9px] py-0 px-1.5 ${
                            isCrit
                              ? "bg-danger text-white border-ink"
                              : isWarn
                              ? "bg-yellow text-ink border-ink"
                              : "bg-mint text-ink border-ink"
                          }`}
                        >
                          {rule.severity.toUpperCase()}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleRule(rule)}
                        className={`min-h-[38px] px-3 py-1.5 text-xs font-mono font-bold uppercase border-2 transition-all ${
                          rule.active
                            ? "bg-mint text-ink border-ink shadow-brutal-sm"
                            : "bg-gray-200 text-gray-600 border-gray-400"
                        }`}
                      >
                        {rule.active ? "STATUS: ON" : "STATUS: OFF"}
                      </button>
                    </div>

                    {/* Rule Title & Spec */}
                    <div>
                      <h3 className="font-heading font-black text-sm text-ink mb-1">
                        {rule.title}
                      </h3>
                      <p className="text-xs font-mono text-gray-700 leading-relaxed">
                        {rule.description}
                      </p>
                    </div>

                    {/* Source & Owner Meta */}
                    <div className="pt-2 border-t border-ink/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                      <div className="text-gray-600">
                        <span className="font-bold uppercase text-[9px] block text-gray-500">Citation:</span>
                        <span className="text-ink break-words">{rule.source_ref}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold uppercase text-[9px] block text-gray-500">Owner Desk:</span>
                        <span className="font-semibold text-ink">{rule.owner}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (>= lg) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="p-3 border-2 border-ink uppercase">ID</th>
                    <th className="p-3 border-2 border-ink uppercase">Type</th>
                    <th className="p-3 border-2 border-ink uppercase">Title & Specification</th>
                    <th className="p-3 border-2 border-ink uppercase">Severity</th>
                    <th className="p-3 border-2 border-ink uppercase">Citation Source</th>
                    <th className="p-3 border-2 border-ink uppercase">Owner</th>
                    <th className="p-3 border-2 border-ink uppercase text-center">Active</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map((rule) => {
                    const isCrit = rule.severity === "critical";
                    const isWarn = rule.severity === "warning";

                    return (
                      <tr
                        key={rule.id}
                        className={`border-b-2 border-ink hover:bg-cream transition-colors ${
                          !rule.active ? "opacity-40 bg-gray-50" : ""
                        }`}
                      >
                        <td className="p-3 border-2 border-ink font-bold text-sm bg-yellow-light/50">
                          {rule.id}
                        </td>
                        <td className="p-3 border-2 border-ink uppercase font-bold text-[10px]">
                          {rule.type}
                        </td>
                        <td className="p-3 border-2 border-ink font-sans max-w-sm">
                          <span className="font-heading font-bold text-sm text-ink block mb-0.5">
                            {rule.title}
                          </span>
                          <span className="text-xs text-gray-700 block">
                            {rule.description}
                          </span>
                        </td>
                        <td className="p-3 border-2 border-ink">
                          <span
                            className={`brutal-chip text-[9px] py-0 px-1.5 ${
                              isCrit
                                ? "bg-danger text-white border-ink"
                                : isWarn
                                ? "bg-yellow text-ink border-ink"
                                : "bg-mint text-ink border-ink"
                            }`}
                          >
                            {rule.severity.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 border-2 border-ink text-[11px] text-gray-700">
                          {rule.source_ref}
                        </td>
                        <td className="p-3 border-2 border-ink text-[11px] font-semibold">
                          {rule.owner}
                        </td>
                        <td className="p-3 border-2 border-ink text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleRule(rule)}
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase border-2 transition-all ${
                              rule.active
                                ? "bg-mint text-ink border-ink shadow-brutal-sm"
                                : "bg-gray-200 text-gray-500 border-gray-400"
                            }`}
                          >
                            {rule.active ? "ON" : "OFF"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Import Guidelines Section */}
      <div id="tour-import-guidelines" className="brutal-card p-6 bg-white space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b-2 border-ink">
          <Upload className="w-5 h-5 text-ink stroke-[2.5]" />
          <h2 className="font-heading font-black text-lg uppercase">
            Import Guidelines & Auto-Extract Rules (AI)
          </h2>
        </div>

        <p className="text-xs font-mono text-gray-600">
          Paste unstructured styleguide paragraphs, PDF exports, or committee guidelines. Verity proposes structured JSON rules for Brand Owner sign-off.
        </p>

        <textarea
          rows={4}
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder="Paste new guidelines text here... (e.g. 'All sponsor banners must display the university seal with at least 20px clear margin and never alter the blue crest.')"
          className="brutal-input text-xs font-mono"
        />

        {importNotice && (
          <div className="p-3 bg-mint-light border-2 border-mint-dark font-mono text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-800" />
            <span className="font-bold text-emerald-950">{importNotice}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleSimulateImport}
          disabled={importing || !importText.trim()}
          className="brutal-btn brutal-btn-yellow text-xs py-2.5 px-5 flex items-center justify-center gap-2 shadow-brutal-btn w-full sm:w-auto min-h-[44px]"
        >
          <Sparkles className="w-4 h-4" />
          <span>{importing ? "Parsing Guidelines..." : "Parse & Propose New Rules"}</span>
        </button>
      </div>
    </div>
  );
}
