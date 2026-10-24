"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { api } from "@/lib/api";
import { Submission, Finding, DemoPost, IntentLock } from "@/lib/types";
import DemoLoader from "@/components/DemoLoader";
import WorkflowStepper from "@/components/WorkflowStepper";
import IntentLockCard from "@/components/IntentLockCard";
import FindingCard from "@/components/FindingCard";
import { 
  Play, 
  Send, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  CheckSquare, 
  RefreshCw,
  Eye,
  ShieldCheck,
  PauseCircle
} from "lucide-react";

export default function WorkspacePage() {
  const { user, role } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("NovaFest 2026 Campus Launch Announcement");
  const [draftText, setDraftText] = useState(
    "NovaFest 2026 is back and it is CHEAP! We are the #1 student fest in India with over 10,000 attendees expected on campus! Tickets are guaranteed to sell out, but do not mention Project Falcon yet!!!"
  );
  const [selectedPostId, setSelectedPostId] = useState("demo_post_comprehensive");

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // 1-click Preset Selector
  const handleSelectPreset = (post: DemoPost) => {
    setTitle(post.title);
    setDraftText(post.text);
    setSelectedPostId(post.id);
    setSubmission(null);
    setSelectedFinding(null);
    setStatusMessage(`Loaded preset: "${post.title}"`);
  };

  // Run Verity Governance Engine
  const handleRunAnalysis = async () => {
    if (!draftText.trim()) return;
    setAnalyzing(true);
    setStatusMessage("Running Verity Governance Checks: Terminology, Claims Ledger, Privacy Gateway & Groq AI...");
    try {
      // 1. Create or update submission
      const sub = await api.submissions.create({
        title: title || "Untitled Draft",
        original_text: draftText,
        input_type: "text",
      });
      // 2. Execute analysis
      const analyzedSub = await api.submissions.analyze(sub.id);
      setSubmission(analyzedSub);
      setStatusMessage(`Analysis complete: ${analyzedSub.findings.length} findings cited.`);
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setStatusMessage(`Error during analysis: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  // Handle Accept or Reject Decision on a Finding
  const handleFindingDecision = async (findingId: string, decision: "accept" | "reject") => {
    try {
      await api.submissions.updateFinding(findingId, decision);
      // Automatically refresh revised text and intent check
      if (submission) {
        const revised = await api.submissions.revise(submission.id);
        setSubmission(revised);
      }
    } catch (err) {
      console.error("Failed to update finding:", err);
    }
  };

  // Accept All Fixes in one click
  const handleAcceptAllSafe = async () => {
    if (!submission) return;
    try {
      for (const f of submission.findings) {
        if (!f.decision) {
          await api.submissions.updateFinding(f.id, "accept");
        }
      }
      const revised = await api.submissions.revise(submission.id);
      setSubmission(revised);
      setStatusMessage("All suggested fixes accepted.");
    } catch (err) {
      console.error("Failed to accept all:", err);
    }
  };

  // Submit to Reviewer Queue
  const handleSubmitForReview = async () => {
    if (!submission) return;
    setSubmitting(true);
    try {
      const updated = await api.submissions.submit(submission.id);
      setSubmission(updated);
      setStatusMessage("Draft successfully submitted to Reviewer Queue!");
      router.push("/approvals");
    } catch (err: any) {
      console.error("Submit failed:", err);
      setStatusMessage(`Submit error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // File Upload Handler (Parses DOCX, PPTX, PDF, and TXT with 10 MB limit)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Enforce 10 MB limit (Audit Item 4)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setStatusMessage("Error: File exceeds maximum allowed size of 10 MB.");
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    const allowed = ["txt", "md", "docx", "pptx", "pdf"];
    if (!ext || !allowed.includes(ext)) {
      setStatusMessage(`Error: Unsupported file type .${ext}. Only .txt, .md, .docx, .pptx, and .pdf are allowed.`);
      return;
    }

    setStatusMessage(`Uploading and extracting text from ${file.name}...`);
    try {
      const sub = await api.submissions.upload(file);
      setDraftText(sub.original_text);
      setTitle(sub.title || file.name.replace(/\.[^/.]+$/, ""));
      setSubmission(sub);
      setStatusMessage(`Successfully parsed ${file.name} (${sub.input_type.toUpperCase()} format). Click 'Run Verity Governance Check' to analyze.`);
    } catch (err: any) {
      console.error("Upload error:", err);
      setStatusMessage(`Failed to parse file: ${err.message}`);
    }
  };

  // Filtered findings
  const findings = submission?.findings || [];
  const filteredFindings = findings.filter((f) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "critical") return f.severity === "critical";
    if (activeFilter === "warning") return f.severity === "warning";
    if (activeFilter === "claims") return f.type === "claim";
    if (activeFilter === "voice") return f.type === "voice";
    return true;
  });

  // Determine current stepper progress (1 to 5)
  let currentStep = 1;
  if (draftText) currentStep = 2;
  if (submission) currentStep = 4;
  if (submission?.status === "pending_approval") currentStep = 5;
  if (submission?.status === "approved") currentStep = 6;

  return (
    <div className="space-y-6">
      {/* Workflow Stepper */}
      <WorkflowStepper currentStep={currentStep} />

      {/* Preset Loader Bar */}
      <div id="tour-presets-bar">
        <DemoLoader onSelectPost={handleSelectPreset} selectedPostId={selectedPostId} />
      </div>

      {/* AI Telemetry & Graceful Degradation Notice (Audit Items 1 & D) */}
      {submission && (
        <div
          className={`p-3 border-2 border-ink text-xs font-mono font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-brutal-sm ${
            submission.ai_status === "active"
              ? "bg-mint text-ink"
              : submission.ai_status === "daily_cap_exceeded"
              ? "bg-coral text-white"
              : "bg-yellow/40 text-ink"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="shrink-0">
              {submission.ai_status === "active" ? (
                <Sparkles className="w-4 h-4 text-emerald-800 stroke-[2.5]" />
              ) : submission.ai_status === "daily_cap_exceeded" ? (
                <PauseCircle className="w-4 h-4 text-white stroke-[2.5]" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-ink stroke-[2.5]" />
              )}
            </div>
            <span>
              {submission.ai_status === "active"
                ? `Groq AI Active (${submission.ai_model || "Llama 3.3 70B"}): Multi-agent intent preservation & voice tone checks enabled.`
                : submission.ai_status === "daily_cap_exceeded"
                ? `AI review paused for today: Global daily quota reached. Gracefully operating in 100% deterministic rule citation & ledger verification mode.`
                : `Demo Notice: Deterministic Engine Active. Groq API key offline. Deterministic rules, Privacy Gateway, and Claim Ledger are operating with full fidelity.`}
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 border border-ink bg-white text-ink font-mono font-black shrink-0">
            {(submission.ai_status || "offline_fallback").replace("_", " ")}
          </span>
        </div>
      )}

      {/* Status Notice Strip */}
      {statusMessage && (
        <div className="p-2.5 bg-yellow/30 border-2 border-ink text-xs font-mono font-bold flex items-center justify-between">
          <span>{statusMessage}</span>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-gray-600 hover:text-ink text-xs uppercase"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Editor, Intent Lock, and Revised Text (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Draft Input Card */}
          <div className="brutal-card p-5 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b-2 border-gray-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-ink stroke-[2.5]" />
                <h2 className="font-heading font-black text-lg tracking-tight uppercase">
                  Draft Content
                </h2>
              </div>

              {/* Upload Dropzone button */}
              <label className="brutal-btn brutal-btn-white text-xs py-2 px-3 border-2 cursor-pointer flex items-center gap-1.5 shadow-brutal-sm min-h-[40px]">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Document</span>
                <input
                  type="file"
                  accept=".txt,.md,.docx,.pptx,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Title Input */}
            <div className="mb-3">
              <label className="block text-[11px] font-mono font-bold uppercase text-gray-600 mb-1">
                Post / Campaign Title:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Nova Fest 2026 Campus Launch Announcement"
                className="brutal-input text-sm font-semibold"
              />
            </div>

            {/* Textarea Editor */}
            <div className="mb-4">
              <label className="block text-[11px] font-mono font-bold uppercase text-gray-600 mb-1">
                Draft Body:
              </label>
              <textarea
                rows={6}
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                placeholder="Paste promotional draft, student invitation, or campaign copy here..."
                className="brutal-input font-sans text-sm leading-relaxed resize-y"
              />
              <div className="flex flex-wrap justify-between items-center text-[10px] font-mono text-gray-500 mt-1 px-1 gap-1">
                <span>{draftText.length} characters | {draftText.trim().split(/\s+/).filter(Boolean).length} words</span>
                <span className="text-ink font-bold">Paste any format (TXT, DOCX, PPTX, PDF, Web)</span>
              </div>
            </div>

            {/* Big Action: Run Analysis */}
            <button
              id="tour-run-check-btn"
              type="button"
              onClick={handleRunAnalysis}
              disabled={analyzing || !draftText.trim()}
              className="brutal-btn brutal-btn-yellow w-full text-sm py-3.5 min-h-[48px] shadow-brutal-btn flex items-center justify-center gap-2"
            >
              <Play className={`w-4 h-4 fill-ink ${analyzing ? "animate-spin" : ""}`} />
              <span>
                {analyzing ? "CITING RULES & VERIFYING CLAIMS..." : "RUN VERITY GOVERNANCE CHECK"}
              </span>
            </button>
          </div>

          {/* Intent Lock Card (Appears after submission/analysis) */}
          {submission?.intent && (
            <IntentLockCard
              intent={submission.intent}
              onUpdateIntent={async (updated) => {
                if (submission) {
                  setSubmission({ ...submission, intent: updated });
                }
              }}
            />
          )}

          {/* Revised Text Box with Intent Verification */}
          {submission && (
            <div className="brutal-card p-5 bg-white border-3 border-ink">
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b-2 border-gray-100">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-mint-dark stroke-[2.5]" />
                  <h3 className="font-heading font-black text-base uppercase tracking-tight">
                    Revised Copy (Accepted Fixes Applied)
                  </h3>
                </div>

                {submission.intent && (
                  <span
                    className={`brutal-chip text-[10px] flex items-center gap-1 font-bold ${
                      submission.intent.status === "locked"
                        ? "bg-mint text-ink border-ink"
                        : "bg-danger text-white border-ink"
                    }`}
                  >
                    {submission.intent.status === "locked" ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                        <span>INTENT PRESERVED</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
                        <span>INTENT AT RISK</span>
                      </>
                    )}
                  </span>
                )}
              </div>

              <div className="p-3 bg-cream border-2 border-ink text-sm font-sans leading-relaxed mb-4">
                {submission.revised_text || submission.original_text}
              </div>

              {/* Submit for Approval Action */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <div className="text-xs font-mono text-gray-600">
                  <span>Status: </span>
                  <span className="font-bold text-ink uppercase">
                    {submission.status.replace("_", " ")}
                  </span>
                </div>

                <button
                  id="tour-submit-approval-btn"
                  type="button"
                  onClick={handleSubmitForReview}
                  disabled={submitting || submission.status === "pending_approval"}
                  className="brutal-btn brutal-btn-mint text-xs py-2.5 px-5 min-h-[44px] flex items-center justify-center gap-2 shadow-brutal-btn w-full sm:w-auto"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {submission.status === "pending_approval"
                      ? "SUBMITTED FOR REVIEW"
                      : "SUBMIT FOR REVIEWER APPROVAL"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Findings Panel (5 cols) */}
        <div id="tour-findings-panel" className="lg:col-span-5 space-y-4">
          <div className="brutal-card p-4 bg-white lg:sticky lg:top-24">
            {/* Header with stats */}
            <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b-2 border-ink">
              <div>
                <h3 className="font-heading font-black text-lg tracking-tight uppercase flex items-center gap-2">
                  Governance Findings
                  {findings.length > 0 && (
                    <span className="bg-ink text-yellow text-xs px-2 py-0.5 border border-ink font-mono font-bold">
                      {findings.length}
                    </span>
                  )}
                </h3>
                <span className="text-[11px] font-mono text-gray-500">
                  Every issue cites a rule or ledger source
                </span>
              </div>

              {findings.length > 0 && (
                <button
                  type="button"
                  onClick={handleAcceptAllSafe}
                  className="brutal-btn brutal-btn-mint text-xs py-1.5 px-3 min-h-[36px] border-2 shadow-brutal-sm"
                  title="Accept all safe suggestions"
                >
                  Accept All
                </button>
              )}
            </div>

            {/* Filter Pills */}
            {findings.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 text-xs font-mono scrollbar-none touch-pan-x">
                {[
                  { id: "all", label: `All (${findings.length})` },
                  { id: "critical", label: `Critical (${findings.filter((f) => f.severity === "critical").length})` },
                  { id: "warning", label: `Warnings (${findings.filter((f) => f.severity === "warning").length})` },
                  { id: "claims", label: "Claims" },
                  { id: "voice", label: "Voice" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-2 py-0.5 border-2 text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                      activeFilter === tab.id
                        ? "bg-ink text-white border-ink shadow-brutal-sm"
                        : "border-gray-200 text-gray-600 hover:border-ink hover:text-ink"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* Empty State before Analysis */}
            {!submission && !analyzing && (
              <div className="py-12 px-4 text-center border-2 border-dashed border-gray-300 bg-cream">
                <ShieldCheck className="w-12 h-12 text-gray-400 mx-auto mb-2 stroke-[1.5]" />
                <h4 className="font-heading font-bold text-sm uppercase text-gray-700">
                  No Active Analysis
                </h4>
                <p className="text-xs font-mono text-gray-500 mt-1 max-w-xs mx-auto">
                  Click "Run Verity Governance Check" or pick a judge preset above to inspect rules & citations.
                </p>
              </div>
            )}

            {/* Analyzing Loading State */}
            {analyzing && (
              <div className="py-12 px-4 text-center border-2 border-ink bg-yellow-light/50 animate-pulse">
                <RefreshCw className="w-8 h-8 text-ink mx-auto mb-3 animate-spin stroke-[2.5]" />
                <h4 className="font-heading font-black text-sm uppercase text-ink">
                  Inspecting Brand Constitution & Ledger...
                </h4>
                <p className="text-xs font-mono text-gray-700 mt-1">
                  Checking casing, claims validity, confidential terms & tone hygiene
                </p>
              </div>
            )}

            {/* Clean Post State */}
            {submission && findings.length === 0 && !analyzing && (
              <div className="p-6 text-center border-3 border-ink bg-mint-light">
                <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto mb-2 stroke-[2.5]" />
                <h4 className="font-heading font-black text-base uppercase text-emerald-950">
                  100% Brand Compliant
                </h4>
                <p className="text-xs font-mono text-emerald-800 mt-1">
                  Zero errors or unverified claims detected. Clean copy verified against Brand Constitution.
                </p>
              </div>
            )}

            {/* Findings List */}
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {filteredFindings.map((finding) => (
                <FindingCard
                  key={finding.id}
                  finding={finding}
                  onDecision={handleFindingDecision}
                  onSelectFinding={(f) => setSelectedFinding(f)}
                  isSelected={selectedFinding?.id === finding.id}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
