"use client";

import React, { useState } from "react";
import { 
  Palette, 
  Upload, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  ShieldCheck, 
  Eye, 
  Sparkles, 
  Maximize2, 
  Ratio, 
  Info,
  BookOpen
} from "lucide-react";
import { api } from "@/lib/api";
import { AssetInspectionResult } from "@/lib/types";

export default function AssetInspector() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AssetInspectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInspectSample = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("use_sample", "true");
      const data = await api.submissions.inspectAsset(formData);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to inspect sample brand asset.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const data = await api.submissions.inspectAsset(formData);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to inspect uploaded asset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="brutal-card p-5 bg-yellow border-3 border-ink shadow-brutal-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-ink text-yellow font-mono text-[10px] font-bold px-2 py-0.5 border border-ink uppercase">
                Round 3 Addition
              </span>
              <span className="bg-white text-ink font-mono text-[10px] font-bold px-2 py-0.5 border border-ink">
                Multimodal Computer Vision
              </span>
            </div>
            <h2 className="font-heading font-black text-xl text-ink uppercase tracking-tight">
              Graphic & Banner Asset Governance
            </h2>
            <p className="font-sans text-xs text-gray-800 max-w-2xl">
              Inspect creative banners, posters, and social graphics for official brand color palette tokens, mathematical WCAG 2.1 AA luminance contrast, and safe-zone perimeter clear space.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="brutal-btn brutal-btn-white text-xs py-2 px-3 border-2 flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Poster / Image</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleFileUpload}
                className="hidden"
                disabled={loading}
              />
            </label>

            <button
              type="button"
              onClick={handleInspectSample}
              disabled={loading}
              className="brutal-btn brutal-btn-pink text-xs py-2 px-3 border-2 flex items-center gap-1.5 font-bold shadow-brutal-sm"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>1-Click Load Sample Banner</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 bg-danger text-white font-mono text-xs border-3 border-ink flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="brutal-card p-12 bg-cream text-center space-y-3">
          <div className="inline-block p-4 bg-yellow border-3 border-ink animate-bounce">
            <Palette className="w-8 h-8 text-ink" />
          </div>
          <h3 className="font-heading font-black text-lg text-ink uppercase">
            Computer Vision Pipeline Running...
          </h3>
          <p className="font-mono text-xs text-gray-600">
            Extracting 16-bin color palette tokens, calculating WCAG 2.1 luminance contrast, and inspecting perimeter safe zones.
          </p>
        </div>
      )}

      {/* Results View */}
      {result && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Visual Asset Preview & Metrics (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="brutal-card p-4 bg-white border-3 border-ink shadow-brutal-md space-y-3">
              <div className="flex items-center justify-between border-b-2 border-gray-100 pb-2">
                <span className="font-heading font-bold text-xs uppercase text-ink flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-ink" />
                  Asset Safe-Zone Overlay
                </span>
                <span className="font-mono text-[10px] text-gray-500">
                  {result.filename}
                </span>
              </div>

              {/* Annotated Image */}
              <div className="relative border-2 border-ink bg-gray-50 overflow-hidden flex items-center justify-center p-2">
                <img
                  src={result.annotated_preview_base64}
                  alt="Inspected Graphic Asset"
                  className="w-full h-auto max-h-[360px] object-contain border border-gray-200"
                />
              </div>

              {/* Dimension Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-cream border border-ink">
                  <span className="text-[9px] uppercase font-bold text-gray-500 block">
                    Dimensions:
                  </span>
                  <span className="font-bold text-ink">
                    {result.dimensions.width} × {result.dimensions.height}px
                  </span>
                </div>
                <div className="p-2 bg-cream border border-ink">
                  <span className="text-[9px] uppercase font-bold text-gray-500 block">
                    Aspect Ratio:
                  </span>
                  <span className="font-bold text-ink">
                    {result.dimensions.aspect_ratio} ({result.dimensions.aspect_label})
                  </span>
                </div>
              </div>

              <div className="p-2 bg-gray-50 border border-ink text-xs font-mono flex items-center justify-between">
                <span className="text-gray-600 text-[10px] uppercase font-bold">Resolution Grade:</span>
                <span className="font-bold text-ink">{result.dimensions.resolution_grade}</span>
              </div>
            </div>

            {/* Art Director Evaluation */}
            <div className="brutal-card p-4 bg-white border-3 border-ink space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-heading font-bold uppercase text-ink">
                <Sparkles className="w-4 h-4 text-pink-600" />
                Art Director Synthesis
              </div>
              <p className="font-sans text-xs text-gray-800 leading-relaxed italic bg-yellow/15 p-2.5 border-2 border-ink">
                "{result.art_director_critique}"
              </p>
            </div>
          </div>

          {/* Right: Palette, WCAG Contrast, Clear Space & Findings (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Color Palette Card */}
            <div className="brutal-card p-4 bg-white border-3 border-ink shadow-brutal-md space-y-3">
              <div className="flex items-center justify-between border-b-2 border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-ink" />
                  <span className="font-heading font-bold text-xs uppercase text-ink">
                    Extracted Brand Palette ({Math.round(result.palette_alignment_score * 100)}% Aligned)
                  </span>
                </div>
                <span className="font-mono font-bold text-xs px-2 py-0.5 bg-mint border border-ink text-ink">
                  {Math.round(result.palette_alignment_score * 100)}% BRAND COMPLIANT
                </span>
              </div>

              {/* Swatches Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {result.dominant_palette.map((color, idx) => (
                  <div
                    key={idx}
                    className="p-2 border-2 border-ink bg-white flex flex-col justify-between space-y-1.5 shadow-brutal-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 border-2 border-ink shrink-0 shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="overflow-hidden">
                        <span className="font-mono font-bold text-xs block truncate text-ink">
                          {color.hex}
                        </span>
                        <span className="font-mono text-[10px] text-gray-600 block">
                          {color.percentage}% canvas
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 border text-center font-bold uppercase truncate ${
                        color.is_official
                          ? "bg-mint text-ink border-ink"
                          : "bg-gray-100 text-gray-600 border-gray-400"
                      }`}
                    >
                      {color.brand_token}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contrast & Clear Space Twin Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* WCAG Contrast */}
              <div className="brutal-card p-3.5 bg-white border-3 border-ink space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-xs uppercase text-ink">
                    WCAG 2.1 Contrast
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 border ${
                      result.wcag_contrast.pass_aa
                        ? "bg-mint text-ink border-ink"
                        : "bg-danger text-white border-ink"
                    }`}
                  >
                    {result.wcag_contrast.level} {result.wcag_contrast.pass_aa ? "PASS" : "FAIL"}
                  </span>
                </div>
                <div className="p-2 border-2 border-ink flex items-center justify-between" style={{ backgroundColor: result.wcag_contrast.bg_hex }}>
                  <span className="font-bold text-xs" style={{ color: result.wcag_contrast.fg_hex }}>
                    Sample Foreground Text
                  </span>
                  <span className="font-mono font-bold text-xs px-1.5 py-0.5 bg-white border border-ink text-ink">
                    {result.wcag_contrast.ratio_str}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-gray-600">
                  Calculated luminance ratio between dominant foreground and canvas. Minimum 4.5:1 required.
                </p>
              </div>

              {/* Clear Space Safe Zone */}
              <div className="brutal-card p-3.5 bg-white border-3 border-ink space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-xs uppercase text-ink">
                    Safe-Zone Clear Space
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 border ${
                      result.clear_space.status === "PASSED"
                        ? "bg-mint text-ink border-ink"
                        : "bg-danger text-white border-ink"
                    }`}
                  >
                    {result.clear_space.status}
                  </span>
                </div>
                <div className="p-2 bg-cream border-2 border-ink text-xs font-mono">
                  <span className="text-[10px] block text-gray-600">
                    Mandatory Perimeter Margin:
                  </span>
                  <span className="font-bold text-ink block">
                    {result.clear_space.safe_zone_margin_pct}% Safe Zone Border
                  </span>
                </div>
                <p className="text-[10px] font-mono text-gray-600">
                  {result.clear_space.border_encroachment_detected
                    ? "Elements encroach into perimeter margin; risks cropping."
                    : "Zero element encroachment detected within perimeter."}
                </p>
              </div>
            </div>

            {/* Visual Governance Findings List */}
            <div className="brutal-card p-4 bg-white border-3 border-ink shadow-brutal-sm space-y-2.5">
              <span className="font-heading font-bold text-xs uppercase text-ink block border-b-2 border-gray-100 pb-1.5">
                Visual Governance Findings ({result.findings.length})
              </span>

              <div className="space-y-2">
                {result.findings.map((f, idx) => (
                  <div
                    key={idx}
                    className={`p-3 border-2 border-ink text-xs font-mono space-y-1.5 ${
                      f.severity === "critical"
                        ? "bg-danger/10 border-danger"
                        : f.severity === "warning"
                        ? "bg-yellow/20 border-ink"
                        : "bg-mint/15 border-mint-dark"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-ink flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 shrink-0" />
                        {f.title}
                      </span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-white border border-ink">
                        {f.rule_id}
                      </span>
                    </div>

                    <p className="text-gray-800 font-sans text-xs">
                      {f.message}
                    </p>

                    <div className="text-[10px] font-mono text-gray-600 pt-1 border-t border-gray-200">
                      <span className="font-bold uppercase text-gray-500">Cited Source: </span>
                      <span className="text-ink font-semibold">{f.source_cited}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Initial Empty State Guide */}
      {!result && !loading && (
        <div className="brutal-card p-8 bg-white border-3 border-ink text-center space-y-3">
          <Palette className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="font-heading font-black text-base text-ink uppercase">
            No Creative Asset Loaded
          </h3>
          <p className="font-sans text-xs text-gray-600 max-w-md mx-auto">
            Click <strong>"1-Click Load Sample Banner"</strong> above to immediately test automated brand color token extraction, WCAG 2.1 contrast evaluation, and safe-zone margin inspection.
          </p>
        </div>
      )}
    </div>
  );
}
