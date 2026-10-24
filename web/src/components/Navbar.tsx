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
  Sparkles,
  Menu,
  X,
  ArrowRight
} from "lucide-react";

export default function Navbar() {
  const { user, role, loginAsRole, resetDemoData, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [resetting, setResetting] = useState(false);
  const [isWakingServer, setIsWakingServer] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
            <Activity className="w-4 h-4 animate-spin stroke-[2.5]" />
            <span>Waking the server, this can take up to a minute (Render / Cloud Spin-Up)...</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider bg-ink text-white px-2 py-0.5 border border-white">
            Cold Start Detected
          </span>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <a href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow border-2 sm:border-3 border-ink flex items-center justify-center shadow-brutal-sm sm:shadow-brutal-btn group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0">
                <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-ink stroke-[2.5]" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-ink block leading-none">
                  VERITY
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-widest text-ink block mt-0.5">
                  CITES BEFORE IT FLAGS
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
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

          {/* Role Switcher & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Desktop / Tablet Role Switcher */}
            <div className="hidden sm:flex items-center bg-white border-2 border-ink p-1 shadow-brutal-sm">
              <span className="text-[10px] font-mono font-bold px-2 uppercase text-gray-500 hidden md:inline">
                ROLE:
              </span>
              <button
                type="button"
                onClick={() => handleRoleChange("creator")}
                className={`px-2 sm:px-2.5 py-1 text-xs font-mono font-bold uppercase border-2 transition-all ${
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
                className={`px-2 sm:px-2.5 py-1 text-xs font-mono font-bold uppercase border-2 transition-all ${
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
                className={`px-2 sm:px-2.5 py-1 text-xs font-mono font-bold uppercase border-2 transition-all ${
                  role === "owner"
                    ? "bg-pink text-ink border-ink shadow-brutal-sm"
                    : "border-transparent text-gray-600 hover:text-ink"
                }`}
                title="Switch to Brand Owner: Manage rules, ledger & radar"
              >
                Owner
              </button>
            </div>

            {/* Mobile Active Role Pill (tap to open menu) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden flex items-center gap-1 text-[11px] font-mono font-bold uppercase px-2 py-1 border-2 border-ink bg-yellow shadow-brutal-sm"
            >
              <span>{role}</span>
            </button>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleReset}
              disabled={resetting}
              className="brutal-btn brutal-btn-white text-xs px-2 sm:px-2.5 py-1 sm:py-1.5 flex items-center gap-1.5 border-2 shadow-brutal-sm"
              title="Reset seeded demo database"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
              <span className="hidden md:inline">Reset</span>
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 border-2 border-ink bg-white shadow-brutal-sm hover:bg-yellow transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-ink stroke-[2.5]" />
              ) : (
                <Menu className="w-5 h-5 text-ink stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (When Hamburger is Clicked) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-3 border-ink bg-cream p-4 space-y-4 shadow-brutal-xl">
          {/* Mobile Role Switcher */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-600 block">
              Switch Role & View:
            </span>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs font-bold uppercase">
              <button
                type="button"
                onClick={() => {
                  handleRoleChange("creator");
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-2 text-center border-2 border-ink ${
                  role === "creator" ? "bg-yellow shadow-brutal-sm" : "bg-white"
                }`}
              >
                Creator
              </button>
              <button
                type="button"
                onClick={() => {
                  handleRoleChange("reviewer");
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-2 text-center border-2 border-ink ${
                  role === "reviewer" ? "bg-periwinkle shadow-brutal-sm" : "bg-white"
                }`}
              >
                Reviewer
              </button>
              <button
                type="button"
                onClick={() => {
                  handleRoleChange("owner");
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-2 text-center border-2 border-ink ${
                  role === "owner" ? "bg-pink shadow-brutal-sm" : "bg-white"
                }`}
              >
                Owner
              </button>
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <div className="space-y-1.5 pt-2 border-t-2 border-ink">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-600 block">
              Pages:
            </span>
            <div className="grid grid-cols-1 gap-1.5 font-mono text-xs font-bold uppercase">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-3 border-2 transition-all ${
                      isActive
                        ? "bg-yellow text-ink border-ink shadow-brutal-sm"
                        : "bg-white text-ink border-ink hover:bg-yellow-light"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 stroke-[2.5]" />
                      <span>{item.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Mobile Reset Action */}
          <div className="pt-2 border-t-2 border-ink">
            <button
              type="button"
              onClick={handleReset}
              disabled={resetting}
              className="brutal-btn brutal-btn-white text-xs py-2 px-3 border-2 w-full flex items-center justify-center gap-2 shadow-brutal-sm"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
              <span>Reset Seeded Demo Data</span>
            </button>
          </div>
        </div>
      )}

      {/* Swipeable Tab Bar for Quick Mobile Access */}
      <div className="lg:hidden flex items-center overflow-x-auto px-3 py-1.5 bg-white border-t-2 border-ink gap-1.5 scrollbar-none touch-pan-x">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap px-2.5 py-1 text-xs font-mono font-bold border-2 shrink-0 ${
                isActive ? "bg-yellow border-ink shadow-brutal-sm" : "border-gray-200 text-gray-700"
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
