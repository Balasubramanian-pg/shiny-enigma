"use client";

import React, { useState } from "react";
import {
  Trophy,
  Award,
  Star,
  CheckCircle2,
  Calendar,
  Sparkles,
  User,
  Filter,
} from "lucide-react";
import { AWARDS, AwardData } from "@/src/data/mentalist-data";
import { sound } from "@/lib/sound";

export default function AwardsPage() {
  const [filterType, setFilterType] = useState<"ALL" | "MAJOR" | "GUILD">("ALL");

  const majorBodies = ["Primetime Emmy Awards", "Golden Globe Awards", "People's Choice Awards"];

  const filteredAwards = AWARDS.filter((a) => {
    if (filterType === "MAJOR") return majorBodies.includes(a.award_body);
    if (filterType === "GUILD") return !majorBodies.includes(a.award_body);
    return true;
  });

  const totalWins = AWARDS.filter((a) => a.result === "Won").length;
  const totalNoms = AWARDS.length;

  const years = [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015];
  const chartData = years.map((y) => {
    const wins = AWARDS.filter((a) => a.year === y && a.result === "Won").length;
    const noms = AWARDS.filter((a) => a.year === y && a.result === "Nominated").length;
    return { year: y, wins, noms, total: wins + noms };
  });

  const actingHonors = [
    {
      actor: "Simon Baker",
      role: "Lead Actor as Patrick Jane",
      honors: "Primetime Emmy, Golden Globe & Screen Actors Guild (SAG) Nominee",
      years: "2009, 2010",
      notes: "Acclaimed for redefining the television detective archetype from eccentric trickster to grieving, razor-sharp avenger.",
    },
    {
      actor: "Robin Tunney",
      role: "Senior Special Agent as Teresa Lisbon",
      honors: "People's Choice Award Nominee for Favorite TV Crime Drama Actress",
      years: "2011, 2014, 2015",
      notes: "Anchored the emotional reality and moral conscience of the CBI Serious Crimes Unit across 151 episodes.",
    },
    {
      actor: "Pruitt Taylor Vince",
      role: "Guest Actor as J.J. LaRoche",
      honors: "Primetime Emmy Winner (Guest Actor) & Critics' Consensus Favorite",
      years: "2011",
      notes: "Praised for his unnerving, tea-sipping interrogation scenes opposite Simon Baker during the Internal Affairs probe.",
    },
  ];

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#C8102E] text-white">
            TELEVISION ACADEMY & GUILD HONORS
          </span>
          <span className="text-xs text-neutral-400">12 Formal Industry Recognitions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white font-heading">
          Awards & Critical Accolades
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-body">
          Emmy, Golden Globe, SAG, and People's Choice recognitions for Simon Baker and the CBS creative team
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#12161F]/70 backdrop-blur-sm shadow-sm space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Victories</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-neutral-900 dark:text-white font-heading">
            {totalWins}
          </div>
          <p className="text-xs text-neutral-500">
            People's Choice Favorite New TV Drama & International Crime Thriller Awards
          </p>
        </div>

        <div className="p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#12161F]/70 backdrop-blur-sm shadow-sm space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Nominations</span>
            <Award className="w-4 h-4 text-[#C8102E]" />
          </div>
          <div className="text-3xl font-bold text-neutral-900 dark:text-white font-heading">
            {totalNoms}
          </div>
          <p className="text-xs text-neutral-500">
            Span across acting, directing, sound editing, and screenwriting
          </p>
        </div>

        <div className="p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#12161F]/70 backdrop-blur-sm shadow-sm space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Simon Baker Triple Crown</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-3xl font-bold text-neutral-900 dark:text-white font-heading">
            3
          </div>
          <p className="text-xs text-neutral-500">
            Nominated for Emmy, Golden Globe, and SAG in the same broadcast cycle
          </p>
        </div>
      </div>

      {/* ANNUAL STACKED BAR CHART */}
      <section className="p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#10141D]/80 backdrop-blur-md shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white font-heading">
              Annual Nominations & Wins Timeline (2008–2015)
            </h2>
            <p className="text-xs text-neutral-500">
              Distribution of major industry nods across the broadcast lifespan
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500" /> Won
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-neutral-400 dark:bg-neutral-600" /> Nominated
            </span>
          </div>
        </div>

        <div className="flex items-end gap-3 h-40 pt-4 border-b border-neutral-200 dark:border-neutral-800">
          {chartData.map((d) => {
            const maxYearCount = 4;
            const winsHeight = (d.wins / maxYearCount) * 100;
            const nomsHeight = (d.noms / maxYearCount) * 100;

            return (
              <div key={d.year} className="flex-1 flex flex-col items-center justify-end h-full group">
                <div className="w-full max-w-[36px] flex flex-col justify-end h-full">
                  {d.wins > 0 && (
                    <div
                      style={{ height: `${winsHeight}%` }}
                      className="bg-amber-500 rounded-t w-full transition-all"
                      title={`${d.wins} wins in ${d.year}`}
                    />
                  )}
                  {d.noms > 0 && (
                    <div
                      style={{ height: `${nomsHeight}%` }}
                      className="bg-neutral-400 dark:bg-neutral-600 rounded-t w-full transition-all"
                      title={`${d.noms} nominations in ${d.year}`}
                    />
                  )}
                </div>
                <span className="text-[11px] font-mono text-neutral-400 mt-2">
                  '{String(d.year).slice(2)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ACTING HONORS SHOWCASE */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white font-heading">
            Acting Tributes & Recognitions
          </h2>
          <p className="text-xs text-neutral-500 font-body">
            Lead performers recognized by the Academy of Television Arts & Sciences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actingHonors.map((h, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#12161F]/70 backdrop-blur-sm space-y-2 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#C8102E]" />
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-heading">
                  {h.actor}
                </h3>
              </div>
              <div className="text-xs font-semibold text-[#C8102E]">
                {h.role}
              </div>
              <div className="text-xs font-mono text-neutral-400">
                {h.honors} ({h.years})
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pt-1">
                {h.notes}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPLETE AWARDS REPOSITORY */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white font-heading">
              Complete Honors Registry
            </h2>
            <p className="text-xs text-neutral-500 font-body">
              Verified dataset from Unity Catalog table <code className="text-[#C8102E]">main.tvshows.awards</code>
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-[#12161F]/70">
            <button
              type="button"
              onClick={() => {
                sound.tab();
                setFilterType("ALL");
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer ${
                filterType === "ALL" ? "bg-[#C8102E] text-white" : "text-neutral-400"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => {
                sound.tab();
                setFilterType("MAJOR");
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer ${
                filterType === "MAJOR" ? "bg-[#C8102E] text-white" : "text-neutral-400"
              }`}
            >
              Major
            </button>
            <button
              type="button"
              onClick={() => {
                sound.tab();
                setFilterType("GUILD");
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer ${
                filterType === "GUILD" ? "bg-[#C8102E] text-white" : "text-neutral-400"
              }`}
            >
              Guild
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden bg-white/70 dark:bg-[#12161F]/70 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100 dark:bg-neutral-800/60 text-neutral-500 font-semibold uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="p-3.5">Year</th>
                  <th className="p-3.5">Award Body</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Nominee / Episode</th>
                  <th className="p-3.5 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800/60">
                {filteredAwards.map((a) => {
                  const isWon = a.result === "Won";
                  return (
                    <tr key={a.award_id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-neutral-800 dark:text-neutral-200">
                        {a.year}
                      </td>
                      <td className="p-3.5 font-semibold text-neutral-900 dark:text-white">
                        {a.award_body}
                      </td>
                      <td className="p-3.5 text-neutral-600 dark:text-neutral-400">
                        {a.category}
                      </td>
                      <td className="p-3.5 text-neutral-500 dark:text-neutral-400">
                        {a.award_body.includes("Emmy") || a.award_body.includes("Golden")
                          ? "Simon Baker (Patrick Jane)"
                          : "The Mentalist Series"}
                      </td>
                      <td className="p-3.5 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            isWon
                              ? "bg-amber-500 text-white"
                              : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                          }`}
                        >
                          {a.result}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
