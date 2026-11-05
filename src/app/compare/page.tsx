"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Star,
  Users,
  Calendar,
} from "lucide-react";
import confetti from "canvas-confetti";
import { EPISODES } from "@/src/data/mentalist-data";
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
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
      });
    } catch {
      // Confetti fallback
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerCompareCelebration();
    }, 400);
    return () => clearTimeout(timer);
  }, [epAId, epBId]);

  // Determine winners
  const ratingWinner = epA.imdb_rating > epB.imdb_rating ? "A" : epA.imdb_rating < epB.imdb_rating ? "B" : "TIE";
  const viewersWinner = epA.us_viewers_m > epB.us_viewers_m ? "A" : epA.us_viewers_m < epB.us_viewers_m ? "B" : "TIE";

  const presets = [
    { label: "Pilot vs Red John Climax", a: "tm_s01e01", b: "tm_s06e08" },
    { label: "Season 4 Climax vs Series Finale", a: "tm_s04e24", b: "tm_s07e13" },
    { label: "Peak Ratings Duel", a: "tm_s04e24", b: "tm_s06e08" },
    { label: "Jane’s Origin vs Final Wedding", a: "tm_s05e05", b: "tm_s07e13" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
          Episode Scorecard Comparison
        </h1>
        <p className="mt-2 text-sm text-muted">
          Select any two broadcast episodes across all 7 seasons to inspect relative audience capture and critical rating disparities.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted font-medium">Curated benchmarks:</span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              sound.tab();
              setEpAId(p.a);
              setEpBId(p.b);
            }}
            className="px-3 py-1 rounded-lg border border-rule bg-paper-2 text-xs font-medium text-ink-2 hover:border-accent hover:text-accent active:opacity-85 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus transition-colors duration-150 cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Dual Selectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selector A */}
        <div className="p-5 rounded-xl border border-rule bg-paper-2 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-accent">
              Episode Candidate A
            </span>
            <span className="text-xs text-muted tabular-nums">
              Season {epA.season_no}, Episode {epA.episode_no}
            </span>
          </div>
          <select
            aria-label="Select Episode Candidate A"
            value={epAId}
            onChange={(e) => handleSelectA(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-rule bg-paper text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus disabled:opacity-40 cursor-pointer"
          >
            {EPISODES.map((e) => (
              <option key={e.episode_id} value={e.episode_id}>
                Season {e.season_no}, Episode {e.episode_no} - {e.title} ({e.imdb_rating} / 10)
              </option>
            ))}
          </select>
        </div>

        {/* Selector B */}
        <div className="p-5 rounded-xl border border-rule bg-paper-2 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted">
              Episode Candidate B
            </span>
            <span className="text-xs text-muted tabular-nums">
              Season {epB.season_no}, Episode {epB.episode_no}
            </span>
          </div>
          <select
            aria-label="Select Episode Candidate B"
            value={epBId}
            onChange={(e) => handleSelectB(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-rule bg-paper text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus disabled:opacity-40 cursor-pointer"
          >
            {EPISODES.map((e) => (
              <option key={e.episode_id} value={e.episode_id}>
                Season {e.season_no}, Episode {e.episode_no} - {e.title} ({e.imdb_rating} / 10)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Head-to-Head Comparative Scorecard */}
      <div className="p-6 sm:p-8 rounded-xl border border-rule bg-paper-2 shadow-sm space-y-6">
        {/* Titles Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-rule">
          <div>
            <span className="px-2 py-0.5 rounded bg-accent text-accent-ink text-xs font-semibold">
              Candidate A
            </span>
            <h2 className="text-xl font-semibold text-ink mt-2">
              {epA.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-muted mt-1">
              <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{epA.air_date}</span>
              <span className="text-muted/60">/</span>
              <span>Episode #{epA.overall_no} of 151</span>
            </div>
          </div>

          <div>
            <span className="px-2 py-0.5 rounded bg-paper-3 text-muted border border-rule text-xs font-semibold">
              Candidate B
            </span>
            <h2 className="text-xl font-semibold text-ink mt-2">
              {epB.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-muted mt-1">
              <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{epB.air_date}</span>
              <span className="text-muted/60">/</span>
              <span>Episode #{epB.overall_no} of 151</span>
            </div>
          </div>
        </div>

        {/* Metric 1: IMDb Rating */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-ink-2">
            <span>IMDb critical rating</span>
            <span className="text-muted tabular-nums">Scale 1.0 to 10.0</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`p-4 rounded-xl border transition-colors duration-150 ${
                ratingWinner === "A"
                  ? "border-accent bg-accent/10"
                  : "border-rule bg-paper"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" aria-hidden="true" />
                  <span className="text-2xl font-semibold text-ink tabular-nums">
                    {epA.imdb_rating}
                  </span>
                </div>
                {ratingWinner === "A" && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-accent text-accent-ink">
                    Apex rating (+{(epA.imdb_rating - epB.imdb_rating).toFixed(1)})
                  </span>
                )}
              </div>
              <div className="w-full bg-paper-3 h-2 rounded-full overflow-hidden mt-3 border border-rule">
                <div
                  style={{ width: `${(epA.imdb_rating / 10) * 100}%` }}
                  className={`h-full rounded-full ${ratingWinner === "A" ? "bg-accent" : "bg-muted"}`}
                />
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border transition-colors duration-150 ${
                ratingWinner === "B"
                  ? "border-accent bg-accent/10"
                  : "border-rule bg-paper"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" aria-hidden="true" />
                  <span className="text-2xl font-semibold text-ink tabular-nums">
                    {epB.imdb_rating}
                  </span>
                </div>
                {ratingWinner === "B" && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-accent text-accent-ink">
                    Apex rating (+{(epB.imdb_rating - epA.imdb_rating).toFixed(1)})
                  </span>
                )}
              </div>
              <div className="w-full bg-paper-3 h-2 rounded-full overflow-hidden mt-3 border border-rule">
                <div
                  style={{ width: `${(epB.imdb_rating / 10) * 100}%` }}
                  className={`h-full rounded-full ${ratingWinner === "B" ? "bg-accent" : "bg-muted"}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Metric 2: US Audience (Viewers M) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-ink-2">
            <span>Nielsen Live+SD US audience</span>
            <span className="text-muted tabular-nums">In millions of viewers</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`p-4 rounded-xl border transition-colors duration-150 ${
                viewersWinner === "A"
                  ? "border-accent bg-accent/10"
                  : "border-rule bg-paper"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-muted" aria-hidden="true" />
                  <span className="text-2xl font-semibold text-ink tabular-nums">
                    {epA.us_viewers_m}M
                  </span>
                </div>
                {viewersWinner === "A" && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-600 text-white">
                    +{(epA.us_viewers_m - epB.us_viewers_m).toFixed(1)}M more viewers
                  </span>
                )}
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border transition-colors duration-150 ${
                viewersWinner === "B"
                  ? "border-accent bg-accent/10"
                  : "border-rule bg-paper"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-muted" aria-hidden="true" />
                  <span className="text-2xl font-semibold text-ink tabular-nums">
                    {epB.us_viewers_m}M
                  </span>
                </div>
                {viewersWinner === "B" && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-600 text-white">
                    +{(epB.us_viewers_m - epA.us_viewers_m).toFixed(1)}M more viewers
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Credits and Synopsis Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-rule">
          <div className="space-y-3">
            <div className="text-xs text-muted space-y-1">
              <div><span className="text-ink-2 font-medium">Directed by:</span> {epA.directed_by}</div>
              <div><span className="text-ink-2 font-medium">Written by:</span> {epA.written_by}</div>
              <div><span className="text-ink-2 font-medium">IMDb votes:</span> <span className="tabular-nums">{epA.imdb_votes.toLocaleString()}</span></div>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              {epA.synopsis}
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-xs text-muted space-y-1">
              <div><span className="text-ink-2 font-medium">Directed by:</span> {epB.directed_by}</div>
              <div><span className="text-ink-2 font-medium">Written by:</span> {epB.written_by}</div>
              <div><span className="text-ink-2 font-medium">IMDb votes:</span> <span className="tabular-nums">{epB.imdb_votes.toLocaleString()}</span></div>
            </div>
            <p className="text-xs text-muted leading-relaxed">
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
        <div className="p-12 text-center text-xs text-muted">
          Loading comparison workbench...
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
