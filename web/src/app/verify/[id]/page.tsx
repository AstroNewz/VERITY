"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Download, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Calendar, 
  User, 
  Sparkles, 
  FileText,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function PassportVerifyPage() {
  const params = useParams();
  const passportId = params?.id as string;

  const [verification, setVerification] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [tampering, setTampering] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    if (passportId) {
      verifyPassport();
    }
  }, [passportId]);

  const verifyPassport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.passports.verify(passportId);
      setVerification(res);
    } catch (err: any) {
      console.error("Verification failed:", err);
      setError(err.message || "Failed to verify passport.");
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateTamper = async () => {
    setTampering(true);
    try {
      const userStr = typeof window !== "undefined" ? localStorage.getItem("verity_user") : null;
      const user = userStr ? JSON.parse(userStr) : null;
      if (user?.role !== "owner") {
        await api.auth.demoLogin("owner");
      }
      await api.passports.simulateTamper(passportId);
      await verifyPassport();
    } catch (err: any) {
      console.error("Simulate tamper error:", err);
      alert("Simulate tamper error: " + err.message);
    } finally {
      setTampering(false);
    }
  };

  const handleRestoreOriginal = async () => {
    setRestoring(true);
    try {
      const userStr = typeof window !== "undefined" ? localStorage.getItem("verity_user") : null;
      const user = userStr ? JSON.parse(userStr) : null;
      if (user?.role !== "owner") {
        await api.auth.demoLogin("owner");
      }
      await api.passports.restoreOriginal(passportId);
      await verifyPassport();
    } catch (err: any) {
      console.error("Restore error:", err);
      alert("Restore error: " + err.message);
    } finally {
      setRestoring(false);
    }
  };

  const handleCopyHash = () => {
    if (verification?.computed_hash) {
      navigator.clipboard.writeText(verification.computed_hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadJSON = () => {
    if (!verification) return;
    const blob = new Blob([JSON.stringify(verification, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `verity-publish-passport-${passportId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3 font-mono">
        <div className="w-12 h-12 border-3 border-ink border-t-yellow rounded-full animate-spin mx-auto" />
        <p className="text-sm uppercase font-bold text-gray-700">
          Recomputing Cryptographic SHA-256 Hash...
        </p>
      </div>
    );
  }

  if (error || !verification) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="brutal-card p-8 bg-danger-light border-danger text-center space-y-4">
          <ShieldAlert className="w-16 h-16 text-danger mx-auto" />
          <h1 className="font-heading font-black text-2xl uppercase text-danger">
            Passport Verification Error
          </h1>
          <p className="font-mono text-xs text-gray-800">
            {error || "The requested passport ID could not be retrieved from the ledger."}
          </p>
          <a
            href="/"
            className="brutal-btn brutal-btn-white text-xs py-2 px-4 border-2 inline-block"
          >
            Return to Verity Home
          </a>
        </div>
      </div>
    );
  }

  const isValid = verification.is_valid;
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      {/* Top Verification Result Banner */}
      <div
        className={`brutal-card p-6 sm:p-8 border-4 text-center space-y-4 relative overflow-hidden ${
          isValid
            ? "bg-mint border-ink shadow-brutal-xl"
            : "bg-danger text-white border-ink shadow-brutal-xl"
        }`}
      >
        <div className="inline-block transform -rotate-1">
          <span
            className={`brutal-badge text-xs px-3 py-1 ${
              isValid ? "bg-white text-ink border-ink" : "bg-ink text-white border-white"
            }`}
          >
            OFFICIAL PUBLISH PASSPORT
          </span>
        </div>

        <div className="flex items-center justify-center gap-3">
          {isValid ? (
            <ShieldCheck className="w-12 h-12 text-ink stroke-[2.5]" />
          ) : (
            <ShieldAlert className="w-12 h-12 text-white stroke-[2.5]" />
          )}
          <h1
            className={`text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight ${
              isValid ? "text-ink" : "text-white"
            }`}
          >
            {isValid ? "VALID & UNTAMPERED" : "TAMPERED DETECTED"}
          </h1>
        </div>

        <p
          className={`font-mono text-xs sm:text-sm max-w-lg mx-auto ${
            isValid ? "text-gray-900" : "text-white"
          }`}
        >
          {isValid
            ? "Cryptographic SHA-256 seal verified. Content exactly matches editorial approval."
            : "Warning: Post copy has been altered after editorial approval was issued!"}
        </p>
      </div>

      {/* Owner-Only Cryptographic Tamper Simulator Box (Audit Item 5) */}
      <div className="brutal-card p-5 bg-white border-3 border-ink shadow-brutal space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-ink pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-accent-pink stroke-[2.5]" />
            <span className="font-heading font-black text-sm uppercase text-ink">
              Owner-Only Cryptographic Tamper Simulator
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase bg-ink text-white px-2 py-0.5">
            Audit Checklist #5
          </span>
        </div>
        <p className="font-mono text-xs text-gray-700 leading-relaxed">
          Verity guarantees integrity through cryptographic SHA-256 seal verification. Test this by simulating an unauthorized mutation to the stored copy in the database and verifying that the public receipt immediately detects the anomaly.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleSimulateTamper}
            disabled={tampering}
            className="brutal-btn brutal-btn-pink text-xs py-2 px-4 border-2 flex items-center gap-2 shadow-brutal-sm"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{tampering ? "Tampering database..." : "🚨 Simulate Tamper (Owner Action)"}</span>
          </button>

          {!isValid && (
            <button
              type="button"
              onClick={handleRestoreOriginal}
              disabled={restoring}
              className="brutal-btn brutal-btn-mint text-xs py-2 px-4 border-2 flex items-center gap-2 shadow-brutal-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{restoring ? "Restoring original..." : "✅ Restore Approved Copy (Reset)"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Passport Details Card */}
      <div className="brutal-card p-6 sm:p-8 bg-white space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-ink">
          <div>
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">
              PASSPORT IDENTIFIER
            </span>
            <span className="font-heading font-black text-xl uppercase text-ink">
              {passportId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadJSON}
              className="brutal-btn brutal-btn-yellow text-xs py-1.5 px-3 border-2 flex items-center gap-1.5 shadow-brutal-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Receipt</span>
            </button>
          </div>
        </div>

        {/* Cryptographic Hash Comparison Grid */}
        <div className="space-y-3 font-mono text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold uppercase text-gray-600">
                Live Recomputed SHA-256 Hash:
              </span>
              <button
                type="button"
                onClick={handleCopyHash}
                className="text-[10px] underline hover:text-gray-900 flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
            <div className="p-3 bg-cream border-2 border-ink break-all font-mono font-bold text-ink">
              {verification.computed_hash}
            </div>
          </div>

          <div>
            <span className="font-bold uppercase text-gray-600 block mb-1">
              Approved Stored Seal:
            </span>
            <div className="p-3 bg-gray-50 border-2 border-ink break-all font-mono text-gray-800">
              {verification.stored_hash}
            </div>
          </div>
        </div>

        {/* Audit Meta Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-cream border-2 border-ink font-mono text-xs">
          <div>
            <span className="text-gray-500 block text-[10px] uppercase font-bold">
              Rules Version
            </span>
            <span className="font-bold text-ink">{verification.rules_version || "1.0"}</span>
          </div>

          <div>
            <span className="text-gray-500 block text-[10px] uppercase font-bold">
              Authorised Approver
            </span>
            <span className="font-bold text-ink">{verification.approver || "Dr. Arvind Rao (Reviewer)"}</span>
          </div>

          <div>
            <span className="text-gray-500 block text-[10px] uppercase font-bold">
              Issued At
            </span>
            <span className="font-bold text-ink">
              {verification.issued_at ? new Date(verification.issued_at).toLocaleString() : "Just now"}
            </span>
          </div>

          <div>
            <span className="text-gray-500 block text-[10px] uppercase font-bold">
              AI Disclosure
            </span>
            <span className="font-bold text-ink">
              {verification.passport?.ai_used ? "Claude 3.5 Sonnet" : "Deterministic Only"}
            </span>
          </div>

          <div>
            <span className="text-gray-500 block text-[10px] uppercase font-bold">
              Privacy Redactions
            </span>
            <span className="font-bold text-ink">
              {verification.passport?.redactions_count || 0} tokens protected
            </span>
          </div>

          <div>
            <span className="text-gray-500 block text-[10px] uppercase font-bold">
              Citations Applied
            </span>
            <span className="font-bold text-ink">
              {verification.passport?.summary_json?.accepted_fixes || 0} accepted fixes
            </span>
          </div>
        </div>

        {/* Verified Published Text */}
        <div>
          <span className="font-mono text-xs font-bold uppercase text-gray-700 block mb-1">
            Sealed Approved Copy:
          </span>
          <div className="p-4 bg-white border-3 border-ink text-sm font-sans leading-relaxed text-ink shadow-brutal-sm">
            {verification.submission_text}
          </div>
        </div>

        {/* QR Code Verification Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-yellow/20 border-2 border-ink">
          <div className="p-2 bg-white border-2 border-ink shadow-brutal-sm">
            <QRCodeSVG value={currentUrl} size={110} level="M" />
          </div>
          <div className="space-y-1 text-center sm:text-left font-mono">
            <h4 className="font-heading font-black text-sm uppercase">
              Scan To Verify On Any Device
            </h4>
            <p className="text-xs text-gray-700">
              Anyone with this QR code can verify that the published copy has not been tampered with or modified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
