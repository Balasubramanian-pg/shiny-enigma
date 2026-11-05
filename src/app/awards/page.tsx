"use client";

import React, { useState } from "react";
import {
  Trophy,
  Award,
  Star,
  User,
} from "lucide-react";
import { AWARDS } from "@/src/data/mentalist-data";
import { sound } from "@/lib/sound";

export default function AwardsPage() {
  const [filterType, setFilterType] = useState<"ALL" | "MAJOR" | "GUILD">("ALL");

  const majorBodies = ["Primetime Emmy Awards", "Golden Globe Awards", "People’s Choice Awards"];

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
      honors: "Primetime Emmy, Golden Globe and Screen Actors Guild (SAG) Nominee",
      years: "2009, 2010",
      notes: "Acclaimed for redefining the television detective archetype from eccentric trickster to grieving, razor-sharp avenger.",
    },
    {
      actor: "Robin Tunney",
      role: "Senior Special Agent as Teresa Lisbon",
      honors: "People’s Choice Award Nominee for Favorite TV Crime Drama Actress",
      years: "2011, 2014, 2015",
      notes: "Anchored the emotional reality and moral conscience of the CBI Serious Crimes Unit across 151 episodes.",
    },
    {
      actor: "Pruitt Taylor Vince",
      role: "Guest Actor as J.J. LaRoche",
      honors: "Primetime Emmy Winner (Guest Actor) and Critics' Consensus Favorite",
      years: "2011",
      notes: "Praised for his unnerving, tea-sipping interrogation scenes opposite Simon Baker during the Internal Affairs probe.",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
          Awards & Critical Accolades
        </h1>
        <p className="mt-2 text-sm text-muted">
          Emmy, Golden Globe, SAG, and People’s Choice recognitions for Simon Baker and the CBS creative team across 12 formal industry honors.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-rule bg-paper-2 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-medium text-ink-2">Total victories</span>
            <Trophy className="w-4 h-4 text-gold" aria-hidden="true" />
          </div>
          <div className="text-3xl font-semibold text-ink tabular-nums">
            {totalWins}
          </div>
          <p className="text-xs text-muted">
            People’s Choice Favorite New TV Drama and International Crime Thriller Awards
          </p>
        </div>

        <div className="p-5 rounded-xl border border-rule bg-paper-2 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-medium text-ink-2">Total nominations</span>
            <Award className="w-4 h-4 text-accent" aria-hidden="true" />
          </div>
          <div className="text-3xl font-semibold text-ink tabular-nums">
            {totalNoms}
          </div>
          <p className="text-xs text-muted">
            Spanning acting, directing, sound editing, and screenwriting
          </p>
        </div>

        <div className="p-5 rounded-xl border border-rule bg-paper-2 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-medium text-ink-2">Simon Baker triple crown</span>
            <Star className="w-4 h-4 text-gold fill-gold" aria-hidden="true" />
          </div>
          <div className="text-3xl font-semibold text-ink tabular-nums">
            3
          </div>
          <p className="text-xs text-muted">
            Nominated for Emmy, Golden Globe, and SAG in the same broadcast cycle
          </p>
        </div>
      </div>

      {/* Annual Nominations & Wins Timeline */}
      <section className="p-6 rounded-xl border border-rule bg-paper-2 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-ink">
              Annual Nominations and Wins Timeline (2008 to 2015)
            </h2>
            <p className="text-xs text-muted">
              Distribution of major industry nods across the broadcast lifespan
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-gold" aria-hidden="true" /> Won
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-paper-3 border border-rule" aria-hidden="true" /> Nominated
            </span>
          </div>
        </div>

        <div className="flex items-end gap-3 h-40 pt-4 border-b border-rule">
          {chartData.map((d) => {
            const maxYearCount = 4;
            const winsHeight = (d.wins / maxYearCount) * 100;
            const nomsHeight = (d.noms / maxYearCount) * 100;

            return (
              <div key={d.year} className="flex-1 flex flex-col items-center justify-end h-full">
                <div className="w-full max-w-[36px] flex flex-col justify-end h-full">
                  {d.wins > 0 && (
                    <div
                      style={{ height: `${winsHeight}%` }}
                      className="bg-gold rounded-t w-full"
                      title={`${d.wins} wins in ${d.year}`}
                    />
                  )}
                  {d.noms > 0 && (
                    <div
                      style={{ height: `${nomsHeight}%` }}
                      className="bg-paper-3 border-t border-x border-rule rounded-t w-full"
                      title={`${d.noms} nominations in ${d.year}`}
                    />
                  )}
                </div>
                <span className="text-xs text-muted mt-2 tabular-nums">
                  '{String(d.year).slice(2)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Acting Honors Showcase */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-ink">
            Acting Tributes and Recognitions
          </h2>
          <p className="text-xs text-muted">
            Lead performers recognized by the Academy of Television Arts & Sciences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actingHonors.map((h, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-rule bg-paper-2 space-y-2 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                <h3 className="text-base font-semibold text-ink">
                  {h.actor}
                </h3>
              </div>
              <div className="text-xs font-medium text-accent">
                {h.role}
              </div>
              <div className="text-xs text-muted">
                {h.honors} ({h.years})
              </div>
              <p className="text-xs text-muted leading-relaxed pt-1">
                {h.notes}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Complete Awards Repository */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-ink">
              Complete Honors Registry
            </h2>
            <p className="text-xs text-muted">
              Verified dataset from Unity Catalog table <code className="text-accent font-mono">main.tvshows.awards</code>
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg border border-rule bg-paper-2">
            <button
              type="button"
              onClick={() => {
                sound.tab();
                setFilterType("ALL");
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors duration-150 active:opacity-85 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus cursor-pointer ${
                filterType === "ALL" ? "bg-accent text-accent-ink" : "text-muted hover:text-ink"
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
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors duration-150 active:opacity-85 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus cursor-pointer ${
                filterType === "MAJOR" ? "bg-accent text-accent-ink" : "text-muted hover:text-ink"
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
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors duration-150 active:opacity-85 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus cursor-pointer ${
                filterType === "GUILD" ? "bg-accent text-accent-ink" : "text-muted hover:text-ink"
              }`}
            >
              Guild
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-rule overflow-hidden bg-paper-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-paper-3 text-muted font-medium border-b border-rule">
                <tr>
                  <th className="p-3.5">Year</th>
                  <th className="p-3.5">Award body</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Nominee or episode</th>
                  <th className="p-3.5 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {filteredAwards.map((a) => {
                  const isWon = a.result === "Won";
                  return (
                    <tr key={a.award_id} className="hover:bg-paper-3 transition-colors duration-150">
                      <td className="p-3.5 font-medium text-ink tabular-nums">
                        {a.year}
                      </td>
                      <td className="p-3.5 font-semibold text-ink">
                        {a.award_body}
                      </td>
                      <td className="p-3.5 text-muted">
                        {a.category}
                      </td>
                      <td className="p-3.5 text-muted">
                        {a.award_body.includes("Emmy") || a.award_body.includes("Golden")
                          ? "Simon Baker (Patrick Jane)"
                          : "The Mentalist Series"}
                      </td>
                      <td className="p-3.5 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            isWon
                              ? "bg-gold/20 text-gold border border-gold/30"
                              : "bg-paper-3 text-muted border border-rule"
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
