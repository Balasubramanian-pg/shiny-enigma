"use client";

import React, { useState } from "react";
import {
  Database,
  Layers,
  Cpu,
  Server,
  Copy,
  Check,
  Table,
  GitBranch,
  Terminal,
  Info,
} from "lucide-react";
import { SHOW, SEASONS, EPISODES, CHARACTERS, SEASON_CAST, AWARDS } from "@/src/data/mentalist-data";
import { sound } from "@/lib/sound";

interface TableNode {
  id: string;
  name: string;
  rows: number;
  x: number;
  y: number;
  width: number;
  fields: { name: string; type: string; isPk?: boolean; isFk?: boolean }[];
}

const DBML_TABLES: TableNode[] = [
  {
    id: "shows",
    name: "shows",
    rows: 1,
    x: 40,
    y: 40,
    width: 220,
    fields: [
      { name: "show_id", type: "VARCHAR", isPk: true },
      { name: "title", type: "VARCHAR" },
      { name: "network", type: "VARCHAR" },
      { name: "season_count", type: "INT" },
      { name: "episode_count", type: "INT" },
      { name: "peak_viewers_m", type: "DOUBLE" },
    ],
  },
  {
    id: "seasons",
    name: "seasons",
    rows: SEASONS.length,
    x: 340,
    y: 40,
    width: 220,
    fields: [
      { name: "season_no", type: "INT", isPk: true },
      { name: "show_id", type: "VARCHAR", isFk: true },
      { name: "year_start", type: "INT" },
      { name: "episode_count", type: "INT" },
      { name: "avg_viewers_m", type: "DOUBLE" },
      { name: "avg_imdb_rating", type: "DOUBLE" },
    ],
  },
  {
    id: "episodes",
    name: "episodes",
    rows: EPISODES.length,
    x: 640,
    y: 40,
    width: 220,
    fields: [
      { name: "episode_id", type: "VARCHAR", isPk: true },
      { name: "season_no", type: "INT", isFk: true },
      { name: "overall_no", type: "INT" },
      { name: "title", type: "VARCHAR" },
      { name: "air_date", type: "DATE" },
      { name: "us_viewers_m", type: "DOUBLE" },
      { name: "imdb_rating", type: "DOUBLE" },
    ],
  },
  {
    id: "characters",
    name: "characters",
    rows: CHARACTERS.length,
    x: 40,
    y: 330,
    width: 220,
    fields: [
      { name: "character_id", type: "VARCHAR", isPk: true },
      { name: "show_id", type: "VARCHAR", isFk: true },
      { name: "name", type: "VARCHAR" },
      { name: "actor", type: "VARCHAR" },
      { name: "household", type: "VARCHAR" },
      { name: "generation", type: "VARCHAR" },
    ],
  },
  {
    id: "season_cast",
    name: "season_cast",
    rows: SEASON_CAST.length,
    x: 340,
    y: 330,
    width: 220,
    fields: [
      { name: "season_cast_id", type: "VARCHAR", isPk: true },
      { name: "character_id", type: "VARCHAR", isFk: true },
      { name: "season_no", type: "INT", isFk: true },
      { name: "actor", type: "VARCHAR" },
      { name: "role_type", type: "VARCHAR" },
    ],
  },
  {
    id: "awards",
    name: "awards",
    rows: AWARDS.length,
    x: 640,
    y: 330,
    width: 220,
    fields: [
      { name: "award_id", type: "VARCHAR", isPk: true },
      { name: "show_id", type: "VARCHAR", isFk: true },
      { name: "episode_id", type: "VARCHAR", isFk: true },
      { name: "year", type: "INT" },
      { name: "award_body", type: "VARCHAR" },
      { name: "result", type: "VARCHAR" },
    ],
  },
];

interface RelationWire {
  from: string;
  fromField: string;
  to: string;
  toField: string;
  label: string;
  path: string;
}

