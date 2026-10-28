"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { api } from "@/lib/api";
import { Submission, Passport } from "@/lib/types";
import { useTour } from "@/components/InteractiveTour";
import { 
  CheckSquare, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowRight, 
  MessageSquare, 
  Award, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Compass,
  Play
} from "lucide-react";
import confetti from "canvas-confetti";

export default function ApprovalsPage() {
  const { user, role, loginAsRole } = useAuth();
  const { startTour } = useTour();
  const router = useRouter();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [issuedPassport, setIssuedPassport] = useState<Passport | null>(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const data = await api.submissions.listApprovals();
      setSubmissions(data);
      if (data.length > 0) {
        setSelectedSub(data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch approvals queue:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAction = async (action: "approve" | "changes") => {
    if (!selectedSub) return;
    setActing(true);
    try {
      const updated = await api.submissions.review(selectedSub.id, action, commentText || undefined);
      setCommentText("");
      setSelectedSub(updated);

      if (action === "approve") {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#FFD93D", "#6EE7B7", "#FF9EDB", "#111111"],
        });
        if (updated.passport) {
          setIssuedPassport(updated.passport);
        }
      }

      await fetchQueue();
    } catch (err) {
      console.error("Review action failed:", err);
    } finally {
      setActing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Reviewer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-periwinkle border-3 border-ink shadow-brutal-card">
        <div>
          <span className="brutal-chip bg-white text-ink text-[10px] mb-1 inline-block">
            AUTHORISED REVIEWER QUEUE
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight uppercase text-ink">
            Editorial Approvals & Passports
          </h1>
          <p className="text-xs font-mono text-gray-800 mt-1">
            Review revised copy, inspect accepted rule fixes, and issue tamper-evident Publish Passports.
          </p>
        </div>

        {role !== "reviewer" && (
          <button
            type="button"
            onClick={() => loginAsRole("reviewer")}
            className="brutal-btn brutal-btn-yellow text-xs py-2 px-4 shadow-brutal-btn self-start sm:self-auto"
          >
            Switch to Reviewer Role
          </button>
        )}
      </div>

      {/* Contextual Reviewer Tour Assistant Banner */}
      <div className="p-3 bg-periwinkle border-3 border-ink shadow-brutal-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-ink stroke-[2.5]" />
          <span className="font-bold text-ink">
            REVIEWER WALKTHROUGH: Inspect side-by-side diffs, check creator decisions, and issue cryptographic Publish Passports.
          </span>
        </div>
        <button
          type="button"
          onClick={() => startTour("reviewer")}
          className="brutal-btn brutal-btn-white text-[11px] py-1 px-3 border-2 font-bold uppercase hover:bg-ink hover:text-white transition-colors shrink-0 self-start sm:self-auto flex items-center gap-1.5"
        >
          <Play className="w-2.5 h-2.5 fill-current" />
          <span>Start Reviewer Tour (6 Steps)</span>
        </button>
      </div>

      {/* Main 2-Column Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List of Submissions (4 cols) */}
        <div id="tour-submissions-queue" className="lg:col-span-4 brutal-card p-4 bg-white space-y-3">
          <div className="flex items-center justify-between border-b-2 border-ink pb-2">
            <h2 className="font-heading font-black text-sm uppercase">
              Submissions Queue ({submissions.length})
            </h2>
            <button
              type="button"
              onClick={fetchQueue}
              className="text-[11px] font-mono font-bold underline hover:text-gray-600"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs font-mono text-gray-500">
              Loading submissions queue...
            </div>
          ) : submissions.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-gray-500">
              No submissions currently in queue.
            </div>
          ) : (
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {submissions.map((sub) => {
                const isSelected = selectedSub?.id === sub.id;
                const isPending = sub.status === "pending_approval";
                const isApproved = sub.status === "approved";
                const isChanges = sub.status === "changes_requested";

                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      setSelectedSub(sub);
                      setIssuedPassport(sub.passport || null);
                    }}
                    className={`w-full text-left p-3 border-2 transition-all block ${
                      isSelected
                        ? "bg-yellow border-ink shadow-brutal-sm"
                        : "border-gray-200 hover:border-ink hover:bg-cream"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span
                        className={`brutal-chip text-[9px] py-0 px-1.5 ${
                          isApproved
                            ? "bg-mint text-ink border-ink"
                            : isPending
                            ? "bg-periwinkle text-ink border-ink font-bold"
                            : isChanges
                            ? "bg-danger text-white border-ink"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {sub.status.replace("_", " ").toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono text-gray-500">
                        {new Date(sub.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-xs uppercase text-ink line-clamp-1">
                      {sub.title || "Untitled Draft"}
                    </h4>
                    <p className="text-[11px] font-mono text-gray-600 line-clamp-1 mt-0.5">
                      {sub.revised_text || sub.original_text}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Detail Pane (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedSub ? (
            <div className="brutal-card p-6 bg-white space-y-6">
              {/* Submission Title Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b-2 border-ink">
                <div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">
                    SUBMISSION ID: {selectedSub.id}
                  </span>
                  <h2 className="text-xl font-heading font-black text-ink uppercase">
                    {selectedSub.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`brutal-chip text-xs ${
                      selectedSub.status === "approved"
                        ? "bg-mint text-ink border-ink"
                        : selectedSub.status === "pending_approval"
                        ? "bg-yellow text-ink border-ink"
                        : "bg-danger text-white border-ink"
                    }`}
                  >
                    STATUS: {selectedSub.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Published Passport Banner if approved */}
              {selectedSub.passport && (
                <div className="p-4 bg-mint border-3 border-ink shadow-brutal-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white border-2 border-ink flex items-center justify-center">
                      <Award className="w-6 h-6 text-ink" />
                    </div>
                    <div>
                      <span className="font-heading font-black text-sm uppercase block text-ink">
                        Publish Passport Active
                      </span>
                      <span className="text-[11px] font-mono text-ink block break-all">
                        SHA-256: {selectedSub.passport.content_hash.slice(0, 28)}...
                      </span>
                    </div>
                  </div>

                  <a
                    id="tour-verify-receipt-link"
                    href={`/verify/${selectedSub.passport.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="brutal-btn brutal-btn-white text-xs py-1.5 px-3 border-2 flex items-center gap-1.5"
                  >
                    <span>Verify Receipt</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Side-by-Side Comparison: Original Draft vs Final Revised Copy */}
              <div id="tour-side-by-side-diff" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 border-2 border-ink space-y-1">
                  <span className="text-[10px] font-mono font-bold text-gray-500 uppercase block">
                    Original Draft Submitted by Creator:
                  </span>
                  <p className="text-xs font-sans leading-relaxed text-gray-800">
                    {selectedSub.original_text}
                  </p>
                </div>

                <div className="p-3 bg-mint-light border-2 border-mint-dark space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase block">
                      Revised Copy (Proposed for Approval):
                    </span>
                    {selectedSub.intent && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-white border border-ink text-emerald-950 inline-flex items-center gap-1">
                        {selectedSub.intent.status === "locked" ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-700 stroke-[2.5]" />
                            <span>INTENT KEPT</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 text-coral stroke-[2.5]" />
                            <span>INTENT AT RISK</span>
                          </>
                        )}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-sans leading-relaxed font-semibold text-emerald-950">
                    {selectedSub.revised_text || selectedSub.original_text}
                  </p>
                </div>
              </div>

              {/* Summary of Decisions Made on Findings */}
              <div id="tour-findings-decision-log" className="space-y-2">
                <h3 className="font-heading font-black text-xs uppercase text-gray-700">
                  Governance Findings & Decisions Log ({selectedSub.findings?.length || 0})
                </h3>
                <div className="space-y-1.5 max-h-48 overflow-y-auto border-2 border-ink p-2 bg-cream text-xs font-mono">
                  {selectedSub.findings?.map((f) => (
                    <div
                      key={f.id}
                      className="p-1.5 bg-white border border-ink flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            f.decision === "accept"
                              ? "bg-mint-dark"
                              : f.decision === "reject"
                              ? "bg-danger"
                              : "bg-gray-300"
                          }`}
                        />
                        <span className="font-bold uppercase text-[10px]">{f.rule_id || f.type}:</span>
                        <span className="truncate text-gray-700">{f.message}</span>
                      </div>
                      <span className="text-[9px] font-bold uppercase shrink-0 px-1 bg-gray-100 border">
                        {f.decision ? f.decision.toUpperCase() : "PENDING"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviewer Comment Field */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-gray-700 mb-1">
                  Reviewer Editorial Feedback / Notes:
                </label>
                <textarea
                  rows={2}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Optional notes to the creator explaining your decision or requested modifications..."
                  className="brutal-input text-xs"
                />
              </div>

              {/* Approval Actions Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t-2 border-ink">
                <button
                  id="tour-request-changes-btn"
                  type="button"
                  onClick={() => handleReviewAction("changes")}
                  disabled={acting}
                  className="brutal-btn brutal-btn-danger text-xs py-2.5 px-4 flex items-center justify-center gap-1.5 min-h-[44px] w-full sm:w-auto"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Request Changes</span>
                </button>

                <button
                  id="tour-approve-passport-btn"
                  type="button"
                  onClick={() => handleReviewAction("approve")}
                  disabled={acting || selectedSub.status === "approved"}
                  className="brutal-btn brutal-btn-mint text-xs py-2.5 px-6 flex items-center justify-center gap-1.5 shadow-brutal-btn min-h-[44px] w-full sm:w-auto"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {selectedSub.status === "approved"
                      ? "APPROVED & PASSPORT ISSUED"
                      : "APPROVE & ISSUE PUBLISH PASSPORT"}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="brutal-card p-12 text-center bg-white">
              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="font-heading font-bold text-gray-600 uppercase">
                Select a submission from the left queue to review
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
