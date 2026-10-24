"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { AIUsageLogItem } from "@/lib/types";
import { EyeOff, ShieldCheck, Cpu, Sparkles, Lock } from "lucide-react";

export default function AILogsPage() {
  const [logs, setLogs] = useState<AIUsageLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const data = await api.aiLogs.list();
        setLogs(data);
      } catch (err) {
        console.error("Failed to load AI logs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-periwinkle border-3 border-ink shadow-brutal-card">
        <div>
          <span className="brutal-chip bg-white text-ink text-[10px] mb-1 inline-block">
            PRIVACY GATEWAY & TRANSPARENCY
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight uppercase text-ink">
            AI Usage & Redaction Audit Trail
          </h1>
          <p className="text-xs font-mono text-gray-800 mt-1">
            Complete audit trail of all external LLM prompts, model identifiers, and privacy redaction counts.
          </p>
        </div>
      </div>

      {/* Privacy Guarantee Card */}
      <div className="brutal-card p-6 bg-white space-y-3 border-3 border-ink">
        <div className="flex items-center gap-2 pb-2 border-b-2 border-ink">
          <Lock className="w-5 h-5 text-ink stroke-[2.5]" />
          <h2 className="font-heading font-black text-lg uppercase">
            Verity Zero-Leakage Privacy Gateway
          </h2>
        </div>

        <p className="text-xs font-mono text-gray-700 leading-relaxed">
          Before user content is sent to Groq AI, Verity strips out emails, phone numbers, and confidential codenames (like <strong>Project Falcon</strong>), replacing them with synthetic tokens (`[REDACTED-CONFIDENTIAL-1]`). The mapping is preserved securely in memory to restore original phrases in suggested fixes.
        </p>

        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
          <span className="brutal-chip bg-mint text-ink flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" /> NO RAW PII SENT TO LLMs
          </span>
          <span className="brutal-chip bg-yellow text-ink flex items-center gap-1.5 font-bold">
            <Lock className="w-3.5 h-3.5 stroke-[2.5]" /> PROMPT-INJECTION SAFE DELIMITERS
          </span>
          <span className="brutal-chip bg-white text-ink flex items-center gap-1.5 font-bold">
            <Cpu className="w-3.5 h-3.5 stroke-[2.5]" /> AUDITABLE PER-REQUEST LOGS
          </span>
        </div>
      </div>

      {/* Logs Table */}
      <div className="brutal-card p-6 bg-white space-y-4">
        <div className="flex items-center justify-between pb-2 border-b-2 border-ink">
          <h2 className="font-heading font-black text-lg uppercase">
            Prompt Dispatches ({logs.length})
          </h2>
          <span className="text-xs font-mono font-bold text-gray-500">Live Audit Trail</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-gray-500">
            Loading privacy audit logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-gray-500">
            No external AI calls logged yet. Run a governance review with confidential terms to see logs appear.
          </div>
        ) : (
          <>
            {/* Mobile Card List (< lg) */}
            <div className="block lg:hidden space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="brutal-card p-4 space-y-3 bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink/20 pb-2">
                    <span className="font-mono font-bold text-xs bg-yellow px-2 py-0.5 border border-ink">
                      {log.id}
                    </span>
                    <span
                      className={`brutal-chip text-[9px] py-0 px-2 ${
                        log.redactions_count > 0 ? "bg-mint text-ink font-bold" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {log.redactions_count} REDACTION{log.redactions_count === 1 ? "" : "S"}
                    </span>
                  </div>

                  <div>
                    <span className="font-heading font-black text-xs text-ink block mb-0.5">PURPOSE:</span>
                    <p className="font-sans text-xs text-ink">{log.purpose}</p>
                  </div>

                  <div className="pt-2 border-t border-ink/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                    <span className="brutal-chip bg-yellow text-ink text-[10px] border border-ink">
                      {log.model}
                    </span>
                    <span className="text-gray-600 text-[10px]">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= lg) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="p-3 border-2 border-ink uppercase">Log ID</th>
                    <th className="p-3 border-2 border-ink uppercase">Timestamp</th>
                    <th className="p-3 border-2 border-ink uppercase">AI Model</th>
                    <th className="p-3 border-2 border-ink uppercase">Purpose</th>
                    <th className="p-3 border-2 border-ink uppercase">Tokens Redacted</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b-2 border-ink hover:bg-cream transition-colors">
                      <td className="p-3 border-2 border-ink font-bold text-ink">
                        {log.id}
                      </td>
                      <td className="p-3 border-2 border-ink text-gray-600">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="p-3 border-2 border-ink font-semibold">
                        <span className="brutal-chip bg-yellow text-ink text-[10px]">
                          {log.model}
                        </span>
                      </td>
                      <td className="p-3 border-2 border-ink font-sans text-xs">
                        {log.purpose}
                      </td>
                      <td className="p-3 border-2 border-ink">
                        <span
                          className={`brutal-chip text-[10px] ${
                            log.redactions_count > 0 ? "bg-mint text-ink font-bold" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {log.redactions_count} Redactions
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