const RELATION_WIRES: RelationWire[] = [
  {
    from: "shows",
    fromField: "show_id",
    to: "seasons",
    toField: "show_id",
    label: "1:N",
    path: "M 260 70 C 300 70, 300 70, 340 70",
  },
  {
    from: "seasons",
    fromField: "season_no",
    to: "episodes",
    toField: "season_no",
    label: "1:N",
    path: "M 560 70 C 600 70, 600 70, 640 70",
  },
  {
    from: "shows",
    fromField: "show_id",
    to: "characters",
    toField: "show_id",
    label: "1:N",
    path: "M 150 240 C 150 285, 150 285, 150 330",
  },
  {
    from: "characters",
    fromField: "character_id",
    to: "season_cast",
    toField: "character_id",
    label: "1:N",
    path: "M 260 360 C 300 360, 300 360, 340 360",
  },
  {
    from: "seasons",
    fromField: "season_no",
    to: "season_cast",
    toField: "season_no",
    label: "1:N",
    path: "M 450 240 C 450 285, 450 285, 450 330",
  },
  {
    from: "episodes",
    fromField: "episode_id",
    to: "awards",
    toField: "episode_id",
    label: "1:N",
    path: "M 750 240 C 750 285, 750 285, 750 330",
  },
];

const RAW_DBML_STRING = `// Database Markup Language (DBML)
// The Mentalist Explorer - Databricks Unity Catalog: main.tvshows

Table shows {
  show_id varchar [pk]
  title varchar [not null]
  network varchar
  first_aired date
  last_aired date
  episode_count int
  season_count int
  peak_viewers_season int
  peak_viewers_m double
  highest_rated_episode_id varchar
  highest_imdb_rating double
}

Table seasons {
  season_no int [pk]
  show_id varchar [ref: > shows.show_id]
  year_start int
  year_end int
  episode_count int
  avg_viewers_m double
  avg_imdb_rating double
  rank_us_shows int
  top_rated_episode_id varchar [ref: > episodes.episode_id]
}

Table episodes {
  episode_id varchar [pk]
  show_id varchar [ref: > shows.show_id]
  season_no int [ref: > seasons.season_no]
  episode_no int
  overall_no int
  title varchar [not null]
  air_date date
  us_viewers_m double
  imdb_rating double
  imdb_votes int
  directed_by varchar
  written_by varchar
}

Table characters {
  character_id varchar [pk]
  show_id varchar [ref: > shows.show_id]
  name varchar [not null]
  actor varchar
  household varchar
  generation varchar
  seasons_active varchar
}

Table season_cast {
  season_cast_id varchar [pk]
  character_id varchar [ref: > characters.character_id]
  season_no int [ref: > seasons.season_no]
  actor varchar
  role_type varchar
}

Table awards {
  award_id varchar [pk]
  show_id varchar [ref: > shows.show_id]
  episode_id varchar [ref: > episodes.episode_id]
  year int
  award_body varchar
  category varchar
  result varchar
}

// Foreign Key Relations
Ref: shows.show_id < seasons.show_id
Ref: seasons.season_no < episodes.season_no
Ref: shows.show_id < characters.show_id
Ref: characters.character_id < season_cast.character_id
Ref: seasons.season_no < season_cast.season_no
Ref: episodes.episode_id < awards.episode_id`;

