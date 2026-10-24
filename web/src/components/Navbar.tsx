"use client";

import React, { useState, useEffect } from "react";
import Link from "next/navigation";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { api } from "@/lib/api";
import { Role } from "@/lib/types";
import { 
  ShieldCheck, 
  RotateCcw, 
  FileText, 
  CheckSquare, 
  BookOpen, 
  Scale, 
  Activity, 
  BarChart3, 
  EyeOff, 
  Sparkles
} from "lucide-react";

export default function Navbar() {
  const { user, role, loginAsRole, resetDemoData, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [resetting, setResetting] = useState(false);
  const [isWakingServer, setIsWakingServer] = useState(false);

  useEffect(() => {
    let coldTimer: any;
    const checkServerHealth = async () => {
      coldTimer = setTimeout(() => {
        setIsWakingServer(true);
      }, 1200);

      try {
        await api.health.check();
        clearTimeout(coldTimer);
        setIsWakingServer(false);
      } catch (err) {
        setIsWakingServer(true);
        const poll = setInterval(async () => {
          try {
            await api.health.check();
            clearInterval(poll);
            setIsWakingServer(false);
          } catch (_) {}
        }, 3000);
      }
    };

    checkServerHealth();

    // 10-minute keep-alive ping (Audit Item C)
    const keepAlive = setInterval(() => {
      api.health.check().catch(() => {});
    }, 10 * 60 * 1000);

    return () => {
      clearTimeout(coldTimer);
      clearInterval(keepAlive);
    };
  }, []);

  const handleRoleChange = async (newRole: Role) => {
    await loginAsRole(newRole);
    if (newRole === "creator") {
      router.push("/workspace");
    } else if (newRole === "reviewer") {
      router.push("/approvals");
    } else if (newRole === "owner") {
      router.push("/constitution");
    }
  };

  const handleReset = async () => {
    if (confirm("Reset demo database back to clean Nova Fest seeded data?")) {
      setResetting(true);
      await resetDemoData();
      setResetting(false);
      window.location.reload();
    }
  };

  const navItems = [
    { label: "Workspace", href: "/workspace", icon: FileText, roleOnly: null },
    { label: "Approvals", href: "/approvals", icon: CheckSquare, roleOnly: null },
    { label: "Constitution", href: "/constitution", icon: BookOpen, roleOnly: null },
    { label: "Claims Ledger", href: "/ledger", icon: Scale, roleOnly: null },
    { label: "Health Radar", href: "/radar", icon: Activity, roleOnly: null },
    { label: "Insights", href: "/insights", icon: BarChart3, roleOnly: null },
    { label: "AI Audit", href: "/ai-logs", icon: EyeOff, roleOnly: null },
  ];

  return (
    <header className="sticky top-0 z-50 bg-cream border-b-3 border-ink">
      {/* Top Banner / Ticker */}
      <div className="bg-ink text-cream py-1 px-4 text-xs font-mono font-bold uppercase tracking-wider flex justify-between items-center overflow-hidden">
        <div className="flex items-center gap-3">
          <span className="bg-yellow text-ink px-2 py-0.5 font-bold">DEMO MODE</span>
          <span>NOVA FEST UNIVERSITY FESTIVAL — BRAND GOVERNANCE ACTIVE</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-gray-300">
          <span>RULE ENFORCEMENT: 100% CITED</span>
          <span className="text-mint">ALL CHECKS LOCAL & SAFE</span>
        </div>
      </div>

      {/* Cold Server Wakeup Alert (Audit Item C) */}
      {isWakingServer && (
        <div className="bg-coral text-white py-2 px-4 text-xs font-mono font-bold flex items-center justify-between border-b-2 border-ink animate-pulse">
          <div className="flex items-center gap-2">
            <span className="animate-spin text-sm">⏳</span>
            <span>Waking the server, this can take up to a minute (Render / Cloud Spin-Up)...</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider bg-ink text-white px-2 py-0.5 border border-white">
            Cold Start Detected
          </span>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-yellow border-3 border-ink flex items-center justify-center shadow-brutal-btn group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ShieldCheck className="w-7 h-7 text-ink stroke-[2.5]" />
              </div>
              <div>
                <span className="text-3xl font-heading font-black tracking-tight text-ink block leading-none">
                  VERITY
                </span>
                <span className="text-[10px] font-mono font-bold tracking-widest text-ink block mt-0.5">
                  CITES BEFORE IT FLAGS
                </span>
              </div>
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href === "/workspace" && pathname === "/");
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-bold uppercase transition-all border-2 ${
                    isActive
                      ? "bg-yellow text-ink border-ink shadow-brutal-sm"
                      : "text-ink border-transparent hover:border-ink hover:bg-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Role Switcher & Reset Button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white border-2 border-ink p-1 shadow-brutal-sm">
              <span className="text-[10px] font-mono font-bold px-2 uppercase text-gray-500 hidden sm:inline">
                ROLE:
              </span>
              <button
                type="button"
                onClick={() => handleRoleChange("creator")}
                className={`px-2.5 py-1 text-xs font-mono font-bold uppercase border-2 transition-all ${
                  role === "creator"
                    ? "bg-yellow text-ink border-ink shadow-brutal-sm"
                    : "border-transparent text-gray-600 hover:text-ink"
                }`}
                title="Switch to Creator: Draft copy and review suggested fixes"
              >
                Creator
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("reviewer")}
                className={`px-2.5 py-1 text-xs font-mono font-bold uppercase border-2 transition-all ${
                  role === "reviewer"
                    ? "bg-periwinkle text-ink border-ink shadow-brutal-sm"
                    : "border-transparent text-gray-600 hover:text-ink"
                }`}
                title="Switch to Reviewer: Approve or request changes"
              >
                Reviewer
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("owner")}
                className={`px-2.5 py-1 text-xs font-mono font-bold uppercase border-2 transition-all ${
                  role === "owner"
                    ? "bg-pink text-ink border-ink shadow-brutal-sm"
                    : "border-transparent text-gray-600 hover:text-ink"
                }`}
                title="Switch to Brand Owner: Manage rules, ledger & radar"
              >
                Owner
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              disabled={resetting}
              className="brutal-btn brutal-btn-white text-xs px-2.5 py-1.5 flex items-center gap-1.5 border-2 shadow-brutal-sm"
              title="Reset seeded demo database"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 bg-white border-t-2 border-ink gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap px-2.5 py-1 text-xs font-mono font-bold border-2 ${
                isActive ? "bg-yellow border-ink" : "border-transparent"
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </header>
  );
}
