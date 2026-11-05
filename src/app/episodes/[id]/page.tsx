import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  Users,
  Calendar,
  Film,
  User,
  ChevronLeft,
  ChevronRight,
  Tv,
  Scale,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { EPISODES, EpisodeData } from "@/src/data/mentalist-data";

export function generateStaticParams() {
  return EPISODES.map((ep) => ({
    id: ep.episode_id,
  }));
}

export default async function EpisodeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ep = EPISODES.find((e) => e.episode_id === id);

  if (!ep) {
    notFound();
  }

  const seasonEps = EPISODES.filter((e) => e.season_no === ep.season_no).sort(
    (a, b) => a.episode_no - b.episode_no
  );

  const prevEp = EPISODES.find((e) => e.overall_no === ep.overall_no - 1);
  const nextEp = EPISODES.find((e) => e.overall_no === ep.overall_no + 1);

  const maxSeasonViewers = Math.max(...seasonEps.map((e) => e.us_viewers_m));

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href={`/episodes?season=${ep.season_no}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-[#C8102E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Season {ep.season_no} Episodes</span>
        </Link>
      </div>

      {/* Episode Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#10141D]/80 backdrop-blur-md shadow-lg space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C8102E] text-white">
            SEASON 0{ep.season_no} · EPISODE 0{ep.episode_no}
          </span>
          <span className="text-xs font-mono text-neutral-400">
            Series Overall #{ep.overall_no} of 151
          </span>
          <span className="text-xs font-mono text-neutral-400">
            · {ep.air_date}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white font-heading">
          {ep.title}
        </h1>

        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-body">
          {ep.synopsis}
        </p>
      </div>

      {/* 4 Performance Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#12161F]/70 text-center">
          <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
            IMDb Rating
          </span>
          <span className="text-2xl font-bold text-amber-500 flex items-center justify-center gap-1 font-heading mt-1">
            <Star className="w-5 h-5 fill-current" />
            {ep.imdb_rating}
          </span>
          <span className="text-[10px] text-neutral-400 block mt-0.5">
            {ep.imdb_votes.toLocaleString()} user votes
          </span>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#12161F]/70 text-center">
          <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
            US Viewership
          </span>
          <span className="text-2xl font-bold text-neutral-900 dark:text-white font-heading mt-1">
            {ep.us_viewers_m}M
          </span>
          <span className="text-[10px] text-neutral-400 block mt-0.5">
            Nielsen Live+SD
          </span>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#12161F]/70 text-center">
          <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
            Directed By
          </span>
          <span className="text-sm font-bold text-neutral-900 dark:text-white truncate block mt-2">
            {ep.directed_by}
          </span>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#12161F]/70 text-center">
          <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
            Written By
          </span>
          <span className="text-sm font-bold text-neutral-900 dark:text-white truncate block mt-2">
            {ep.written_by}
          </span>
        </div>
      </div>

      {/* Interactive Season Bar Chart (Highlights Current Episode) */}
      <div className="p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#10141D]/80 backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-heading">
            Season {ep.season_no} Episode Trajectory
          </h3>
          <span className="text-xs text-neutral-400">
            Click any bar to jump to that episode
          </span>
        </div>

        <div className="flex items-end gap-1.5 h-32 pt-2 border-b border-neutral-200 dark:border-neutral-800">
          {seasonEps.map((sEp) => {
            const isCurrent = sEp.episode_id === ep.episode_id;
            const hPct = Math.max(15, Math.round((sEp.us_viewers_m / maxSeasonViewers) * 100));

            return (
              <Link
                key={sEp.episode_id}
                href={`/episodes/${sEp.episode_id}`}
                className="flex-1 flex flex-col items-center justify-end h-full group"
                title={`${sEp.title} - ${sEp.us_viewers_m}M (${sEp.imdb_rating} ★)`}
              >
                <div
                  style={{ height: `${hPct}%` }}
                  className={`w-full rounded-t transition-all ${
                    isCurrent
                      ? "bg-[#C8102E] ring-2 ring-[#C8102E]/40"
                      : "bg-neutral-300 dark:bg-neutral-700 hover:bg-[#C8102E]/60"
                  }`}
                />
                <span
                  className={`text-[9px] font-mono mt-1 ${
                    isCurrent ? "font-bold text-[#C8102E]" : "text-neutral-400"
                  }`}
                >
                  E{sEp.episode_no}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Sequential Navigation Split Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevEp ? (
          <Link
            href={`/episodes/${prevEp.episode_id}`}
            className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#12161F]/70 hover:border-[#C8102E]/60 transition-all flex items-center gap-3 group"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-400 group-hover:text-[#C8102E] transition-colors" />
            <div>
              <span className="text-[10px] text-neutral-400 font-mono block">
                PREVIOUS EPISODE · S0{prevEp.season_no}E{prevEp.episode_no}
              </span>
              <span className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-[#C8102E] transition-colors">
                {prevEp.title}
              </span>
            </div>
          </Link>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 text-xs text-neutral-400 flex items-center justify-center">
            Series Premiere
          </div>
        )}

        {nextEp ? (
          <Link
            href={`/episodes/${nextEp.episode_id}`}
            className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#12161F]/70 hover:border-[#C8102E]/60 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] text-neutral-400 font-mono block">
                NEXT EPISODE · S0{nextEp.season_no}E{nextEp.episode_no}
              </span>
              <span className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-[#C8102E] transition-colors">
                {nextEp.title}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-[#C8102E] transition-colors" />
          </Link>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 text-xs text-neutral-400 flex items-center justify-center">
            Series Finale Reached
          </div>
        )}
      </div>
    </div>
  );
}
