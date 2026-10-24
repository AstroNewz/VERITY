"use client";

import React, { useState, useEffect } from "react";
import { DemoPost } from "@/lib/types";
import { api } from "@/lib/api";
import { Sparkles, ChevronDown, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from "lucide-react";

interface DemoLoaderProps {
  onSelectPost: (post: DemoPost) => void;
  selectedPostId?: string;
}

export default function DemoLoader({ onSelectPost, selectedPostId }: DemoLoaderProps) {
  const [posts, setPosts] = useState<DemoPost[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await api.auth.getDemoPosts();
        setPosts(data);
      } catch (err) {
        console.error("Failed to load demo posts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const activePost = posts.find((p) => p.id === selectedPostId);

  return (
    <div className="relative w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-yellow border-3 border-ink shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <div className="bg-ink text-yellow p-1.5 border-2 border-ink">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-heading font-black text-sm uppercase block tracking-tight">
              One-Click Judge Presets
            </span>
            <span className="text-[11px] font-mono text-gray-800 block">
              Load seeded drafts with planted errors or clean copy
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick button for main demo post */}
          <button
            type="button"
            onClick={() => posts.length > 0 && onSelectPost(posts[0])}
            className="brutal-btn brutal-btn-white text-xs py-1.5 px-3 border-2 flex items-center gap-1.5 font-bold"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Load Demo Post #1</span>
          </button>

          {/* Dropdown for all 6 presets */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="brutal-btn brutal-btn-white text-xs py-1.5 px-3 border-2 flex items-center gap-2"
            >
              <span>{activePost ? activePost.title.slice(0, 18) + "..." : "All 6 Presets"}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border-3 border-ink shadow-brutal-card z-50 p-2 space-y-1.5">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 px-2 py-1 border-b-2 border-gray-100">
                  Select Seeded Test Case:
                </div>
                {posts.map((post, idx) => {
                  const isClean = post.id === "demo_post_clean";
                  const isComprehensive = post.id === "demo_post_comprehensive";
                  return (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => {
                        onSelectPost(post);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left p-2.5 border-2 transition-all ${
                        selectedPostId === post.id
                          ? "bg-yellow border-ink shadow-brutal-sm"
                          : "border-transparent hover:border-ink hover:bg-cream"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-bold text-xs uppercase text-ink">
                          #{idx + 1}. {post.title}
                        </span>
                        {isClean ? (
                          <span className="brutal-chip bg-mint text-[9px] py-0 px-1 border">Clean</span>
                        ) : isComprehensive ? (
                          <span className="brutal-chip bg-pink text-[9px] py-0 px-1 border">Planted</span>
                        ) : null}
                      </div>
                      <p className="text-[11px] font-sans text-gray-600 mt-1 line-clamp-2">
                        {post.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
