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
      <div className="flex items-center justify-between overflow-x-auto gap-2 pb-1">
        {steps.map((step) => {
          const isDone = currentStep > step.num;
          const isCurrent = currentStep === step.num;
          const Icon = step.icon;

          return (
            <div key={step.num} className="flex items-center gap-2 flex-1 min-w-[140px]">
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
