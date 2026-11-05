"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Star,
  Users,
  Trophy,
  Tv,
  Calendar,
  ChevronRight,
  Shield,
  Eye,
  Crosshair,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { SHOW, SEASONS, EPISODES, CHARACTERS } from "@/src/data/mentalist-data";
import { ExpandableGallery, GalleryItem } from "@/src/components/ui/expandable-gallery";
import { sound } from "@/lib/sound";

export default function HomePage() {
  const router = useRouter();
  const [hoveredSeason, setHoveredSeason] = useState<number | null>(null);

  // Gallery items for ExpandableGallery
  const galleryItems: GalleryItem[] = CHARACTERS.slice(0, 6).map((c) => ({
    id: c.character_id,
    title: c.name,
    subtitle: `${c.actor} · ${c.generation}`,
    imageUrl: c.image_url,
    description: c.bio,
    tag: c.character_id === "red_john" ? "Nemesis" : c.household,
    rating: c.character_id === "patrick_jane" ? "9.8" : c.character_id === "red_john" ? "9.7" : "9.2",
  }));

  // Helper to calculate rating sparkline points for a season
  const getSparklinePoints = (seasonNo: number) => {
    const eps = EPISODES.filter((e) => e.season_no === seasonNo);
    const minR = 7.0;
    const maxR = 9.5;
    const width = 120;
    const height = 32;

    if (eps.length === 0) return "";
    return eps
      .map((e, idx) => {
        const x = (idx / (eps.length - 1)) * width;
        const norm = Math.max(0, Math.min(1, (e.imdb_rating - minR) / (maxR - minR)));
        const y = height - norm * (height - 6) - 3;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  };

  const milestones = [
    {
      badge: "SERIES PILOT",
      title: "Pilot (S01E01)",
      date: "Sep 23, 2008",
      desc: "Jane helps Lisbon solve the Palm Springs golf murders while confronting Red John's trademark smiley face.",
      rating: "8.1",
      id: "tm_s01e01",
    },
    {
      badge: "CENTENNIAL MILESTONE",
      title: "Red Dawn (S05E05 / Ep 100)",
      date: "Oct 28, 2012",
      desc: "Flashback to 2003: Jane's first disheveled arrival at the CBI following his institutional release.",
      rating: "8.7",
      id: "tm_s05e05",
    },
    {
      badge: "NEMESIS UNMASKED",
      title: "Red John (S06E08)",
      date: "Nov 24, 2013",
      desc: "Jane confronts Sheriff Thomas McAllister in a cemetery church, culminating a 10-year pursuit.",
      rating: "9.3",
      id: "tm_s06e08",
    },
    {
      badge: "SERIES FINALE",
      title: "White Orchids (S07E13)",
      date: "Feb 18, 2015",
      desc: "Jane and Lisbon marry at their rustic pond cabin, closing 151 cases with peace and optimism.",
      rating: "9.2",
      id: "tm_s07e13",
    },
  ];

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* 1. HERO DOSSIER SECTION */}
      <section className="relative rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#10141D]/80 backdrop-blur-md p-6 sm:p-10 shadow-lg">
        {/* Subtle Watermark Backdrop */}
        <div className="absolute -right-10 -bottom-10 opacity-5 dark:opacity-10 pointer-events-none select-none">
          <svg className="w-96 h-96 fill-current text-[#C8102E]" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="9" cy="10" r="1.5" />
            <circle cx="15" cy="10" r="1.5" />
            <path d="M8 14.5 C9.5 17.5, 14.5 17.5, 16 14.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#C8102E] text-white tracking-wide">
              CASE ARCHIVE #1196946
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-200/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300">
              CBS · 2008–2015
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-200/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300">
              Bruno Heller Creator
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white font-heading">
            The Mentalist <span className="text-[#C8102E]">.</span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed font-body">
            California Bureau of Investigation (CBI) serious crimes analytical portal. Follow Patrick Jane's
            superhuman observational methodology, the psychological duel with Red John, and the forensic
            data behind 151 broadcast episodes.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                sound.click();
                router.push("/episodes");
              }}
              className="px-5 py-2.5 rounded-xl bg-[#C8102E] hover:bg-[#a50d26] text-white font-semibold text-sm shadow-md transition-all duration-150 flex items-center gap-2 group cursor-pointer"
            >
              <Tv className="w-4 h-4" />
              <span>Explore 151 Episodes</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                sound.click();
                router.push("/about");
              }}
              className="px-5 py-2.5 rounded-xl bg-neutral-200/70 dark:bg-neutral-800/70 hover:bg-neutral-300/70 dark:hover:bg-neutral-700/70 text-neutral-800 dark:text-neutral-200 font-semibold text-sm transition-all duration-150 flex items-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4 text-[#C8102E]" />
              <span>Inspect Relational DBML</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.click();
                router.push("/characters");
              }}
              className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-sm transition-all duration-150 flex items-center gap-2 cursor-pointer"
            >
              <Crosshair className="w-4 h-4 text-neutral-500" />
              <span>Suspects Matrix</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. 4 BENTO KPI CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/60 dark:bg-[#12161F]/60 backdrop-blur-sm shadow-sm hover:border-[#C8102E]/40 transition-all duration-200">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total US Viewers</span>
            <Users className="w-4 h-4 text-[#C8102E]" />
          </div>
          <div className="text-3xl font-bold text-neutral-900 dark:text-white font-heading">
            2.54B
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Lifetime broadcast impressions across 7 seasons (Peak Season 1: 17.5M avg)
          </p>
        </div>

        {/* KPI 2 */}
        <div className="p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/60 dark:bg-[#12161F]/60 backdrop-blur-sm shadow-sm hover:border-[#C8102E]/40 transition-all duration-200">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Series Peak Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-3xl font-bold text-neutral-900 dark:text-white font-heading">
            9.3 <span className="text-sm font-normal text-neutral-500">/ 10</span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            S04E24 "The Crimson Hat" & S06E08 "Red John" climax
          </p>
        </div>

        {/* KPI 3 */}
        <div className="p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/60 dark:bg-[#12161F]/60 backdrop-blur-sm shadow-sm hover:border-[#C8102E]/40 transition-all duration-200">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Red John Arc</span>
            <Crosshair className="w-4 h-4 text-[#C8102E]" />
          </div>
          <div className="text-3xl font-bold text-neutral-900 dark:text-white font-heading">
            116 <span className="text-sm font-normal text-neutral-500">Episodes</span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Title motifs featuring "Red", "Blood", or "Crimson" until unmasking
          </p>
        </div>

        {/* KPI 4 */}
        <div className="p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/60 dark:bg-[#12161F]/60 backdrop-blur-sm shadow-sm hover:border-[#C8102E]/40 transition-all duration-200">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Awards & Guilds</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-neutral-900 dark:text-white font-heading">
            12 <span className="text-sm font-normal text-neutral-500">Honors</span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Emmy, Golden Globe, SAG & People's Choice Award recognitions
          </p>
        </div>
      </section>

      {/* 3. SEASONS 01–07 BENTO MATRIX WITH LIVE SPARKLINES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white font-heading">
              Seasons Analytical Matrix
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-body">
              Broadcast trajectories, Nielsen ratings, and rating sparklines across all 7 seasons
            </p>
          </div>
          <Link
            href="/episodes"
            onClick={() => sound.tab()}
            className="text-xs font-semibold text-[#C8102E] hover:underline flex items-center gap-1"
          >
            All 151 Episodes <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SEASONS.map((season) => {
            const isHovered = hoveredSeason === season.season_no;
            const sparkPoints = getSparklinePoints(season.season_no);

            return (
              <div
                key={season.season_no}
                onMouseEnter={() => setHoveredSeason(season.season_no)}
                onMouseLeave={() => setHoveredSeason(null)}
                onClick={() => {
                  sound.click();
                  router.push(`/episodes?season=${season.season_no}`);
                }}
                className="group relative p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-[#12161F]/80 backdrop-blur-sm cursor-pointer shadow-sm hover:shadow-md hover:border-[#C8102E]/50 transition-all duration-200 overflow-hidden"
              >
                {/* Accent top bar */}
                <div className="absolute top-0 inset-x-0 h-1 bg-neutral-200 dark:bg-neutral-800 group-hover:bg-[#C8102E] transition-colors duration-200" />

                <div className="flex items-center justify-between mb-3 pt-1">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    SEASON 0{season.season_no}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {season.year_start}–{season.year_end}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-xl font-bold text-neutral-900 dark:text-white font-heading">
                      {season.avg_imdb_rating.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-normal">avg</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      {season.avg_viewers_m.toFixed(1)}M
                    </span>
                    <span className="text-[10px] text-neutral-400 block">US Rank #{season.rank_us_shows}</span>
                  </div>
                </div>

                {/* Rating Sparkline */}
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/70">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                    <span>Episode Rating Sparkline</span>
                    <span>{season.episode_count} eps</span>
                  </div>
                  <svg
                    className="w-full h-8 overflow-visible"
                    viewBox="0 0 120 32"
                    preserveAspectRatio="none"
                  >
                    <polyline
                      fill="none"
                      stroke={isHovered ? "#C8102E" : "currentColor"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={sparkPoints}
                      className="text-neutral-400 dark:text-neutral-600 transition-colors duration-200"
                    />
                  </svg>
                </div>
              </div>
            );
          })}

          {/* Special Bento 8th Tile: The Mentalist Trivia & Formula */}
          <div
            onClick={() => {
              sound.click();
              router.push("/about");
            }}
            className="p-5 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/30 backdrop-blur-sm flex flex-col justify-between cursor-pointer hover:border-[#C8102E]/60 transition-colors"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C8102E] uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                CBI Methodology
              </div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-2">
                The Color Palette Rules
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Every episode from S01E01 to S06E08 contained a red hue motif in its title. After Red John's
                death in S06E09, titles incorporated all other prism spectrum colors.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 pt-3">
              <span>View Data Models</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#C8102E]" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXPANDABLE CHARACTER SHOWCASE (CORE USER COMPONENT) */}
      <section className="p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#10141D]/80 backdrop-blur-md shadow-md">
        <ExpandableGallery items={galleryItems} defaultExpandedIndex={0} />
      </section>

      {/* 5. PIVOTAL MILESTONES STRIP */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white font-heading">
            Series Pivotal Milestones
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-body">
            Decisive turning points across Patrick Jane's seven-year journey from institutional brokenness to closure
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map((m) => (
            <div
              key={m.id}
              onClick={() => {
                sound.click();
                router.push(`/episodes?season=1#${m.id}`);
              }}
              className="p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#12161F]/70 backdrop-blur-sm cursor-pointer hover:border-[#C8102E]/50 transition-all duration-200 space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                  {m.badge}
                </span>
                <span className="text-xs font-semibold text-[#C8102E] flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-current" />
                  {m.rating}
                </span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-[#C8102E] transition-colors">
                {m.title}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <Calendar className="w-3 h-3" />
                <span>{m.date}</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed pt-1">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
