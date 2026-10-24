"use client";

import React from "react";
import { Upload, Lock, ShieldAlert, CheckCircle, Send, Award } from "lucide-react";

interface WorkflowStepperProps {
  currentStep: number; // 1 to 6
}

export default function WorkflowStepper({ currentStep }: WorkflowStepperProps) {
  const steps = [
    { num: 1, label: "Upload & Paste", icon: Upload },
    { num: 2, label: "Intent Lock", icon: Lock },
    { num: 3, label: "Verity Engine", icon: ShieldAlert },
    { num: 4, label: "Decide Fixes", icon: CheckCircle },
    { num: 5, label: "Submit Review", icon: Send },
    { num: 6, label: "Publish Passport", icon: Award },
  ];

  return (
    <div className="w-full bg-white border-3 border-ink p-3 shadow-brutal-card mb-6">
      {/* Mobile Step Header (< sm) */}
      <div className="sm:hidden space-y-2">
        <div className="flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 flex items-center justify-center font-bold text-xs bg-yellow border-2 border-ink shadow-brutal-sm">
              {currentStep}
            </span>
            <span className="font-bold text-xs uppercase text-ink">
              Step {currentStep}/6: {steps[currentStep - 1]?.label || "Workflow"}
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-700 bg-mint-light px-1.5 py-0.5 border border-mint-dark">
            {currentStep >= 5 ? "Review Ready" : "In Progress"}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-gray-100 border-2 border-ink h-2.5 overflow-hidden">
          <div
            className="bg-yellow h-full border-r-2 border-ink transition-all duration-300"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Tablet & Desktop Horizontal Stepper (>= sm) */}
      <div className="hidden sm:flex items-center justify-between overflow-x-auto gap-2 pb-1 scrollbar-none">
        {steps.map((step) => {
          const isDone = currentStep > step.num;
          const isCurrent = currentStep === step.num;
          const Icon = step.icon;

          return (
            <div key={step.num} className="flex items-center gap-2 flex-1 min-w-[130px]">
              <div
                className={`w-8 h-8 flex items-center justify-center font-mono font-bold text-xs border-2 transition-all ${
                  isCurrent
                    ? "bg-yellow text-ink border-ink shadow-brutal-sm scale-105"
                    : isDone
                    ? "bg-mint text-ink border-ink"
                    : "bg-gray-100 text-gray-400 border-gray-300"
                }`}
              >
                {isDone ? <CheckCircle className="w-4 h-4 stroke-[2.5]" /> : step.num}
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                    isCurrent ? "text-ink underline decoration-yellow decoration-3" : isDone ? "text-ink" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[9px] font-mono text-gray-500 uppercase">
                  {isCurrent ? "Active Step" : isDone ? "Completed" : "Pending"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