export default function AboutPage() {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTable, setActiveTable] = useState<string | null>(null);

  const handleCopy = () => {
    sound.success();
    navigator.clipboard.writeText(RAW_DBML_STRING);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const architectureTiers = [
    {
      tier: "Tier 01",
      title: "Storage & Governance",
      tech: "Unity Catalog & Delta Lake 3.2.0",
      icon: Database,
      desc: "Centralized enterprise metadata catalog governing catalog “main” and schema “tvshows”. Delta Lake ACID tables provide snappy columnar parquet reads and versioned time travel.",
      metric: "6 Governed Tables",
    },
    {
      tier: "Tier 02",
      title: "Analytical Compute",
      tech: "Databricks Serverless SQL Warehouse",
      icon: Cpu,
      desc: "Zero-management elastic compute warehouse powering sub-second analytical queries and aggregations across all 151 broadcast episodes.",
      metric: "Serverless SQL 2X-Small",
    },
    {
      tier: "Tier 03",
      title: "Data Services Layer",
      tech: "Python 3.13 & Databricks SDK",
      icon: Terminal,
      desc: "In-memory caching and dual-mode hydration engine: reads directly from Databricks SQL when configured, with high-fidelity local CSV fallback.",
      metric: "100% Schema Parity",
    },
    {
      tier: "Tier 04",
      title: "Editorial Presentation",
      tech: "React 19, Framer Motion & Tailwind",
      icon: Layers,
      desc: "Investigative dossier aesthetic with Afacad typography, Web Audio micro-haptics, dynamic SVG sparklines, and live bezier-animated DBML canvas.",
      metric: "60 FPS Tactile UI",
    },
    {
      tier: "Tier 05",
      title: "Application Hosting",
      tech: "Databricks Apps Runtime",
      icon: Server,
      desc: "Hosted on Databricks Apps serverless container infrastructure with unified SSO authorization, SSL termination, and managed environment secrets.",
      metric: "Databricks Apps v1.0",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
          Architecture & Live DBML Graph
        </h1>
        <p className="mt-2 text-sm text-muted">
          Databricks 5-tier serverless architecture and animated relational entity graph for The Mentalist across Unity Catalog catalog “main”, schema “tvshows”.
        </p>
      </div>

      {/* Live Dataset Row Counts Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {DBML_TABLES.map((t) => (
          <div
            key={t.id}
            onMouseEnter={() => {
              sound.tab();
              setActiveTable(t.id);
            }}
            onMouseLeave={() => setActiveTable(null)}
            className={`p-3.5 rounded-xl border transition-colors duration-150 cursor-pointer ${
              activeTable === t.id
                ? "border-accent bg-accent/10"
                : "border-rule bg-paper-2"
            }`}
          >
            <div className="flex items-center justify-between text-muted mb-1">
              <span className="text-xs font-medium">Table</span>
              <Table className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
            </div>
            <div className="text-xs font-semibold text-ink font-mono truncate">
              {t.name}
            </div>
            <div className="text-lg font-semibold text-accent mt-0.5 tabular-nums">
              {t.rows} <span className="text-xs font-normal text-muted">rows</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Motion DBML Canvas Section */}
      <section className="p-6 sm:p-8 rounded-xl border border-rule bg-paper-2 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rule pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-ink">
              <GitBranch className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink">
                Live Motion Relational DBML Diagram
              </h2>
              <p className="text-xs text-muted">
                Animated bezier wires illustrate streaming entity integrity between Unity Catalog Delta tables
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <span className="w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
              Live relational sync
            </span>
          </div>
        </div>

        {/* The Motion Diagram Canvas (Interactive SVG with Cards) */}
        <div className="relative w-full overflow-x-auto pt-2 pb-4">
          <div className="min-w-[900px] h-[580px] relative select-none">
            {/* SVG Connecting Bezier Wires */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox="0 0 900 580"
              aria-hidden="true"
            >
              {RELATION_WIRES.map((wire, idx) => {
                const isWireActive =
                  activeTable === null ||
                  activeTable === wire.from ||
                  activeTable === wire.to;

                return (
                  <g key={idx}>
                    {/* Shadow / Base Line */}
                    <path
                      d={wire.path}
                      fill="none"
                      stroke={isWireActive ? "var(--color-accent)" : "var(--color-rule)"}
                      strokeOpacity={isWireActive ? "0.2" : "0.5"}
                      strokeWidth={isWireActive ? "4" : "1.5"}
                      strokeLinecap="round"
                    />

                    {/* Animated Pulsing Stream Flow */}
                    <path
                      d={wire.path}
                      fill="none"
                      stroke={isWireActive ? "var(--color-accent)" : "var(--color-rule)"}
                      strokeWidth={isWireActive ? "2" : "1"}
                      strokeDasharray="6 6"
                      strokeDashoffset={isWireActive ? "-20" : "0"}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Table Nodes */}
            {DBML_TABLES.map((table) => {
              const isSelected = activeTable === table.id;

              return (
                <div
                  key={table.id}
                  style={{
                    left: `${table.x}px`,
                    top: `${table.y}px`,
                    width: `${table.width}px`,
                  }}
                  onMouseEnter={() => {
                    sound.click();
                    setActiveTable(table.id);
                  }}
                  onMouseLeave={() => setActiveTable(null)}
                  className={`absolute z-20 rounded-xl overflow-hidden border transition-colors duration-150 cursor-pointer ${
                    isSelected
                      ? "border-accent bg-paper shadow-md"
                      : "border-rule bg-paper-2"
                  }`}
                >
                  {/* Table Header */}
                  <div
                    className={`px-3 py-2 flex items-center justify-between border-b ${
                      isSelected
                        ? "bg-accent text-accent-ink border-accent"
                        : "bg-paper-3 text-ink border-rule"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-mono text-xs font-medium">
                      <Table className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{table.name}</span>
                    </div>
                    <span className="text-xs tabular-nums opacity-80">
                      {table.rows} rows
                    </span>
                  </div>

                  {/* Table Fields */}
                  <div className="p-2 space-y-1 text-xs">
                    {table.fields.map((field) => (
                      <div
                        key={field.name}
                        className="flex items-center justify-between px-1.5 py-0.5 rounded hover:bg-paper-3"
                      >
                        <div className="flex items-center gap-1.5">
                          {field.isPk && (
                            <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-400 text-xs font-medium">
                              PK
                            </span>
                          )}
                          {field.isFk && (
                            <span className="px-1 py-0.2 rounded bg-accent/20 text-accent text-xs font-medium">
                              FK
                            </span>
                          )}
                          <span className="text-ink font-mono">
                            {field.name}
                          </span>
                        </div>
                        <span className="text-muted text-xs font-mono">
                          {field.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hover Tip */}
        <div className="flex items-center justify-between pt-2 text-xs text-muted">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-accent shrink-0" aria-hidden="true" />
            <span>Hover any table card to isolate relational foreign key wires and stream pulses</span>
          </div>
          <span className="tabular-nums">Engine: Delta Lake 3.2.0 ACID</span>
        </div>
      </section>

      {/* Syntax Highlighted DBML Code Block with 1-Click Copy */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-ink">
              Declarative DBML Schema Definition
            </h2>
            <p className="text-xs text-muted">
              Production-ready Database Markup Language file compatible with dbdocs.io and dbdiagram.io
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg bg-paper-3 border border-rule hover:border-accent text-ink text-xs font-medium flex items-center gap-1.5 active:opacity-85 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus transition-colors duration-150 shadow-sm cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                <span>Copied DBML</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copy DBML</span>
              </>
            )}
          </button>
        </div>

        <div className="relative rounded-xl border border-rule bg-paper p-5 overflow-hidden text-ink font-mono text-xs">
          <pre className="overflow-x-auto max-h-96 leading-relaxed">
            <code>{RAW_DBML_STRING}</code>
          </pre>
        </div>
      </section>

      {/* Databricks 5-Tier Architecture Stack */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-ink">
            Databricks 5-Tier Architecture Stack
          </h2>
          <p className="text-xs text-muted">
            End-to-end data pipelines from Delta Lake storage to reactive React 19 presentation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {architectureTiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.tier}
                className="p-5 rounded-xl border border-rule bg-paper-2 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-paper-3 text-muted border border-rule">
                      {tier.tier}
                    </span>
                    <Icon className="w-4 h-4 text-accent" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold text-ink">
                    {tier.title}
                  </h3>
                  <div className="text-xs font-medium text-accent">
                    {tier.tech}
                  </div>
                  <p className="text-xs text-muted leading-relaxed pt-1">
                    {tier.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-rule text-xs text-muted flex items-center justify-between">
                  <span>Spec Metric:</span>
                  <span className="font-medium text-ink">
                    {tier.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
