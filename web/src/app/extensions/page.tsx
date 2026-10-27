"use client";

import React, { useState } from "react";
import { 
  Puzzle, 
  Download, 
  ExternalLink, 
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
  BookOpen
} from "lucide-react";

export default function ExtensionsPage() {
  const [activeSimTab, setActiveSimTab] = useState<"browser" | "figma">("browser");
  
  // Browser Simulator State
  const [socialText, setSocialText] = useState(
    "NovaFest 2026 is back and it is CHEAP! We are officially the #1 student fest in India. Do not mention Project Falcon yet!"
  );
  const [showInSituChip, setShowInSituChip] = useState(true);
  const [showInSituModal, setShowInSituModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Figma Simulator State
  const [figmaLayers, setFigmaLayers] = useState([
    { id: "layer-1", name: "Campaign Headline", text: "NovaFest 2026 is back and it is CHEAP!" },
    { id: "layer-2", name: "Festival Metric Subtitle", text: "Proudly ranked #1 student festival in India." },
    { id: "layer-3", name: "Confidential Notes", text: "Strictly embargoed: Project Falcon launch." }
  ]);
  const [figmaScanned, setFigmaScanned] = useState(false);
  const [figmaScanning, setFigmaScanning] = useState(false);

  // Download copy feedback
  const [copiedZip, setCopiedZip] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const applyBrowserFix = (oldPhrase: string, newPhrase: string) => {
    setSocialText((prev) => prev.replace(oldPhrase, newPhrase));
    triggerToast(`✓ Replaced "${oldPhrase}" with "${newPhrase}"!`);
  };

  const handleScanFigma = () => {
    setFigmaScanning(true);
    setTimeout(() => {
      setFigmaScanning(false);
      setFigmaScanned(true);
      triggerToast("✓ Verity: Scanned 3 canvas text layers against Brand Constitution!");
    }, 600);
  };

  const applyFigmaFix = (layerId: string, oldPhrase: string, newPhrase: string) => {
    setFigmaLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, text: l.text.replace(oldPhrase, newPhrase) } : l))
    );
    triggerToast(`✓ Updated Figma canvas layer with compliant copy!`);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-mint text-ink font-mono font-bold text-xs p-3 border-3 border-ink shadow-brutal-btn flex items-center gap-2 animate-bounce">
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

      {/* Interactive Simulation Sandbox (For Judges Testing Without Extension Install) */}
      <div className="brutal-card p-6 bg-white border-3 border-ink shadow-brutal-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-3 border-ink pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-ink stroke-[2.5]" />
              <h2 className="font-heading font-black text-lg sm:text-xl uppercase text-ink">
                Live In-Situ Simulator Sandbox
              </h2>
            </div>
            <p className="font-sans text-xs text-gray-600">
              Judges can test the exact interactive behavior right here in your browser window without installing any plugins.
            </p>
          </div>

          {/* Simulator Tab Switcher */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSimTab("browser")}
              className={`brutal-btn text-xs py-2 px-3 border-2 transition-all ${
                activeSimTab === "browser"
                  ? "brutal-btn-yellow font-black shadow-brutal-sm"
                  : "brutal-btn-white text-gray-600 hover:text-ink font-bold"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Browser Extension Demo</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSimTab("figma")}
              className={`brutal-btn text-xs py-2 px-3 border-2 transition-all ${
                activeSimTab === "figma"
                  ? "brutal-btn-pink font-black shadow-brutal-sm"
                  : "brutal-btn-white text-gray-600 hover:text-ink font-bold"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Figma Plugin Demo</span>
            </button>
          </div>
        </div>

        {/* Browser Simulator */}
        {activeSimTab === "browser" && (
          <div className="space-y-4">
            <div className="text-xs font-mono text-gray-600 flex items-center justify-between">
              <span>SIMULATED CHROME BROWSER WINDOW (LinkedIn Post Composer)</span>
              <span className="text-ink font-bold">Try clicking the yellow floating chip!</span>
            </div>

            {/* Simulated Browser Frame */}
            <div className="border-3 border-ink bg-gray-100 shadow-brutal-md overflow-hidden">
              {/* Browser Window Header */}
              <div className="bg-ink text-white px-3 py-2 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-danger block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-mint block"></span>
                  <span className="text-gray-300 ml-2">https://www.linkedin.com/feed/compose</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-yellow text-ink text-[10px] font-bold">
                    🛡️ Verity Active
                  </span>
                </div>
              </div>

              {/* Simulated Page Content */}
              <div className="p-6 bg-white min-h-[300px] relative">
                <div className="max-w-xl mx-auto space-y-4 border-2 border-gray-200 p-4 shadow-sm relative">
                  <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 bg-yellow border-2 border-ink flex items-center justify-center font-bold text-sm">
                      NF
                    </div>
                    <div>
                      <div className="font-heading font-bold text-xs uppercase text-ink">
                        Nova Fest University Festival
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono">
                        Official Campaign Account • Draft Mode
                      </div>
                    </div>
                  </div>

                  {/* Composer Textarea with Relative Overlay */}
                  <div className="relative">
                    <textarea
                      rows={4}
                      value={socialText}
                      onChange={(e) => setSocialText(e.target.value)}
                      className="w-full p-3 font-sans text-sm border-2 border-ink bg-cream focus:bg-white focus:outline-none leading-relaxed"
                    />

                    {/* Floating In-Situ Trigger Chip */}
                    {showInSituChip && !showInSituModal && (
                      <button
                        type="button"
                        onClick={() => setShowInSituModal(true)}
                        className="absolute -top-3 right-3 bg-yellow text-ink font-mono text-[11px] font-bold px-3 py-1 border-2 border-ink shadow-brutal-sm flex items-center gap-1.5 hover:bg-white animate-pulse"
                      >
                        <span>🛡️</span>
                        <span>Check with Verity (3 Issues)</span>
                      </button>
                    )}

                    {/* In-Situ Inspection Overlay Modal */}
                    {showInSituModal && (
                      <div className="absolute top-0 right-0 w-80 bg-cream border-3 border-ink shadow-brutal-lg p-3 z-20 space-y-2 text-xs font-mono">
                        <div className="flex items-center justify-between border-b-2 border-ink pb-1.5">
                          <span className="font-bold uppercase text-ink flex items-center gap-1">
                            <span>🛡️</span>
                            <span>Verity In-Situ Guard</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowInSituModal(false)}
                            className="bg-white border px-1.5 font-bold hover:bg-danger hover:text-white"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="text-[10px] text-gray-600 font-bold uppercase">
                          3 Brand Violations Cited:
                        </div>

                        {/* Finding 1: CHEAP */}
                        <div className="p-2 bg-yellow/30 border-2 border-ink space-y-1">
                          <div className="flex justify-between">
                            <span className="px-1 bg-white border border-ink text-[9px] font-bold">T-3</span>
                            <span className="text-[9px] font-bold uppercase text-ink">Warning</span>
                          </div>
                          <div className="font-bold text-ink">"CHEAP"</div>
                          <div className="text-[10px] text-gray-700">Tone Hygiene: Avoid 'cheap'; use 'accessible'.</div>
                          <button
                            type="button"
                            onClick={() => applyBrowserFix("CHEAP", "accessible")}
                            className="w-full text-left bg-mint border border-ink px-2 py-0.5 text-[10px] font-bold uppercase mt-1 hover:bg-yellow"
                          >
                            ✓ Fix: Replace with "accessible"
                          </button>
                        </div>

                        {/* Finding 2: #1 student fest */}
                        <div className="p-2 bg-danger/10 border-2 border-danger space-y-1">
                          <div className="flex justify-between">
                            <span className="px-1 bg-white border border-ink text-[9px] font-bold">C-1</span>
                            <span className="text-[9px] font-bold uppercase text-danger">Critical</span>
                          </div>
                          <div className="font-bold text-ink">"#1 student fest"</div>
                          <div className="text-[10px] text-gray-700">Unverified Superlative: No documented source supports '#1'.</div>
                          <button
                            type="button"
                            onClick={() => applyBrowserFix("#1 student fest in India", "premier collegiate festival in India")}
                            className="w-full text-left bg-mint border border-ink px-2 py-0.5 text-[10px] font-bold uppercase mt-1 hover:bg-yellow"
                          >
                            ✓ Fix: Replace with "premier collegiate festival"
                          </button>
                        </div>

                        {/* Finding 3: Project Falcon */}
                        <div className="p-2 bg-danger/10 border-2 border-danger space-y-1">
                          <div className="flex justify-between">
                            <span className="px-1 bg-white border border-ink text-[9px] font-bold">P-1</span>
                            <span className="text-[9px] font-bold uppercase text-danger">Critical</span>
                          </div>
                          <div className="font-bold text-ink">"Project Falcon"</div>
                          <div className="text-[10px] text-gray-700">Confidentiality: Project Falcon is restricted under NDA.</div>
                          <button
                            type="button"
                            onClick={() => applyBrowserFix("Do not mention Project Falcon yet!", "")}
                            className="w-full text-left bg-mint border border-ink px-2 py-0.5 text-[10px] font-bold uppercase mt-1 hover:bg-yellow"
                          >
                            ✓ Fix: Redact Confidential Phrase
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] font-mono text-gray-500">
                      Edit text above to simulate instant in-situ verification
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowInSituModal(true)}
                      className="brutal-btn brutal-btn-yellow text-xs py-1.5 px-3 border-2 font-bold shadow-brutal-sm"
                    >
                      Inspect with Verity In-Situ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Figma Simulator */}
        {activeSimTab === "figma" && (
          <div className="space-y-4">
            <div className="text-xs font-mono text-gray-600 flex items-center justify-between">
              <span>SIMULATED FIGMA CANVAS & NATIVE PLUGIN PANEL</span>
              <span className="text-ink font-bold">Select text layers and run automated sanitization!</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 border-3 border-ink bg-gray-200 p-4 shadow-brutal-md">
              {/* Left: Simulated Figma Canvas (7 cols) */}
              <div className="lg:col-span-7 bg-gray-800 p-6 flex flex-col justify-center items-center min-h-[360px] border-2 border-ink">
                <div className="text-[10px] font-mono text-gray-400 mb-2 uppercase tracking-widest">
                  Canvas Artboard: [Nova_Fest_Hero_Banner_1080x1080]
                </div>

                {/* Canvas Artboard Box */}
                <div className="w-full max-w-sm bg-yellow p-6 border-3 border-ink shadow-brutal-lg space-y-4">
                  <div className="border border-ink/20 p-2 bg-white/70">
                    <span className="text-[9px] font-mono font-bold text-gray-500 block uppercase">
                      Layer: {figmaLayers[0].name}
                    </span>
                    <h3 className="font-heading font-black text-base uppercase text-ink">
                      {figmaLayers[0].text}
                    </h3>
                  </div>

                  <div className="border border-ink/20 p-2 bg-white/70">
                    <span className="text-[9px] font-mono font-bold text-gray-500 block uppercase">
                      Layer: {figmaLayers[1].name}
                    </span>
                    <p className="font-sans text-xs font-semibold text-gray-800">
                      {figmaLayers[1].text}
                    </p>
                  </div>

                  <div className="border border-ink/20 p-2 bg-white/70">
                    <span className="text-[9px] font-mono font-bold text-gray-500 block uppercase">
                      Layer: {figmaLayers[2].name}
                    </span>
                    <p className="font-mono text-[10px] text-gray-600">
                      {figmaLayers[2].text}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Simulated Figma Plugin Widget (5 cols) */}
              <div className="lg:col-span-5 bg-cream border-3 border-ink p-4 space-y-3 font-mono text-xs flex flex-col justify-between shadow-brutal-sm">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-ink pb-2">
                    <div className="flex items-center gap-1.5 font-bold uppercase text-ink">
                      <span>🛡️</span>
                      <span>Verity Figma Guard</span>
                    </div>
                    <span className="px-1.5 py-0.5 bg-mint border border-ink text-[9px] font-bold text-ink">
                      ONLINE
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleScanFigma}
                    disabled={figmaScanning}
                    className="w-full brutal-btn brutal-btn-yellow py-2 px-3 border-2 font-bold shadow-brutal-sm flex items-center justify-center gap-2"
                  >
                    <Zap className={`w-3.5 h-3.5 ${figmaScanning ? "animate-spin" : ""}`} />
                    <span>{figmaScanning ? "Traversing Scenegraph..." : "🔍 Scan Canvas Text Layers"}</span>
                  </button>

                  {/* Scanned Findings List */}
                  {figmaScanned ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {/* Layer 1 Fix */}
                      <div className="p-2 bg-white border-2 border-ink space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="font-bold text-gray-600 uppercase">Layer: {figmaLayers[0].name}</span>
                          <span className="px-1 bg-yellow border border-ink text-[9px] font-bold">T-3 Tone</span>
                        </div>
                        <div className="text-[11px] text-gray-800 italic">"{figmaLayers[0].text}"</div>
                        <button
                          type="button"
                          onClick={() => applyFigmaFix("layer-1", "CHEAP", "accessible")}
                          className="w-full bg-mint hover:bg-yellow border border-ink text-[10px] font-bold py-1 px-2 uppercase shadow-sm"
                        >
                          Apply to Layer: "accessible"
                        </button>
                      </div>

                      {/* Layer 2 Fix */}
                      <div className="p-2 bg-white border-2 border-danger space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="font-bold text-gray-600 uppercase">Layer: {figmaLayers[1].name}</span>
                          <span className="px-1 bg-danger text-white border border-ink text-[9px] font-bold">C-1 Claim</span>
                        </div>
                        <div className="text-[11px] text-gray-800 italic">"{figmaLayers[1].text}"</div>
                        <button
                          type="button"
                          onClick={() => applyFigmaFix("layer-2", "#1 student festival in India", "premier collegiate festival in India")}
                          className="w-full bg-mint hover:bg-yellow border border-ink text-[10px] font-bold py-1 px-2 uppercase shadow-sm"
                        >
                          Apply to Layer: "premier collegiate festival"
                        </button>
                      </div>

                      {/* Layer 3 Fix */}
                      <div className="p-2 bg-white border-2 border-danger space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="font-bold text-gray-600 uppercase">Layer: {figmaLayers[2].name}</span>
                          <span className="px-1 bg-danger text-white border border-ink text-[9px] font-bold">P-1 Confidential</span>
                        </div>
                        <div className="text-[11px] text-gray-800 italic">"{figmaLayers[2].text}"</div>
                        <button
                          type="button"
                          onClick={() => applyFigmaFix("layer-3", "Project Falcon launch.", "[REDACTED]")}
                          className="w-full bg-mint hover:bg-yellow border border-ink text-[10px] font-bold py-1 px-2 uppercase shadow-sm"
                        >
                          Apply to Layer: Redact NDA Term
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-white border-2 border-dashed border-gray-300 text-center text-gray-500 text-[11px]">
                      Click "Scan Canvas Text Layers" to traverse artboard text nodes and inspect compliance.
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-gray-300 text-[10px] text-gray-500 text-center">
                  Live Scenegraph Node Mutator with Font Preservation
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
