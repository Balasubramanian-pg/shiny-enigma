"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Scale,
  Star,
  Users,
  Trophy,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Tv,
} from "lucide-react";
import confetti from "canvas-confetti";
import { EPISODES, EpisodeData } from "@/src/data/mentalist-data";
import { sound } from "@/lib/sound";

function CompareContent() {
  const searchParams = useSearchParams();
  const initialEpA = searchParams?.get("epA") || "tm_s01e01";
  const initialEpB = searchParams?.get("epB") || "tm_s06e08";

  const [epAId, setEpAId] = useState<string>(initialEpA);
  const [epBId, setEpBId] = useState<string>(initialEpB);

  const epA = EPISODES.find((e) => e.episode_id === epAId) || EPISODES[0];
  const epB = EPISODES.find((e) => e.episode_id === epBId) || EPISODES[123];

  const handleSelectA = (id: string) => {
    sound.click();
    setEpAId(id);
  };

  const handleSelectB = (id: string) => {
    sound.click();
    setEpBId(id);
  };

  const triggerCompareCelebration = () => {
    sound.success();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#C8102E", "#F59E0B", "#10B981"],
      });
    } catch {
      // Confetti fallback
    }
  };

  // Trigger celebration once on load or when comparison is made
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerCompareCelebration();
    }, 400);
    return () => clearTimeout(timer);
  }, [epAId, epBId]);

  // Determine winners
  const ratingWinner = epA.imdb_rating > epB.imdb_rating ? "A" : epA.imdb_rating < epB.imdb_rating ? "B" : "TIE";
  const viewersWinner = epA.us_viewers_m > epB.us_viewers_m ? "A" : epA.us_viewers_m < epB.us_viewers_m ? "B" : "TIE";
  const votesWinner = epA.imdb_votes > epB.imdb_votes ? "A" : epA.imdb_votes < epB.imdb_votes ? "B" : "TIE";

  const presets = [
    { label: "Pilot vs Red John Climax", a: "tm_s01e01", b: "tm_s06e08" },
    { label: "S04 Climax vs Series Finale", a: "tm_s04e24", b: "tm_s07e13" },
    { label: "Peak Ratings Duel", a: "tm_s04e24", b: "tm_s06e08" },
    { label: "Jane's Origin vs Final Wedding", a: "tm_s05e05", b: "tm_s07e13" },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#C8102E] text-white">
            HEAD-TO-HEAD BENCHMARK
          </span>
          <span className="text-xs text-neutral-400">Quantitative Delta Comparison</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white font-heading">
          Episode Scorecard Comparison
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-body">
          Select any two broadcast episodes across all 7 seasons to inspect relative audience capture and critical rating disparities
        </p>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-neutral-400 font-medium">Curated Benchmarks:</span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              sound.tab();
              setEpAId(p.a);
              setEpBId(p.b);
            }}
            className="px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-[#12161F]/70 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:border-[#C8102E] hover:text-[#C8102E] transition-colors cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Dual Selectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selector A */}
        <div className="p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-[#12161F]/80 backdrop-blur-sm space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#C8102E] uppercase tracking-wider">
              Episode Candidate A
            </span>
            <span className="text-xs font-mono text-neutral-400">
              S0{epA.season_no} · E{epA.episode_no}
            </span>
          </div>
          <select
            value={epAId}
            onChange={(e) => handleSelectA(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8102E] cursor-pointer"
          >
            {EPISODES.map((e) => (
              <option key={e.episode_id} value={e.episode_id}>
                S{e.season_no}E{e.episode_no < 10 ? `0${e.episode_no}` : e.episode_no} - {e.title} ({e.imdb_rating} ★)
              </option>
            ))}
          </select>
        </div>

        {/* Selector B */}
        <div className="p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-[#12161F]/80 backdrop-blur-sm space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Episode Candidate B
            </span>
            <span className="text-xs font-mono text-neutral-400">
              S0{epB.season_no} · E{epB.episode_no}
            </span>
          </div>
          <select
            value={epBId}
            onChange={(e) => handleSelectB(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8102E] cursor-pointer"
          >
            {EPISODES.map((e) => (
              <option key={e.episode_id} value={e.episode_id}>
                S{e.season_no}E{e.episode_no < 10 ? `0${e.episode_no}` : e.episode_no} - {e.title} ({e.imdb_rating} ★)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Head-to-Head Comparative Scorecard */}
      <div className="p-6 sm:p-8 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#10141D]/80 backdrop-blur-md shadow-lg space-y-6">
        {/* Titles Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <span className="px-2 py-0.5 rounded bg-[#C8102E] text-white text-[10px] font-bold">
              CANDIDATE A
            </span>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1 font-heading">
              {epA.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{epA.air_date}</span>
              <span>·</span>
              <span>Overall #{epA.overall_no}</span>
            </div>
          </div>

          <div>
            <span className="px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px] font-bold">
              CANDIDATE B
            </span>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1 font-heading">
              {epB.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{epB.air_date}</span>
              <span>·</span>
              <span>Overall #{epB.overall_no}</span>
            </div>
          </div>
        </div>

        {/* METRIC 1: IMDb RATING */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            <span>IMDb Critical Rating</span>
            <span className="font-mono text-neutral-400">Scale 1.0 – 10.0</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`p-4 rounded-xl border transition-all ${
                ratingWinner === "A"
                  ? "border-[#C8102E] bg-[#C8102E]/10 dark:bg-[#C8102E]/20"
                  : "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="text-3xl font-bold text-neutral-900 dark:text-white font-heading">
                    {epA.imdb_rating}
                  </span>
                </div>
                {ratingWinner === "A" && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-[#C8102E] text-white animate-pulse">
                    Apex Rating (+{(epA.imdb_rating - epB.imdb_rating).toFixed(1)})
                  </span>
                )}
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden mt-3">
                <div
                  style={{ width: `${(epA.imdb_rating / 10) * 100}%` }}
                  className={`h-full rounded-full ${ratingWinner === "A" ? "bg-[#C8102E]" : "bg-neutral-400"}`}
                />
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border transition-all ${
                ratingWinner === "B"
                  ? "border-[#C8102E] bg-[#C8102E]/10 dark:bg-[#C8102E]/20"
                  : "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="text-3xl font-bold text-neutral-900 dark:text-white font-heading">
                    {epB.imdb_rating}
                  </span>
                </div>
                {ratingWinner === "B" && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-[#C8102E] text-white animate-pulse">
                    Apex Rating (+{(epB.imdb_rating - epA.imdb_rating).toFixed(1)})
                  </span>
                )}
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden mt-3">
                <div
                  style={{ width: `${(epB.imdb_rating / 10) * 100}%` }}
                  className={`h-full rounded-full ${ratingWinner === "B" ? "bg-[#C8102E]" : "bg-neutral-400"}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* METRIC 2: US AUDIENCE (VIEWERS M) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            <span>Nielsen Live+SD US Audience</span>
            <span className="font-mono text-neutral-400">In Millions of Viewers</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`p-4 rounded-xl border transition-all ${
                viewersWinner === "A"
                  ? "border-[#C8102E] bg-[#C8102E]/10 dark:bg-[#C8102E]/20"
                  : "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-neutral-500" />
                  <span className="text-3xl font-bold text-neutral-900 dark:text-white font-heading">
                    {epA.us_viewers_m}M
                  </span>
                </div>
                {viewersWinner === "A" && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-600 text-white">
                    +{(epA.us_viewers_m - epB.us_viewers_m).toFixed(1)}M More Viewers
                  </span>
                )}
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border transition-all ${
                viewersWinner === "B"
                  ? "border-[#C8102E] bg-[#C8102E]/10 dark:bg-[#C8102E]/20"
                  : "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-neutral-500" />
                  <span className="text-3xl font-bold text-neutral-900 dark:text-white font-heading">
                    {epB.us_viewers_m}M
                  </span>
                </div>
                {viewersWinner === "B" && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-600 text-white">
                    +{(epB.us_viewers_m - epA.us_viewers_m).toFixed(1)}M More Viewers
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CREDITS & SYNOPSIS BREAKDOWN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="space-y-3">
            <div className="text-xs font-mono text-neutral-400 space-y-1">
              <div><strong>Directed by:</strong> {epA.directed_by}</div>
              <div><strong>Written by:</strong> {epA.written_by}</div>
              <div><strong>IMDb Votes:</strong> {epA.imdb_votes.toLocaleString()}</div>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {epA.synopsis}
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-mono text-neutral-400 space-y-1">
              <div><strong>Directed by:</strong> {epB.directed_by}</div>
              <div><strong>Written by:</strong> {epB.written_by}</div>
              <div><strong>IMDb Votes:</strong> {epB.imdb_votes.toLocaleString()}</div>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {epB.synopsis}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm text-neutral-400 font-mono">
          Loading comparison workbench...
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
