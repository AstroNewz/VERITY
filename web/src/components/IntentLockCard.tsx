"use client";

import React, { useState } from "react";
import { IntentLock } from "@/lib/types";
import { Lock, Unlock, AlertTriangle, Check, ShieldCheck, Tag } from "lucide-react";

interface IntentLockCardProps {
  intent: IntentLock;
  onUpdateIntent?: (updated: IntentLock) => void;
}

export default function IntentLockCard({ intent, onUpdateIntent }: IntentLockCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<IntentLock>(intent);

  const isAtRisk = intent.status === "at_risk";

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdateIntent) {
      onUpdateIntent(formData);
    }
  };

  return (
    <div className={`brutal-card p-5 relative overflow-hidden ${isAtRisk ? "border-danger bg-danger-light/30" : "bg-white"}`}>
      {/* Sticker Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-ink">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 border-2 border-ink ${isAtRisk ? "bg-danger text-white" : "bg-mint text-ink"}`}>
            {isAtRisk ? <AlertTriangle className="w-5 h-5 stroke-[2.5]" /> : <Lock className="w-5 h-5 stroke-[2.5]" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-lg tracking-tight uppercase">
                Intent Lock™
              </span>
              <span
                className={`brutal-badge text-[10px] ${
                  isAtRisk ? "bg-danger text-white border-ink" : "bg-mint text-ink border-ink"
                }`}
              >
                {isAtRisk ? "INTENT AT RISK" : "INTENT LOCKED"}
              </span>
            </div>
            <p className="text-xs font-mono text-gray-600">
              Guarantees brand corrections never alter creator purpose
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="brutal-btn brutal-btn-white text-xs py-1.5 px-3.5 border-2 shadow-brutal-sm min-h-[38px]"
        >
          {isEditing ? "Save Intent" : "Edit Intent"}
        </button>
      </div>

      {/* Risk Alert Banner if Intent is threatened */}
      {isAtRisk && (
        <div className="mb-4 p-3 bg-danger text-white border-2 border-ink font-mono text-xs flex items-start gap-2 shadow-brutal-sm">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold uppercase block">Intent Distortion Warning:</span>
            <span>{intent.reason || "Suggested rewrite altered core message or audience action."}</span>
          </div>
        </div>
      )}

      {/* Intent Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div>
          <label className="font-bold uppercase text-gray-700 block mb-1">
            Goal / Objective:
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className="brutal-input text-xs py-1.5"
            />
          ) : (
            <div className="p-2 bg-cream border-2 border-ink font-sans text-xs">
              {intent.goal || "Not specified"}
            </div>
          )}
        </div>

        <div>
          <label className="font-bold uppercase text-gray-700 block mb-1">
            Target Audience:
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.audience}
              onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
              className="brutal-input text-xs py-1.5"
            />
          ) : (
            <div className="p-2 bg-cream border-2 border-ink font-sans text-xs">
              {intent.audience || "General campus community"}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="font-bold uppercase text-gray-700 block mb-1">
            Protected Phrases (Must-Keep):
          </label>
          <div className="flex flex-wrap gap-1.5 p-2 bg-cream border-2 border-ink min-h-[38px] items-center">
            {intent.must_keep_phrases && intent.must_keep_phrases.length > 0 ? (
              intent.must_keep_phrases.map((phrase, idx) => (
                <span
                  key={idx}
                  className="brutal-chip bg-yellow text-ink border border-ink text-[11px]"
                >
                  <Tag className="w-3 h-3" />
                  {phrase}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-xs italic">No specific protected phrases identified</span>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="font-bold uppercase text-gray-700 block mb-1">
            Call to Action (CTA):
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.call_to_action}
              onChange={(e) => setFormData({ ...formData, call_to_action: e.target.value })}
              className="brutal-input text-xs py-1.5"
            />
          ) : (
            <div className="p-2 bg-white border-2 border-ink font-sans text-xs text-ink font-semibold">
              {intent.call_to_action || "Join festival proceedings."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
