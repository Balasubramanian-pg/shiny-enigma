"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  Users,
  Search,
  ArrowUpDown,
  Calendar,
  User,
  Film,
  ChevronRight,
  Filter,
  CheckCircle2,
  Sparkles,
  Maximize2,
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
    <div className="space-y-8 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#C8102E] text-white">
              CBI INVESTIGATION LOGS
            </span>
            <span className="text-xs text-neutral-400">
              Season {selectedSeason} of 7 · {currentSeasonData.year_start}–{currentSeasonData.year_end}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white font-heading">
            Episodes Explorer
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-body">
            Nielsen audience ratings, screenplay credits, and case synopses for all 151 episodes
          </p>
        </div>

        {/* Season Segmented Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#12161F]/70 backdrop-blur-sm overflow-x-auto">
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-[#C8102E] text-white shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                }`}
              >
                Season 0{s.season_no}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive SVG Bar Chart Section */}
      <div className="p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#10141D]/80 backdrop-blur-md shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-heading">
              Season 0{selectedSeason} · Viewership & IMDb Spectrum
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Interactive bar heights reflect US Viewers (M). Hover or click any bar for episode metrics.
            </p>
          </div>

          {topRatedEp && (
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C8102E]" />
              <span>
                Season Apex: <strong>{topRatedEp.title}</strong> ({topRatedEp.imdb_rating} ★)
              </span>
            </div>
          )}
        </div>

        {/* SVG Chart Canvas */}
        <div className="relative pt-4 pb-2">
          <div className="flex items-end gap-1.5 sm:gap-2 h-44 sm:h-52 w-full border-b border-neutral-200 dark:border-neutral-800">
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
                  {/* The Bar */}
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[28px] rounded-t transition-all duration-200 ${
                      isTop
                        ? "bg-[#C8102E] shadow-sm ring-2 ring-[#C8102E]/40"
                        : isHovered
                        ? "bg-neutral-800 dark:bg-neutral-300"
                        : "bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600"
                    }`}
                  />

                  {/* Ep Number Label below */}
                  <span className="text-[10px] font-mono mt-1 text-neutral-400 group-hover:text-[#C8102E] font-medium">
                    E{ep.episode_no}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Crosshair Hover Tooltip */}
          {hoveredBar && (
            <div className="mt-3 p-3 rounded-xl bg-neutral-900 text-white dark:bg-neutral-800 text-xs flex flex-wrap items-center justify-between gap-3 shadow-lg border border-neutral-700 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#C8102E] text-[10px] font-bold">
                  S{hoveredBar.season_no} · E{hoveredBar.episode_no}
                </span>
                <span className="font-semibold text-sm">{hoveredBar.title}</span>
                <span className="text-neutral-400">({hoveredBar.air_date})</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {hoveredBar.imdb_rating} / 10 ({hoveredBar.imdb_votes.toLocaleString()} votes)
                </span>
                <span className="text-neutral-300">
                  {hoveredBar.us_viewers_m}M Viewers
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sound.click();
                    setActiveModalEp(hoveredBar);
                  }}
                  className="underline text-[#C8102E] hover:text-red-400 font-sans"
                >
                  View Dossier →
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
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, writer, director..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#12161F]/70 focus:outline-none focus:ring-2 focus:ring-[#C8102E] text-neutral-900 dark:text-white"
          />
        </div>

        {/* Sorting Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs text-neutral-400 mr-1 flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" /> Sort:
          </span>
          <button
            type="button"
            onClick={() => {
              sound.click();
              setSortMode("order");
            }}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              sortMode === "order"
                ? "bg-neutral-800 dark:bg-white text-white dark:text-neutral-900 font-semibold"
                : "border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
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
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              sortMode === "highest"
                ? "bg-neutral-800 dark:bg-white text-white dark:text-neutral-900 font-semibold"
                : "border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
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
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              sortMode === "watched"
                ? "bg-neutral-800 dark:bg-white text-white dark:text-neutral-900 font-semibold"
                : "border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
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
              className="p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#12161F]/70 backdrop-blur-sm shadow-sm hover:border-[#C8102E]/60 hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-xs font-bold">
                    S0{ep.season_no} · E{ep.episode_no < 10 ? `0${ep.episode_no}` : ep.episode_no}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{ep.imdb_rating}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-[#C8102E] transition-colors font-heading leading-tight">
                  {ep.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <Calendar className="w-3 h-3" />
                  <span>{ep.air_date}</span>
                  <span>·</span>
                  <span>#{ep.overall_no} Overall</span>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed pt-1">
                  {ep.synopsis}
                </p>
              </div>

              {/* Viewership bar & Credits */}
              <div className="pt-4 mt-3 border-t border-neutral-100 dark:border-neutral-800/70 space-y-2">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
                    <span>US Viewers: {ep.us_viewers_m}M</span>
                    <span>Season Max: {maxViewers}M</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${viewerBarPct}%` }}
                      className={`h-full rounded-full ${
                        isTop ? "bg-[#C8102E]" : "bg-neutral-400 dark:bg-neutral-500"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActiveModalEp(null)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-[#12161F] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-[#C8102E] text-white text-[11px] font-bold">
                    S0{activeModalEp.season_no} · E{activeModalEp.episode_no}
                  </span>
                  <span className="text-xs text-neutral-500">
                    Overall #{activeModalEp.overall_no} · {activeModalEp.air_date}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white font-heading">
                  {activeModalEp.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalEp(null)}
                className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* 4 Performance Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 text-center">
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                    IMDb Rating
                  </span>
                  <span className="text-xl font-bold text-amber-500 flex items-center justify-center gap-1 font-heading">
                    <Star className="w-4 h-4 fill-current" />
                    {activeModalEp.imdb_rating}
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {activeModalEp.imdb_votes.toLocaleString()} votes
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 text-center">
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                    US Audience
                  </span>
                  <span className="text-xl font-bold text-neutral-900 dark:text-white font-heading">
                    {activeModalEp.us_viewers_m}M
                  </span>
                  <span className="text-[10px] text-neutral-400">Nielsen Live+SD</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 text-center">
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                    Director
                  </span>
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate block mt-1">
                    {activeModalEp.directed_by}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 text-center">
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                    Screenplay
                  </span>
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate block mt-1">
                    {activeModalEp.written_by}
                  </span>
                </div>
              </div>

              {/* Synopsis */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Case Synopsis & Behavioral Analysis
                </h4>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {activeModalEp.synopsis}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    sound.click();
                    router.push(`/compare?epA=${activeModalEp.episode_id}`);
                  }}
                  className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 flex items-center gap-2 cursor-pointer"
                >
                  <span>Compare with another episode</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModalEp(null)}
                  className="px-5 py-2 rounded-xl bg-[#C8102E] hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
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
