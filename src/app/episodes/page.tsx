"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  Search,
  ArrowUpDown,
  Calendar,
  ChevronRight,
  X,
} from "lucide-react";
import { SEASONS, EPISODES, EpisodeData } from "@/src/data/mentalist-data";
import { sound } from "@/lib/sound";

export default function EpisodesPage() {
  const router = useRouter();
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [sortMode, setSortMode] = useState<"order" | "highest" | "watched">("order");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hoveredBar, setHoveredBar] = useState<EpisodeData | null>(null);
  const [activeModalEp, setActiveModalEp] = useState<EpisodeData | null>(null);

  // Filter episodes by season
  const seasonEpisodes = useMemo(() => {
    return EPISODES.filter((e) => e.season_no === selectedSeason);
  }, [selectedSeason]);

  // Max viewers in the season for scaling charts and bars
  const maxViewers = useMemo(() => {
    if (seasonEpisodes.length === 0) return 20;
    return Math.max(...seasonEpisodes.map((e) => e.us_viewers_m));
  }, [seasonEpisodes]);

  // Top rated episode in this season
  const topRatedEp = useMemo(() => {
    if (seasonEpisodes.length === 0) return null;
    return [...seasonEpisodes].sort((a, b) => b.imdb_rating - a.imdb_rating)[0];
  }, [seasonEpisodes]);

  // Sorted and filtered episodes
  const displayEpisodes = useMemo(() => {
    let list = [...seasonEpisodes];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.synopsis.toLowerCase().includes(q) ||
          e.written_by.toLowerCase().includes(q) ||
          e.directed_by.toLowerCase().includes(q)
      );
    }

    if (sortMode === "highest") {
      list.sort((a, b) => b.imdb_rating - a.imdb_rating);
    } else if (sortMode === "watched") {
      list.sort((a, b) => b.us_viewers_m - a.us_viewers_m);
    } else {
      list.sort((a, b) => a.episode_no - b.episode_no);
    }
    return list;
  }, [seasonEpisodes, searchQuery, sortMode]);

  const currentSeasonData = SEASONS.find((s) => s.season_no === selectedSeason) || SEASONS[0];

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            Episodes Explorer
          </h1>
          <p className="mt-2 text-sm text-muted">
            Season {selectedSeason} of 7 ({currentSeasonData.year_start} to {currentSeasonData.year_end}). Nielsen audience ratings, screenplay credits, and case synopses for all 151 episodes.
          </p>
        </div>

        {/* Season Segmented Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-lg border border-rule bg-paper-2 overflow-x-auto">
          {SEASONS.map((s) => {
            const isActive = s.season_no === selectedSeason;
            return (
              <button
                key={s.season_no}
                type="button"
                onClick={() => {
                  sound.tab();
                  setSelectedSeason(s.season_no);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors duration-150 active:opacity-85 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus cursor-pointer ${
                  isActive
                    ? "bg-accent text-accent-ink shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
              >
                Season 0{s.season_no}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Bar Chart Section */}
      <div className="p-6 rounded-xl border border-rule bg-paper-2 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-ink">
              Season 0{selectedSeason}: Viewership & Rating Trajectory
            </h2>
            <p className="text-xs text-muted">
              Bar heights reflect US viewers in millions. Select any bar to open that episode’s investigative dossier.
            </p>
          </div>

          {topRatedEp && (
            <div className="flex items-center gap-2 text-xs font-medium text-ink-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" aria-hidden="true" />
              <span>
                Season Apex: <strong className="font-semibold text-ink">{topRatedEp.title}</strong> ({topRatedEp.imdb_rating} / 10)
              </span>
            </div>
          )}
        </div>

        {/* Bar Chart Canvas */}
        <div className="relative pt-4 pb-2">
          <div className="flex items-end gap-1.5 sm:gap-2 h-44 sm:h-52 w-full border-b border-rule">
            {seasonEpisodes.map((ep) => {
              const heightPct = Math.max(12, Math.round((ep.us_viewers_m / maxViewers) * 100));
              const isTop = topRatedEp?.episode_id === ep.episode_id;
              const isHovered = hoveredBar?.episode_id === ep.episode_id;

              return (
                <div
                  key={ep.episode_id}
                  className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                  onMouseEnter={() => setHoveredBar(ep)}
                  onMouseLeave={() => setHoveredBar(null)}
                  onClick={() => {
                    sound.click();
                    setActiveModalEp(ep);
                  }}
                >
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[28px] rounded-t transition-colors duration-150 ${
                      isTop
                        ? "bg-accent"
                        : isHovered
                        ? "bg-ink-2"
                        : "bg-paper-3 hover:bg-muted"
                    }`}
                  />

                  <span className="text-xs mt-1 text-muted group-hover:text-accent font-medium tabular-nums">
                    E{ep.episode_no}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Crosshair Hover Tooltip */}
          {hoveredBar && (
            <div className="mt-3 p-3 rounded-lg bg-paper-3 text-ink text-xs flex flex-wrap items-center justify-between gap-3 shadow-md border border-rule">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-accent text-accent-ink text-xs font-semibold tabular-nums">
                  Season {hoveredBar.season_no}, Episode {hoveredBar.episode_no}
                </span>
                <span className="font-semibold">{hoveredBar.title}</span>
                <span className="text-muted">({hoveredBar.air_date})</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-amber-400 flex items-center gap-1 tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                  {hoveredBar.imdb_rating} / 10 ({hoveredBar.imdb_votes.toLocaleString()} votes)
                </span>
                <span className="text-muted tabular-nums">
                  {hoveredBar.us_viewers_m}M Viewers
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sound.click();
                    setActiveModalEp(hoveredBar);
                  }}
                  className="text-accent hover:underline font-medium cursor-pointer active:opacity-85 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
                >
                  View dossier
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter & Sorting Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, writer, director..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-rule bg-paper-2 text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus disabled:opacity-40"
          />
        </div>

        {/* Sorting Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs text-muted mr-1 flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" aria-hidden="true" /> Sort:
          </span>
          <button
            type="button"
            onClick={() => {
              sound.click();
              setSortMode("order");
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-150 active:opacity-85 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus cursor-pointer ${
              sortMode === "order"
                ? "bg-accent text-accent-ink"
                : "border border-rule text-muted hover:text-ink bg-paper-2"
            }`}
          >
            Air Order
          </button>
          <button
            type="button"
            onClick={() => {
              sound.click();
              setSortMode("highest");
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-150 active:opacity-85 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus cursor-pointer ${
              sortMode === "highest"
                ? "bg-accent text-accent-ink"
                : "border border-rule text-muted hover:text-ink bg-paper-2"
            }`}
          >
            Highest Rated
          </button>
          <button
            type="button"
            onClick={() => {
              sound.click();
              setSortMode("watched");
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-150 active:opacity-85 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus cursor-pointer ${
              sortMode === "watched"
                ? "bg-accent text-accent-ink"
                : "border border-rule text-muted hover:text-ink bg-paper-2"
            }`}
          >
            Most Watched
          </button>
        </div>
      </div>

      {/* Episode Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayEpisodes.map((ep) => {
          const isTop = topRatedEp?.episode_id === ep.episode_id;
          const viewerBarPct = Math.round((ep.us_viewers_m / maxViewers) * 100);

          return (
            <div
              key={ep.episode_id}
              onClick={() => {
                sound.click();
                setActiveModalEp(ep);
              }}
              className="p-5 rounded-xl border border-rule bg-paper-2 shadow-sm hover:border-accent transition-colors duration-150 cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-paper-3 text-muted text-xs font-medium tabular-nums">
                    Season {ep.season_no}, Episode {ep.episode_no}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 tabular-nums">
                    <Star className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    <span>{ep.imdb_rating}</span>
                  </div>
                </div>

                <h3 className="text-base font-semibold text-ink group-hover:text-accent transition-colors duration-150 leading-tight">
                  {ep.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-muted">
                  <Calendar className="w-3 h-3 shrink-0" aria-hidden="true" />
                  <span>{ep.air_date}</span>
                  <span className="text-muted/60">/</span>
                  <span className="tabular-nums">Episode #{ep.overall_no} of 151</span>
                </div>

                <p className="text-xs text-muted line-clamp-3 leading-relaxed pt-1">
                  {ep.synopsis}
                </p>
              </div>

              {/* Viewership bar & Credits */}
              <div className="pt-4 mt-3 border-t border-rule space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted mb-1 tabular-nums">
                    <span>US Viewers: {ep.us_viewers_m}M</span>
                    <span>Season Max: {maxViewers}M</span>
                  </div>
                  <div className="w-full h-1.5 bg-paper-3 rounded-full overflow-hidden border border-rule">
                    <div
                      style={{ width: `${viewerBarPct}%` }}
                      className={`h-full rounded-full ${
                        isTop ? "bg-accent" : "bg-muted"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted pt-1">
                  <span className="truncate max-w-[140px]">Dir: {ep.directed_by}</span>
                  <span className="truncate max-w-[140px]">Writ: {ep.written_by}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Episode Detail Dossier Lightbox Modal */}
      {activeModalEp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => setActiveModalEp(null)}
        >
          <div
            className="w-full max-w-2xl bg-paper-2 rounded-xl border border-rule shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-paper-3 border-b border-rule flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-accent text-accent-ink text-xs font-semibold tabular-nums">
                    Season {activeModalEp.season_no}, Episode {activeModalEp.episode_no}
                  </span>
                  <span className="text-xs text-muted tabular-nums">
                    Episode #{activeModalEp.overall_no} of 151, {activeModalEp.air_date}
                  </span>
                </div>
                <h2 className="text-2xl font-semibold text-ink">
                  {activeModalEp.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalEp(null)}
                className="p-1.5 rounded-md hover:bg-paper text-muted hover:text-ink active:opacity-85 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus transition-colors duration-150 cursor-pointer"
                aria-label="Close episode modal"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* 4 Performance Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-paper border border-rule text-center">
                  <span className="text-xs text-muted block">
                    IMDb rating
                  </span>
                  <span className="text-xl font-semibold text-amber-500 flex items-center justify-center gap-1 mt-1 tabular-nums">
                    <Star className="w-4 h-4 fill-current" aria-hidden="true" />
                    {activeModalEp.imdb_rating}
                  </span>
                  <span className="text-xs text-muted tabular-nums">
                    {activeModalEp.imdb_votes.toLocaleString()} votes
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-paper border border-rule text-center">
                  <span className="text-xs text-muted block">
                    US audience
                  </span>
                  <span className="text-xl font-semibold text-ink mt-1 block tabular-nums">
                    {activeModalEp.us_viewers_m}M
                  </span>
                  <span className="text-xs text-muted">Nielsen Live+SD</span>
                </div>

                <div className="p-3 rounded-lg bg-paper border border-rule text-center">
                  <span className="text-xs text-muted block">
                    Director
                  </span>
                  <span className="text-xs font-semibold text-ink truncate block mt-1">
                    {activeModalEp.directed_by}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-paper border border-rule text-center">
                  <span className="text-xs text-muted block">
                    Screenplay
                  </span>
                  <span className="text-xs font-semibold text-ink truncate block mt-1">
                    {activeModalEp.written_by}
                  </span>
                </div>
              </div>

              {/* Synopsis */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-ink-2">
                  Case Synopsis and Behavioral Analysis
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  {activeModalEp.synopsis}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-rule">
                <button
                  type="button"
                  onClick={() => {
                    sound.click();
                    router.push(`/compare?epA=${activeModalEp.episode_id}`);
                  }}
                  className="px-4 py-2 rounded-lg border border-rule hover:border-accent text-xs font-semibold text-ink flex items-center gap-2 whitespace-nowrap active:opacity-85 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus transition-colors duration-150 cursor-pointer"
                >
                  <span>Compare episode</span>
                  <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModalEp(null)}
                  className="px-5 py-2 rounded-lg bg-accent text-accent-ink text-xs font-semibold active:opacity-85 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus transition-colors duration-150 cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
