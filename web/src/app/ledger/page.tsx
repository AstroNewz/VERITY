"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { api } from "@/lib/api";
import { ClaimLedgerItem, ConfidentialTerm } from "@/lib/types";
import { 
  Scale, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ShieldAlert, 
  Lock,
  ArrowRight,
  X
} from "lucide-react";

export default function LedgerPage() {
  const { user, role, loginAsRole } = useAuth();
  const [claims, setClaims] = useState<ClaimLedgerItem[]>([]);
  const [confTerms, setConfTerms] = useState<ConfidentialTerm[]>([]);
  const [loading, setLoading] = useState(true);

  // New Claim Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newId, setNewId] = useState("");
  const [newText, setNewText] = useState("");
  const [newSource, setNewSource] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [newExpiry, setNewExpiry] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cData, ctData] = await Promise.all([
        api.ledger.list(),
        api.confidential.list(),
      ]);
      setClaims(cData);
      setConfTerms(ctData);
    } catch (err) {
      console.error("Failed to fetch ledger data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId || !newText || !newSource || !newExpiry) return;
    try {
      await api.ledger.create({
        id: newId,
        claim_text: newText,
        source: newSource,
        owner: newOwner || "Brand Council",
        valid_until: new Date(newExpiry).toISOString(),
      });
      setShowAddModal(false);
      setNewId("");
      setNewText("");
      setNewSource("");
      setNewExpiry("");
      fetchData();
    } catch (err: any) {
      alert(`Failed to add claim: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-mint border-3 border-ink shadow-brutal-card">
        <div>
          <span className="brutal-chip bg-white text-ink text-[10px] mb-1 inline-block">
            EVIDENCE & SUBSTANTIATION LEDGER
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight uppercase text-ink">
            Claim Ledger™ & Expiry Watch
          </h1>
          <p className="text-xs font-mono text-gray-800 mt-1">
            Substantiates public metrics, statistics, attendee figures, and rankings before publication.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="brutal-btn brutal-btn-yellow text-xs py-2 px-4 shadow-brutal-btn flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Claim Entry</span>
        </button>
      </div>

      {/* 30-Day Expiry Calendar Strip */}
      <div className="brutal-card p-5 bg-white space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b-2 border-ink">
          <Calendar className="w-5 h-5 text-ink stroke-[2.5]" />
          <h2 className="font-heading font-black text-sm uppercase">
            30-Day Expiry Strip (Claims Continuity Watch)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {claims.map((claim) => {
            const isExpired = claim.status === "expired";
            const isSoon = claim.status === "expires_soon";
            const isVerified = claim.status === "verified";

            return (
              <div
                key={claim.id}
                className={`p-3 border-2 border-ink font-mono text-xs space-y-1 ${
                  isExpired
                    ? "bg-danger-light border-danger text-danger"
                    : isSoon
                    ? "bg-yellow-light/80 border-ink text-ink shadow-brutal-sm"
                    : "bg-mint-light/40 border-ink text-gray-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">{claim.id}</span>
                  <span
                    className={`brutal-chip text-[9px] py-0 px-1 border ${
                      isExpired ? "bg-danger text-white" : isSoon ? "bg-yellow text-ink" : "bg-mint text-ink"
                    }`}
                  >
                    {claim.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
                <p className="font-bold font-sans text-xs line-clamp-1">"{claim.claim_text}"</p>
                <span className="text-[10px] text-gray-600 block">
                  Valid Until: {new Date(claim.valid_until).toLocaleDateString()} ({claim.days_until_expiry} days)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Claims Table */}
      <div className="brutal-card p-6 bg-white space-y-4">
        <div className="flex items-center justify-between pb-2 border-b-2 border-ink">
          <h2 className="font-heading font-black text-lg uppercase">
            Approved Claims Database ({claims.length})
          </h2>
          <span className="text-xs font-mono font-bold text-gray-500">
            Nova Fest Evidence Records
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-gray-500">
            Loading claim records...
          </div>
        ) : (
          <>
            {/* Mobile Card List (< lg) */}
            <div className="block lg:hidden space-y-3">
              {claims.map((c) => {
                const isExp = c.status === "expired";
                const isSoon = c.status === "expires_soon";

                return (
                  <div
                    key={c.id}
                    className="brutal-card p-4 space-y-3 bg-white"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink/20 pb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs bg-yellow px-2 py-0.5 border border-ink">
                          {c.id}
                        </span>
                        <span
                          className={`brutal-chip text-[9px] py-0 px-2 ${
                            isExp
                              ? "bg-danger text-white border-ink"
                              : isSoon
                              ? "bg-yellow text-ink border-ink font-bold"
                              : "bg-mint text-ink border-ink"
                          }`}
                        >
                          {c.status.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-gray-600">
                        Valid Until: <strong className="text-ink">{new Date(c.valid_until).toLocaleDateString()}</strong>
                      </span>
                    </div>

                    <p className="font-sans font-bold text-sm text-ink leading-snug">
                      "{c.claim_text}"
                    </p>

                    <div className="pt-2 border-t border-ink/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                      <div>
                        <span className="font-bold uppercase text-[9px] block text-gray-500">Substantiation:</span>
                        <span className="text-ink break-words">{c.source}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold uppercase text-[9px] block text-gray-500">Owner Desk:</span>
                        <span className="font-semibold text-ink">{c.owner}</span>
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
                    <th className="p-3 border-2 border-ink uppercase">Approved Claim Text</th>
                    <th className="p-3 border-2 border-ink uppercase">Substantiation Source</th>
                    <th className="p-3 border-2 border-ink uppercase">Owner Desk</th>
                    <th className="p-3 border-2 border-ink uppercase">Valid Until</th>
                    <th className="p-3 border-2 border-ink uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((c) => {
                    const isExp = c.status === "expired";
                    const isSoon = c.status === "expires_soon";

                    return (
                      <tr key={c.id} className="border-b-2 border-ink hover:bg-cream transition-colors">
                        <td className="p-3 border-2 border-ink font-bold text-sm bg-yellow-light/40">
                          {c.id}
                        </td>
                        <td className="p-3 border-2 border-ink font-sans font-bold text-xs">
                          "{c.claim_text}"
                        </td>
                        <td className="p-3 border-2 border-ink text-gray-700">
                          {c.source}
                        </td>
                        <td className="p-3 border-2 border-ink font-semibold">
                          {c.owner}
                        </td>
                        <td className="p-3 border-2 border-ink">
                          {new Date(c.valid_until).toLocaleDateString()}
                        </td>
                        <td className="p-3 border-2 border-ink">
                          <span
                            className={`brutal-chip text-[9px] py-0 px-2 ${
                              isExp
                                ? "bg-danger text-white border-ink"
                                : isSoon
                                ? "bg-yellow text-ink border-ink font-bold"
                                : "bg-mint text-ink border-ink"
                            }`}
                          >
                            {c.status.replace("_", " ").toUpperCase()}
                          </span>
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

      {/* Confidential Terms Table */}
      <div className="brutal-card p-6 bg-white space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b-2 border-ink">
          <Lock className="w-5 h-5 text-ink stroke-[2.5]" />
          <h2 className="font-heading font-black text-lg uppercase">
            Confidential Terms & Project Codenames
          </h2>
        </div>

        <p className="text-xs font-mono text-gray-600">
          Unreleased project codenames blocked from public publication by Rule P-1. Redacted automatically by Privacy Gateway.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {confTerms.map((ct) => (
            <div key={ct.id} className="p-4 border-2 border-ink bg-danger-light font-mono text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-danger text-sm uppercase">Codename: {ct.term}</span>
                <span className="brutal-chip bg-danger text-white text-[9px] py-0 px-1 border">BLOCKED</span>
              </div>
              <p className="text-[11px] text-gray-700">
                Safe Hint: {ct.replacement_hint}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Claim Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-ink/70 flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="brutal-card p-5 sm:p-6 bg-white max-w-md w-full max-w-[calc(100vw-2rem)] my-auto space-y-4 shadow-brutal-xl">
            <div className="flex items-center justify-between pb-2 border-b-2 border-ink">
              <h3 className="font-heading font-black text-base sm:text-lg uppercase">Add New Claim Entry</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 border border-transparent hover:border-ink min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleCreateClaim} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block font-bold uppercase mb-1">Claim ID (e.g. F-4):</label>
                <input
                  type="text"
                  required
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  placeholder="F-4"
                  className="brutal-input text-xs"
                />
              </div>

              <div>
                <label className="block font-bold uppercase mb-1">Claim Text / Phrase:</label>
                <input
                  type="text"
                  required
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="e.g. 50+ campus clubs participating"
                  className="brutal-input text-xs"
                />
              </div>

              <div>
                <label className="block font-bold uppercase mb-1">Substantiation Source Document:</label>
                <input
                  type="text"
                  required
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="e.g. Student Council Register 2026"
                  className="brutal-input text-xs"
                />
              </div>

              <div>
                <label className="block font-bold uppercase mb-1">Owner Department:</label>
                <input
                  type="text"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  placeholder="e.g. Student Affairs"
                  className="brutal-input text-xs"
                />
              </div>

              <div>
                <label className="block font-bold uppercase mb-1">Valid Until Date:</label>
                <input
                  type="date"
                  required
                  value={newExpiry}
                  onChange={(e) => setNewExpiry(e.target.value)}
                  className="brutal-input text-xs"
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t-2 border-ink">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="brutal-btn brutal-btn-white text-xs py-2 px-4 border-2 min-h-[44px] flex-1 sm:flex-initial"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="brutal-btn brutal-btn-yellow text-xs py-2 px-5 shadow-brutal-btn min-h-[44px] flex-1 sm:flex-initial"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
