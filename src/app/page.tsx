"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  Users,
  Trophy,
  Tv,
  Calendar,
  ChevronRight,
  Shield,
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
    subtitle: `${c.actor}, ${c.generation}`,
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
      badge: "Series pilot",
      title: "Pilot (S01E01)",
      date: "Sep 23, 2008",
      desc: "Jane helps Lisbon solve the Palm Springs golf murders while confronting Red John’s trademark smiley face.",
      rating: "8.1",
      id: "tm_s01e01",
    },
    {
      badge: "Centennial milestone",
      title: "Red Dawn (S05E05 / Ep 100)",
      date: "Oct 28, 2012",
      desc: "Flashback to 2003: Jane’s first disheveled arrival at the CBI following his institutional release.",
      rating: "8.7",
      id: "tm_s05e05",
    },
    {
      badge: "Nemesis unmasked",
      title: "Red John (S06E08)",
      date: "Nov 24, 2013",
      desc: "Jane confronts Sheriff Thomas McAllister in a cemetery church, culminating a 10-year pursuit.",
      rating: "9.3",
      id: "tm_s06e08",
    },
    {
      badge: "Series finale",
      title: "White Orchids (S07E13)",
      date: "Feb 18, 2015",
      desc: "Jane and Lisbon marry at their rustic pond cabin, closing 151 cases with peace and optimism.",
      rating: "9.2",
      id: "tm_s07e13",
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Hero Dossier Section */}
      <section className="relative rounded-xl border border-rule bg-paper-2 p-6 sm:p-10 shadow-sm overflow-hidden">
        {/* Subtle Watermark Backdrop */}
        <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none select-none">
          <svg className="w-96 h-96 fill-current text-accent" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="9" cy="10" r="1.5" />
            <circle cx="15" cy="10" r="1.5" />
            <path d="M8 14.5 C9.5 17.5, 14.5 17.5, 16 14.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="px-2.5 py-0.5 rounded bg-accent text-accent-ink font-semibold">
              Case Archive #1196946
            </span>
            <span>CBS broadcast (2008 to 2015)</span>
            <span className="text-muted/60">/</span>
            <span>Created by Bruno Heller</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink">
            The Mentalist<span className="text-accent">.</span>
          </h1>

          <p className="text-base text-ink-2 leading-relaxed">
            California Bureau of Investigation (CBI) serious crimes analytical portal. Follow Patrick Jane’s
            observational methodology, the psychological duel with Red John, and the forensic
            data behind 151 broadcast episodes.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                sound.click();
                router.push("/episodes");
              }}
              className="px-5 py-2.5 rounded-lg bg-accent hover:bg-accent/90 text-accent-ink font-semibold text-xs shadow-sm transition-colors duration-150 flex items-center gap-2 active:opacity-85 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
            >
              <Tv className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Explore 151 episodes</span>
              <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => {
                sound.click();
                router.push("/about");
              }}
              className="px-5 py-2.5 rounded-lg bg-paper-3 hover:bg-paper-2 border border-rule text-ink font-semibold text-xs transition-colors duration-150 flex items-center gap-2 active:opacity-85 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
            >
              <Shield className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
              <span>Inspect relational DBML</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.click();
                router.push("/characters");
              }}
              className="px-5 py-2.5 rounded-lg border border-rule hover:border-accent text-ink font-semibold text-xs transition-colors duration-150 flex items-center gap-2 active:opacity-85 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus cursor-pointer bg-paper-2"
            >
              <Crosshair className="w-4 h-4 text-muted shrink-0" aria-hidden="true" />
              <span>Suspects matrix</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. 4 Bento KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 rounded-xl border border-rule bg-paper-2 shadow-sm hover:border-accent/40 transition-colors duration-150">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium text-ink-2">Total US viewers</span>
            <Users className="w-4 h-4 text-accent" aria-hidden="true" />
          </div>
          <div className="text-3xl font-semibold text-ink tabular-nums">
            2.54B
          </div>
          <p className="text-xs text-muted mt-1">
            Lifetime broadcast impressions across 7 seasons (Peak Season 1: 17.5M avg)
          </p>
        </div>

        {/* KPI 2 */}
        <div className="p-5 rounded-xl border border-rule bg-paper-2 shadow-sm hover:border-accent/40 transition-colors duration-150">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium text-ink-2">Series peak rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" aria-hidden="true" />
          </div>
          <div className="text-3xl font-semibold text-ink tabular-nums">
            9.3 <span className="text-sm font-normal text-muted">/ 10</span>
          </div>
          <p className="text-xs text-muted mt-1">
            S04E24 “The Crimson Hat” and S06E08 “Red John” climax
          </p>
        </div>

        {/* KPI 3 */}
        <div className="p-5 rounded-xl border border-rule bg-paper-2 shadow-sm hover:border-accent/40 transition-colors duration-150">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium text-ink-2">Red John arc</span>
            <Crosshair className="w-4 h-4 text-accent" aria-hidden="true" />
          </div>
          <div className="text-3xl font-semibold text-ink tabular-nums">
            116 <span className="text-sm font-normal text-muted">Episodes</span>
          </div>
          <p className="text-xs text-muted mt-1">
            Title motifs featuring “Red”, “Blood”, or “Crimson” until unmasking
          </p>
        </div>

        {/* KPI 4 */}
        <div className="p-5 rounded-xl border border-rule bg-paper-2 shadow-sm hover:border-accent/40 transition-colors duration-150">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium text-ink-2">Awards and guilds</span>
            <Trophy className="w-4 h-4 text-amber-500" aria-hidden="true" />
          </div>
          <div className="text-3xl font-semibold text-ink tabular-nums">
            12 <span className="text-sm font-normal text-muted">Honors</span>
          </div>
          <p className="text-xs text-muted mt-1">
            Emmy, Golden Globe, SAG, and People’s Choice Award recognitions
          </p>
        </div>
      </section>

      {/* 3. Seasons 01 to 07 Analytical Matrix with Sparklines */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-ink">
              Seasons Analytical Matrix
            </h2>
            <p className="text-xs text-muted">
              Broadcast trajectories, Nielsen ratings, and rating sparklines across all 7 seasons
            </p>
          </div>
          <Link
            href="/episodes"
            onClick={() => sound.tab()}
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
          >
            <span>All 151 Episodes</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
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
                className="group relative p-5 rounded-xl border border-rule bg-paper-2 cursor-pointer shadow-sm hover:border-accent transition-colors duration-150 overflow-hidden"
              >
                {/* Accent top bar */}
                <div className="absolute top-0 inset-x-0 h-1 bg-paper-3 group-hover:bg-accent transition-colors duration-150" />

                <div className="flex items-center justify-between mb-3 pt-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-paper-3 text-ink tabular-nums">
                    Season 0{season.season_no}
                  </span>
                  <span className="text-xs text-muted tabular-nums">
                    {season.year_start} to {season.year_end}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" aria-hidden="true" />
                    <span className="text-xl font-semibold text-ink tabular-nums">
                      {season.avg_imdb_rating.toFixed(2)}
                    </span>
                    <span className="text-xs text-muted font-normal">avg</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-ink tabular-nums">
                      {season.avg_viewers_m.toFixed(1)}M
                    </span>
                    <span className="text-xs text-muted block tabular-nums">US Rank #{season.rank_us_shows}</span>
                  </div>
                </div>

                {/* Rating Sparkline */}
                <div className="pt-2 border-t border-rule">
                  <div className="flex items-center justify-between text-xs text-muted mb-1">
                    <span>Episode rating sparkline</span>
                    <span className="tabular-nums">{season.episode_count} eps</span>
                  </div>
                  <svg
                    className="w-full h-8 overflow-visible"
                    viewBox="0 0 120 32"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <polyline
                      fill="none"
                      stroke={isHovered ? "var(--color-accent)" : "currentColor"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={sparkPoints}
                      className="text-muted transition-colors duration-150"
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
            className="p-5 rounded-xl border border-dashed border-rule bg-paper-2 flex flex-col justify-between cursor-pointer hover:border-accent transition-colors duration-150"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-accent mb-1">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>CBI methodology</span>
              </div>
              <h3 className="text-sm font-semibold text-ink mb-2">
                The Color Palette Rules
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Every episode from S01E01 to S06E08 contained a red hue motif in its title. After Red John’s
                death in S06E09, titles incorporated all other prism spectrum colors.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-ink pt-3">
              <span>View Data Models</span>
              <ChevronRight className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Expandable Character Showcase */}
      <section className="p-6 rounded-xl border border-rule bg-paper-2 shadow-sm">
        <ExpandableGallery items={galleryItems} defaultExpandedIndex={0} />
      </section>

      {/* 5. Pivotal Milestones Strip */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-ink">
            Series Pivotal Milestones
          </h2>
          <p className="text-xs text-muted">
            Decisive turning points across Patrick Jane’s seven-year journey from institutional brokenness to closure
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
              className="p-5 rounded-xl border border-rule bg-paper-2 cursor-pointer hover:border-accent transition-colors duration-150 space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-paper-3 text-muted border border-rule">
                  {m.badge}
                </span>
                <span className="text-xs font-semibold text-accent flex items-center gap-0.5 tabular-nums">
                  <Star className="w-3 h-3 fill-current text-amber-500" aria-hidden="true" />
                  {m.rating}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-ink group-hover:text-accent transition-colors duration-150">
                {m.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Calendar className="w-3 h-3 shrink-0" aria-hidden="true" />
                <span>{m.date}</span>
              </div>
              <p className="text-xs text-muted leading-relaxed pt-1">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
