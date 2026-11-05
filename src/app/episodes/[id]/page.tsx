import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { EPISODES } from "@/src/data/mentalist-data";

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
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href={`/episodes?season=${ep.season_no}`}
          className="inline-flex items-center gap-2 text-xs font-medium text-muted hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus transition-colors duration-150"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Back to Season {ep.season_no} episodes</span>
        </Link>
      </div>

      {/* Episode Header Banner */}
      <div className="p-6 sm:p-8 rounded-xl border border-rule bg-paper-2 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="px-2.5 py-0.5 rounded bg-accent text-accent-ink font-semibold">
            Season {ep.season_no}, Episode {ep.episode_no}
          </span>
          <span className="tabular-nums">
            Episode #{ep.overall_no} of 151
          </span>
          <span className="text-muted/60">/</span>
          <span>{ep.air_date}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
          {ep.title}
        </h1>

        <p className="text-sm text-ink-2 leading-relaxed">
          {ep.synopsis}
        </p>
      </div>

      {/* 4 Performance Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-rule bg-paper-2 text-center shadow-sm">
          <span className="text-xs text-muted block">
            IMDb rating
          </span>
          <span className="text-2xl font-semibold text-amber-500 flex items-center justify-center gap-1 mt-1 tabular-nums">
            <Star className="w-4 h-4 fill-current text-amber-500" aria-hidden="true" />
            {ep.imdb_rating}
          </span>
          <span className="text-xs text-muted block mt-0.5 tabular-nums">
            {ep.imdb_votes.toLocaleString()} user votes
          </span>
        </div>

        <div className="p-4 rounded-xl border border-rule bg-paper-2 text-center shadow-sm">
          <span className="text-xs text-muted block">
            US viewership
          </span>
          <span className="text-2xl font-semibold text-ink mt-1 block tabular-nums">
            {ep.us_viewers_m}M
          </span>
          <span className="text-xs text-muted block mt-0.5">
            Nielsen Live+SD
          </span>
        </div>

        <div className="p-4 rounded-xl border border-rule bg-paper-2 text-center shadow-sm">
          <span className="text-xs text-muted block">
            Directed by
          </span>
          <span className="text-sm font-semibold text-ink truncate block mt-2">
            {ep.directed_by}
          </span>
        </div>

        <div className="p-4 rounded-xl border border-rule bg-paper-2 text-center shadow-sm">
          <span className="text-xs text-muted block">
            Written by
          </span>
          <span className="text-sm font-semibold text-ink truncate block mt-2">
            {ep.written_by}
          </span>
        </div>
      </div>

      {/* Interactive Season Bar Chart */}
      <div className="p-6 rounded-xl border border-rule bg-paper-2 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">
            Season {ep.season_no} Episode Trajectory
          </h2>
          <span className="text-xs text-muted">
            Select any bar to inspect that episode
          </span>
        </div>

        <div className="flex items-end gap-1.5 h-32 pt-2 border-b border-rule">
          {seasonEps.map((sEp) => {
            const isCurrent = sEp.episode_id === ep.episode_id;
            const hPct = Math.max(15, Math.round((sEp.us_viewers_m / maxSeasonViewers) * 100));

            return (
              <Link
                key={sEp.episode_id}
                href={`/episodes/${sEp.episode_id}`}
                className="flex-1 flex flex-col items-center justify-end h-full group focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
                title={`${sEp.title} - ${sEp.us_viewers_m}M (${sEp.imdb_rating} / 10)`}
              >
                <div
                  style={{ height: `${hPct}%` }}
                  className={`w-full rounded-t transition-colors duration-150 ${
                    isCurrent
                      ? "bg-accent"
                      : "bg-paper-3 hover:bg-accent/60"
                  }`}
                />
                <span
                  className={`text-xs mt-1 tabular-nums ${
                    isCurrent ? "font-semibold text-accent" : "text-muted"
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
            className="p-4 rounded-xl border border-rule bg-paper-2 hover:border-accent transition-colors duration-150 flex items-center gap-3 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
          >
            <ChevronLeft className="w-5 h-5 text-muted group-hover:text-accent transition-colors duration-150 shrink-0" aria-hidden="true" />
            <div>
              <span className="text-xs text-muted block tabular-nums">
                Previous: Season {prevEp.season_no}, Episode {prevEp.episode_no}
              </span>
              <span className="text-sm font-semibold text-ink group-hover:text-accent transition-colors duration-150">
                {prevEp.title}
              </span>
            </div>
          </Link>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-rule text-xs text-muted flex items-center justify-center">
            Series Premiere
          </div>
        )}

        {nextEp ? (
          <Link
            href={`/episodes/${nextEp.episode_id}`}
            className="p-4 rounded-xl border border-rule bg-paper-2 hover:border-accent transition-colors duration-150 flex items-center justify-between group focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
          >
            <div>
              <span className="text-xs text-muted block tabular-nums">
                Next: Season {nextEp.season_no}, Episode {nextEp.episode_no}
              </span>
              <span className="text-sm font-semibold text-ink group-hover:text-accent transition-colors duration-150">
                {nextEp.title}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted group-hover:text-accent transition-colors duration-150 shrink-0" aria-hidden="true" />
          </Link>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-rule text-xs text-muted flex items-center justify-center">
            Series Finale Reached
          </div>
        )}
      </div>
    </div>
  );
}
