"use client";

import React, { useState } from "react";
import { 
  Puzzle, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  Globe, 
  Zap, 
  ShieldCheck, 
  Copy, 
  Check, 
  Monitor, 
  ArrowRight,
  BookOpen,
  Image as ImageIcon,
  Calendar,
  Smile,
  BarChart2,
  Lock,
  RefreshCw,
  Target,
  AlertOctagon,
  Search
} from "lucide-react";

interface InSituFinding {
  ruleId: string;
  severity: "critical" | "warning";
  phrase: string;
  suggestedFix: string;
  explanation: string;
  source: string;
}

export default function ExtensionsPage() {
  const [activeSimTab, setActiveSimTab] = useState<"browser" | "figma">("browser");
  
  // Browser Simulator State
  const [socialText, setSocialText] = useState(
    "NovaFest 2026 is back and it is CHEAP! We are officially the #1 student fest in India. Do not mention Project Falcon yet!"
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Figma Simulator State
  const [figmaLayers, setFigmaLayers] = useState([
    { id: "layer-1", name: "Campaign Headline", text: "NovaFest 2026 is back and it is CHEAP!" },
    { id: "layer-2", name: "Festival Metric Subtitle", text: "Proudly ranked #1 student festival in India." },
    { id: "layer-3", name: "Confidential Notes", text: "Strictly embargoed: Project Falcon launch." }
  ]);
  const [figmaScanned, setFigmaScanned] = useState(false);
  const [figmaScanning, setFigmaScanning] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const applyBrowserFix = (oldPhrase: string, newPhrase: string) => {
    setSocialText((prev) => prev.replace(oldPhrase, newPhrase));
    triggerToast(`Replaced "${oldPhrase}" with "${newPhrase}"`);
  };

  const loadBrowserPreset = (scenario: "all" | "tone" | "claim" | "confidential" | "clean") => {
    if (scenario === "all") {
      setSocialText("NovaFest 2026 is back and it is CHEAP! We are officially the #1 student fest in India. Do not mention Project Falcon yet!");
    } else if (scenario === "tone") {
      setSocialText("NovaFest 2026 tickets are dirt CHEAP this year! Don't miss out on the wildest campus party!!!");
    } else if (scenario === "claim") {
      setSocialText("Nova Fest is guaranteed to be the #1 student fest in India with over 50,000 attendees expected!");
    } else if (scenario === "confidential") {
      setSocialText("Nova Fest executive committee update: Project Falcon announcement is embargoed until Friday.");
    } else if (scenario === "clean") {
      setSocialText("Nova Fest 2026 welcomes university students across the country for three days of arts, music, and keynote celebrations.");
    }
    triggerToast(`Loaded scenario: ${scenario.toUpperCase()}`);
  };

  const handleScanFigma = () => {
    setFigmaScanning(true);
    setTimeout(() => {
      setFigmaScanning(false);
      setFigmaScanned(true);
      triggerToast("Verity: Scanned 3 canvas text layers against Brand Constitution");
    }, 600);
  };

  const applyFigmaFix = (layerId: string, oldPhrase: string, newPhrase: string) => {
    setFigmaLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, text: l.text.replace(oldPhrase, newPhrase) } : l))
    );
    triggerToast(`Updated Figma canvas layer with compliant copy`);
  };

  // Dynamic Browser Findings
  const getBrowserFindings = (text: string): InSituFinding[] => {
    const list: InSituFinding[] = [];
    if (/CHEAP/i.test(text)) {
      list.push({
        ruleId: "T-3",
        severity: "warning",
        phrase: "CHEAP",
        suggestedFix: "accessible",
        explanation: "Tone Hygiene: Avoid 'cheap'; use 'accessible' or 'budget-friendly'.",
        source: "Constitution §4: Tone Hygiene"
      });
    }
    if (/#1\s+student\s+fest/i.test(text) || /#1\s+in\s+India/i.test(text) || /#1/i.test(text)) {
      list.push({
        ruleId: "C-1",
        severity: "critical",
        phrase: text.match(/#1[^\n.!,]*/i)?.[0] || "#1 student fest in India",
        suggestedFix: "premier collegiate festival in India",
        explanation: "Unverified Superlative: No documented source supports '#1'.",
        source: "Claim Ledger entry CL-003"
      });
    }
    if (/50,?000/i.test(text)) {
      list.push({
        ruleId: "C-2",
        severity: "critical",
        phrase: "50,000 attendees",
        suggestedFix: "10,000 attendees",
        explanation: "Unsupported Metric: Approved festival capacity in ledger is 10,000.",
        source: "Claim Ledger entry F-1"
      });
    }
    if (/Project\s+Falcon/i.test(text)) {
      list.push({
        ruleId: "P-1",
        severity: "critical",
        phrase: "Project Falcon",
        suggestedFix: "[REDACTED CONFIDENTIAL]",
        explanation: "Confidentiality Breach: Project Falcon is restricted under NDA.",
        source: "Constitution §6: Confidential Terms"
      });
    }
    if (/NovaFest\s*2026/i.test(text) && !/Nova\s+Fest/.test(text)) {
      list.push({
        ruleId: "N-1",
        severity: "warning",
        phrase: "NovaFest",
        suggestedFix: "Nova Fest",
        explanation: "Official Brand Casing: Brand name must be formatted as 'Nova Fest'.",
        source: "Constitution §1: Naming Standard"
      });
    }
    return list;
  };

  const browserFindings = getBrowserFindings(socialText);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-mint text-ink font-mono font-bold text-xs p-3.5 border-3 border-ink shadow-brutal-btn flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="brutal-card p-6 bg-yellow border-3 border-ink shadow-brutal-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-ink text-yellow font-mono text-[10px] font-bold px-2 py-0.5 border border-ink uppercase">
                Round 3 Delivery
              </span>
              <span className="bg-white text-ink font-mono text-[10px] font-bold px-2 py-0.5 border border-ink">
                Improvement 3 of 3
              </span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-ink uppercase tracking-tight">
              In-Situ Browser Extension & Native Figma Plugin
            </h1>
            <p className="font-sans text-xs sm:text-sm text-gray-800 max-w-3xl leading-relaxed">
              Brand governance shouldn't force creators to switch tools. Verity directly intercepts drafts inside 
              Chromium browsers (LinkedIn, X/Twitter, WordPress, Gmail) and the native Figma design canvas with live rule citations and 1-click sanitization.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-2">
            <a
              href="/downloads/verity-chromium-extension.zip"
              download
              className="brutal-btn brutal-btn-white text-xs py-2.5 px-3.5 border-2 flex items-center justify-center gap-2 font-bold shadow-brutal-sm"
            >
              <Download className="w-4 h-4" />
              <span>Chrome Extension (ZIP)</span>
            </a>
            <a
              href="/downloads/verity-figma-plugin.zip"
              download
              className="brutal-btn brutal-btn-pink text-xs py-2.5 px-3.5 border-2 flex items-center justify-center gap-2 font-bold shadow-brutal-sm"
            >
              <Download className="w-4 h-4" />
              <span>Figma Plugin (ZIP)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Quick Setup Cards (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Chrome Extension */}
        <div className="brutal-card p-5 bg-white border-3 border-ink shadow-brutal-md flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-gray-100 pb-2">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-ink stroke-[2.5]" />
                <h2 className="font-heading font-black text-base uppercase text-ink">
                  1. Chromium Browser Extension
                </h2>
              </div>
              <span className="font-mono text-[10px] font-bold bg-mint border border-ink px-2 py-0.5 text-ink uppercase">
                Manifest V3
              </span>
            </div>

            <p className="font-sans text-xs text-gray-700 leading-relaxed">
              Provides real-time in-situ highlight chips near selected text on any webpage, plus an action popup for instant copy inspection.
            </p>

            <div className="space-y-2 bg-cream p-3 border-2 border-ink text-xs font-mono">
              <div className="font-bold text-ink uppercase text-[10px] border-b border-gray-300 pb-1">
                60-Second Setup (Chrome, Edge, Brave):
              </div>
              <ol className="list-decimal list-inside space-y-1 text-gray-800 text-[11px]">
                <li>Download & unzip <code className="bg-yellow px-1 font-bold">verity-chromium-extension.zip</code>.</li>
                <li>Open <code className="bg-white border px-1">chrome://extensions</code> in your browser.</li>
                <li>Toggle on <strong>Developer mode</strong> (top-right).</li>
                <li>Click <strong>"Load unpacked"</strong> & select the unzipped directory.</li>
              </ol>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="/downloads/verity-chromium-extension.zip"
              download
              className="brutal-btn brutal-btn-yellow w-full text-xs py-2.5 border-2 flex items-center justify-center gap-2 font-bold shadow-brutal-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download Chrome Extension (12 KB)</span>
            </a>
          </div>
        </div>

        {/* Card 2: Native Figma Plugin */}
        <div className="brutal-card p-5 bg-white border-3 border-ink shadow-brutal-md flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-gray-100 pb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-ink stroke-[2.5]" />
                <h2 className="font-heading font-black text-base uppercase text-ink">
                  2. Native Figma Plugin
                </h2>
              </div>
              <span className="font-mono text-[10px] font-bold bg-periwinkle border border-ink px-2 py-0.5 text-ink uppercase">
                Figma & FigJam
              </span>
            </div>

            <p className="font-sans text-xs text-gray-700 leading-relaxed">
              Scans artboards and frames for text layers, identifies unverified claims and tone issues, and updates canvas layers with font preservation.
            </p>

            <div className="space-y-2 bg-cream p-3 border-2 border-ink text-xs font-mono">
              <div className="font-bold text-ink uppercase text-[10px] border-b border-gray-300 pb-1">
                60-Second Setup (Figma Desktop App):
              </div>
              <ol className="list-decimal list-inside space-y-1 text-gray-800 text-[11px]">
                <li>Download & unzip <code className="bg-pink px-1 font-bold">verity-figma-plugin.zip</code>.</li>
                <li>Open Figma Desktop & right-click canvas.</li>
                <li>Go to <strong>Plugins &gt; Development &gt; Import plugin from manifest...</strong></li>
                <li>Select the unzipped <code className="bg-white border px-1">manifest.json</code>.</li>
              </ol>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="/downloads/verity-figma-plugin.zip"
              download
              className="brutal-btn brutal-btn-pink w-full text-xs py-2.5 border-2 flex items-center justify-center gap-2 font-bold shadow-brutal-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download Figma Plugin (6 KB)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Sandbox (Generous Dimensions, Balanced Split Grid) */}
      <div className="brutal-card p-5 sm:p-7 bg-white border-3 border-ink shadow-brutal-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-3 border-ink pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-ink stroke-[2.5]" />
              <h2 className="font-heading font-black text-xl sm:text-2xl uppercase text-ink tracking-tight">
                Live In-Situ Simulator Sandbox
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-gray-600 mt-0.5">
              Experience the exact interactive workflow right here without installing any extensions or desktop software.
            </p>
          </div>

          {/* Simulator Tab Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSimTab("browser")}
              className={`brutal-btn text-xs py-2.5 px-4 border-2 transition-all flex items-center gap-2 ${
                activeSimTab === "browser"
                  ? "brutal-btn-yellow font-black shadow-brutal-sm"
                  : "brutal-btn-white text-gray-600 hover:text-ink font-bold"
              }`}
            >
              <Globe className="w-4 h-4 stroke-[2.5]" />
              <span>Browser Extension Demo</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSimTab("figma")}
              className={`brutal-btn text-xs py-2.5 px-4 border-2 transition-all flex items-center gap-2 ${
                activeSimTab === "figma"
                  ? "brutal-btn-pink font-black shadow-brutal-sm"
                  : "brutal-btn-white text-gray-600 hover:text-ink font-bold"
              }`}
            >
              <Layers className="w-4 h-4 stroke-[2.5]" />
              <span>Figma Plugin Demo</span>
            </button>
          </div>
        </div>

        {/* Browser Simulator */}
        {activeSimTab === "browser" && (
          <div className="space-y-4">
            <div className="text-xs font-mono text-gray-600 flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-ink uppercase">
                Simulated Chromium Browser Window (LinkedIn Post Composer)
              </span>
              <span className="text-gray-500">
                Click any scenario chip to test instant real-time governance
              </span>
            </div>

            {/* Simulated Browser Frame (High Fidelity, Generous Dimensions) */}
            <div className="border-3 border-ink bg-[#FAFAF8] shadow-brutal-lg overflow-hidden">
              {/* Browser Window Header & Address Bar */}
              <div className="bg-ink text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 shrink-0">
                  <span className="w-3 h-3 rounded-full bg-danger block border border-black/40"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow block border border-black/40"></span>
                  <span className="w-3 h-3 rounded-full bg-mint block border border-black/40"></span>
                </div>

                <div className="flex-1 max-w-xl mx-2 bg-gray-900 border border-gray-700 px-3 py-1 flex items-center gap-2 text-gray-300 text-[11px] truncate">
                  <Lock className="w-3 h-3 text-mint shrink-0" />
                  <span className="truncate">https://www.linkedin.com/feed/compose?campaign=novafest_2026</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 bg-yellow text-ink text-[10px] font-bold border border-ink uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                    <span>Verity Active</span>
                  </span>
                </div>
              </div>

              {/* Realistic Split Composer Layout (7 Cols Left / 5 Cols Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 items-start bg-white min-h-[500px]">
                {/* Left Column: Social Post Composer (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Scenario Quick-Loader Chips */}
                  <div className="space-y-1.5 bg-cream p-3 border-2 border-ink shadow-brutal-sm">
                    <span className="font-mono text-[10px] font-bold uppercase text-gray-600 block flex items-center gap-1">
                      <Zap className="w-3 h-3 text-ink" />
                      <span>Quick-Load Test Scenarios (1-Click):</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5 font-mono text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => loadBrowserPreset("all")}
                        className="px-2 py-1 bg-yellow hover:bg-ink hover:text-yellow border border-ink uppercase shadow-xs transition-colors flex items-center gap-1"
                      >
                        <Target className="w-3 h-3" />
                        <span>3 Issues Combo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => loadBrowserPreset("tone")}
                        className="px-2 py-1 bg-white hover:bg-yellow border border-ink uppercase shadow-xs transition-colors flex items-center gap-1"
                      >
                        <AlertTriangle className="w-3 h-3 text-ink" />
                        <span>Tone Issue ("CHEAP")</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => loadBrowserPreset("claim")}
                        className="px-2 py-1 bg-white hover:bg-yellow border border-ink uppercase shadow-xs transition-colors flex items-center gap-1"
                      >
                        <AlertOctagon className="w-3 h-3 text-danger" />
                        <span>Superlative Claim ("#1")</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => loadBrowserPreset("confidential")}
                        className="px-2 py-1 bg-white hover:bg-yellow border border-ink uppercase shadow-xs transition-colors flex items-center gap-1"
                      >
                        <Lock className="w-3 h-3 text-ink" />
                        <span>NDA Term ("Project Falcon")</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => loadBrowserPreset("clean")}
                        className="px-2 py-1 bg-mint hover:bg-ink hover:text-white border border-ink uppercase shadow-xs transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-800" />
                        <span>100% Clean Copy</span>
                      </button>
                    </div>
                  </div>

                  {/* Social Profile & Audience Bar */}
                  <div className="border-2 border-ink p-4 bg-white shadow-brutal-sm space-y-3">
                    <div className="flex items-center gap-3 border-b-2 border-gray-100 pb-3">
                      <div className="w-10 h-10 bg-yellow border-2 border-ink flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                        NF
                      </div>
                      <div>
                        <div className="font-heading font-black text-xs uppercase text-ink">
                          Nova Fest University Festival
                        </div>
                        <div className="text-[10px] text-gray-600 font-mono flex items-center gap-1.5 mt-0.5">
                          <span className="px-1.5 py-0.2 bg-gray-100 border border-gray-400 font-bold inline-flex items-center gap-1">
                            <span>Post to Anyone</span>
                            <Globe className="w-3 h-3 inline-block" />
                          </span>
                          <span>•</span>
                          <span>Draft Mode</span>
                        </div>
                      </div>
                    </div>

                    {/* Relative Textarea with Floating Verity Chip */}
                    <div className="relative">
                      <textarea
                        rows={6}
                        value={socialText}
                        onChange={(e) => setSocialText(e.target.value)}
                        placeholder="What do you want to talk about? Type promotional copy or announcements..."
                        className="w-full p-4 font-sans text-sm sm:text-base border-2 border-ink bg-cream/30 focus:bg-white focus:outline-none leading-relaxed resize-y min-h-[160px]"
                      />

                      {/* In-Situ Trigger Chip */}
                      {browserFindings.length > 0 && (
                        <div className="absolute top-2 right-2 bg-yellow text-ink font-mono text-[11px] font-bold px-2.5 py-1 border-2 border-ink shadow-brutal-sm flex items-center gap-1.5 animate-pulse">
                          <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Verity: {browserFindings.length} Citation{browserFindings.length > 1 ? "s" : ""}</span>
                        </div>
                      )}
                    </div>

                    {/* Character Counts & Social Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-200 text-xs">
                      <div className="flex items-center gap-2 text-gray-500">
                        <span className="p-1.5 hover:bg-gray-100 rounded cursor-pointer" title="Add Media">
                          <ImageIcon className="w-4 h-4 text-ink" />
                        </span>
                        <span className="p-1.5 hover:bg-gray-100 rounded cursor-pointer" title="Create Event">
                          <Calendar className="w-4 h-4 text-ink" />
                        </span>
                        <span className="p-1.5 hover:bg-gray-100 rounded cursor-pointer" title="Create Poll">
                          <BarChart2 className="w-4 h-4 text-ink" />
                        </span>
                        <span className="p-1.5 hover:bg-gray-100 rounded cursor-pointer" title="Add Emoji">
                          <Smile className="w-4 h-4 text-ink" />
                        </span>
                      </div>

                      <div className="font-mono text-[10px] text-gray-500">
                        <span>{socialText.length} characters</span>
                        <span className="mx-1.5">|</span>
                        <span>{socialText.trim().split(/\s+/).filter(Boolean).length} words</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Verity In-Situ Companion Panel (5 cols) */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="brutal-card p-4 bg-cream border-3 border-ink shadow-brutal-md space-y-3 sticky top-4">
                    <div className="flex items-center justify-between border-b-2 border-ink pb-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-ink stroke-[2.5]" />
                        <span className="font-heading font-black text-xs uppercase text-ink">
                          In-Situ Brand Guard
                        </span>
                      </div>
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 border border-ink uppercase ${
                          browserFindings.length === 0
                            ? "bg-mint text-ink"
                            : "bg-yellow text-ink"
                        }`}
                      >
                        {browserFindings.length === 0
                          ? "100% COMPLIANT"
                          : `${browserFindings.length} FINDING${browserFindings.length > 1 ? "S" : ""}`}
                      </span>
                    </div>

                    <div className="text-[10px] font-mono text-gray-600">
                      Cites official Brand Constitution rules before publication:
                    </div>

                    {/* Findings List */}
                    <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                      {browserFindings.length === 0 ? (
                        <div className="p-4 bg-mint border-2 border-ink text-center space-y-1.5">
                          <CheckCircle2 className="w-8 h-8 text-emerald-800 mx-auto stroke-[2.5]" />
                          <div className="font-heading font-black text-xs uppercase text-emerald-950">
                            100% Brand Compliant
                          </div>
                          <p className="text-[10px] font-mono text-emerald-900 leading-relaxed">
                            Zero unverified claims, tone infractions, or confidential codenames detected.
                          </p>
                        </div>
                      ) : (
                        browserFindings.map((f, idx) => (
                          <div
                            key={idx}
                            className={`p-3 border-2 border-ink text-xs font-mono space-y-1.5 ${
                              f.severity === "critical"
                                ? "bg-danger/10 border-danger"
                                : "bg-yellow/30 border-ink"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="px-1.5 py-0.2 bg-white border border-ink text-[9px] font-bold">
                                {f.ruleId}
                              </span>
                              <span
                                className={`text-[9px] font-bold uppercase ${
                                  f.severity === "critical" ? "text-danger" : "text-ink"
                                }`}
                              >
                                {f.severity}
                              </span>
                            </div>

                            <div className="font-bold text-ink text-xs">
                              "{f.phrase}"
                            </div>

                            <p className="font-sans text-[11px] text-gray-800 leading-snug">
                              {f.explanation}
                            </p>

                            <div className="text-[9px] font-mono text-gray-600 border-t border-gray-300 pt-1">
                              Source: {f.source}
                            </div>

                            <button
                              type="button"
                              onClick={() => applyBrowserFix(f.phrase, f.suggestedFix)}
                              className="w-full mt-1 bg-mint hover:bg-yellow border-2 border-ink text-[10px] font-bold py-1 px-2 uppercase shadow-xs transition-colors flex items-center justify-center gap-1"
                            >
                              <Check className="w-3 h-3 stroke-[2.5] shrink-0" />
                              <span>Apply Fix:</span>
                              <span className="truncate">"{f.suggestedFix}"</span>
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Figma Simulator */}
        {activeSimTab === "figma" && (
          <div className="space-y-4">
            <div className="text-xs font-mono text-gray-600 flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-ink uppercase">
                Simulated Figma Canvas & Native Scenegraph Plugin Panel
              </span>
              <span className="text-gray-500">
                Traverse canvas text layers and apply compliant replacements directly
              </span>
            </div>

            {/* Simulated Figma Desktop Window */}
            <div className="border-3 border-ink bg-[#1E1E1E] shadow-brutal-lg overflow-hidden">
              {/* Figma Desktop Header */}
              <div className="bg-[#2C2C2C] text-white px-4 py-2.5 flex items-center justify-between text-xs font-mono border-b-2 border-ink">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-pink flex items-center justify-center font-black text-ink text-xs border border-white">
                    F
                  </div>
                  <span className="text-gray-300 text-[11px] truncate">
                    Figma Desktop / NovaFest_Launch_Kit.fig / Canvas: 100%
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#444] text-gray-200 text-[10px] font-mono border border-gray-600">
                    Artboard: 1080×1080
                  </span>
                </div>
              </div>

              {/* Figma Split View: Dark Canvas (Left 7 cols) & Plugin Floating Window (Right 5 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 bg-[#222222] min-h-[500px] items-stretch">
                {/* Left: Dark Canvas Workspace (7 cols) */}
                <div className="lg:col-span-7 bg-[#161616] border-2 border-[#333333] p-5 sm:p-8 flex flex-col justify-center items-center min-h-[460px] relative overflow-hidden">
                  <div className="text-[10px] font-mono text-gray-400 mb-3 uppercase tracking-widest">
                    Canvas Artboard: [Nova_Fest_Hero_Banner_1080x1080]
                  </div>

                  {/* Centered Yellow Poster Artboard with Figma Selection Handles */}
                  <div className="w-full max-w-sm sm:max-w-md bg-yellow border-3 border-ink shadow-brutal-xl p-6 sm:p-7 space-y-4 relative">
                    {/* Simulated Selection Handle Dots */}
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-blue-500 border border-white"></div>
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-blue-500 border border-white"></div>
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-blue-500 border border-white"></div>
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-500 border border-white"></div>

                    {/* Layer 1: Headline */}
                    <div className="border-2 border-blue-500 bg-white/80 p-2.5 relative shadow-xs">
                      <span className="text-[9px] font-mono font-bold text-blue-600 block uppercase">
                        Layer: {figmaLayers[0].name} (TEXT)
                      </span>
                      <h3 className="font-heading font-black text-base sm:text-lg uppercase text-ink mt-0.5">
                        {figmaLayers[0].text}
                      </h3>
                    </div>

                    {/* Layer 2: Metric Subtitle */}
                    <div className="border border-ink/30 bg-white/70 p-2.5 shadow-xs">
                      <span className="text-[9px] font-mono font-bold text-gray-600 block uppercase">
                        Layer: {figmaLayers[1].name} (TEXT)
                      </span>
                      <p className="font-sans text-xs sm:text-sm font-semibold text-gray-900 mt-0.5">
                        {figmaLayers[1].text}
                      </p>
                    </div>

                    {/* Layer 3: Confidential Note */}
                    <div className="border border-ink/30 bg-white/70 p-2 shadow-xs">
                      <span className="text-[9px] font-mono font-bold text-gray-600 block uppercase">
                        Layer: {figmaLayers[2].name} (TEXT)
                      </span>
                      <p className="font-mono text-[10px] text-gray-700 mt-0.5">
                        {figmaLayers[2].text}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Floating Figma Plugin Panel (5 cols) */}
                <div className="lg:col-span-5 bg-cream border-3 border-ink shadow-brutal-md p-4 flex flex-col justify-between min-h-[460px] space-y-3 font-mono text-xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b-2 border-ink pb-2">
                      <div className="flex items-center gap-1.5 font-bold uppercase text-ink">
                        <ShieldCheck className="w-4 h-4 text-ink stroke-[2.5]" />
                        <span>Verity Figma Guard</span>
                      </div>
                      <span className="px-1.5 py-0.5 bg-mint border border-ink text-[9px] font-bold text-ink">
                        ONLINE // V1.0
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleScanFigma}
                      disabled={figmaScanning}
                      className="w-full brutal-btn brutal-btn-yellow py-2.5 px-3 border-2 font-bold shadow-brutal-sm flex items-center justify-center gap-2 uppercase text-xs"
                    >
                      {figmaScanning ? (
                        <Zap className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                      )}
                      <span>{figmaScanning ? "Traversing Scenegraph..." : "Scan Canvas Text Layers"}</span>
                    </button>

                    {/* Scanned Findings List */}
                    {figmaScanned ? (
                      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                        {/* Layer 1 Fix */}
                        <div className="p-2.5 bg-white border-2 border-ink space-y-1 shadow-xs">
                          <div className="flex justify-between text-[10px]">
                            <span className="font-bold text-gray-600 uppercase">Layer: {figmaLayers[0].name}</span>
                            <span className="px-1.5 bg-yellow border border-ink text-[9px] font-bold">T-3 Tone</span>
                          </div>
                          <div className="text-[11px] text-gray-800 italic">"{figmaLayers[0].text}"</div>
                          <button
                            type="button"
                            onClick={() => applyFigmaFix("layer-1", "CHEAP", "accessible")}
                            className="w-full bg-mint hover:bg-yellow border border-ink text-[10px] font-bold py-1 px-2 uppercase shadow-xs transition-colors"
                          >
                            Apply to Layer: "accessible"
                          </button>
                        </div>

                        {/* Layer 2 Fix */}
                        <div className="p-2.5 bg-white border-2 border-danger space-y-1 shadow-xs">
                          <div className="flex justify-between text-[10px]">
                            <span className="font-bold text-gray-600 uppercase">Layer: {figmaLayers[1].name}</span>
                            <span className="px-1.5 bg-danger text-white border border-ink text-[9px] font-bold">C-1 Claim</span>
                          </div>
                          <div className="text-[11px] text-gray-800 italic">"{figmaLayers[1].text}"</div>
                          <button
                            type="button"
                            onClick={() => applyFigmaFix("layer-2", "#1 student festival in India", "premier collegiate festival in India")}
                            className="w-full bg-mint hover:bg-yellow border border-ink text-[10px] font-bold py-1 px-2 uppercase shadow-xs transition-colors"
                          >
                            Apply to Layer: "premier collegiate festival"
                          </button>
                        </div>

                        {/* Layer 3 Fix */}
                        <div className="p-2.5 bg-white border-2 border-danger space-y-1 shadow-xs">
                          <div className="flex justify-between text-[10px]">
                            <span className="font-bold text-gray-600 uppercase">Layer: {figmaLayers[2].name}</span>
                            <span className="px-1.5 bg-danger text-white border border-ink text-[9px] font-bold">P-1 Confidential</span>
                          </div>
                          <div className="text-[11px] text-gray-800 italic">"{figmaLayers[2].text}"</div>
                          <button
                            type="button"
                            onClick={() => applyFigmaFix("layer-3", "Project Falcon launch.", "[REDACTED]")}
                            className="w-full bg-mint hover:bg-yellow border border-ink text-[10px] font-bold py-1 px-2 uppercase shadow-xs transition-colors"
                          >
                            Apply to Layer: Redact NDA Term
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 bg-white border-2 border-dashed border-gray-300 text-center text-gray-500 text-[11px] space-y-1">
                        <Layers className="w-6 h-6 text-gray-400 mx-auto" />
                        <p>Click <strong>"Scan Canvas Text Layers"</strong> above to traverse artboard text nodes and inspect compliance.</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-gray-300 text-[10px] text-gray-500 text-center">
                    Live Scenegraph Node Mutator • Font Preservation Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
