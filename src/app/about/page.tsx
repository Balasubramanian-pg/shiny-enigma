"use client";

import React, { useState } from "react";
import {
  Database,
  Layers,
  Cpu,
  Server,
  HardDrive,
  Copy,
  Check,
  Table,
  GitBranch,
  ShieldCheck,
  Terminal,
  Activity,
  ArrowRight,
  ExternalLink,
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
      tier: "TIER 01",
      title: "Storage & Governance",
      tech: "Unity Catalog & Delta Lake 3.2.0",
      icon: Database,
      desc: "Centralized enterprise metadata catalog governing catalog 'main' and schema 'tvshows'. Delta Lake ACID tables provide snappy columnar parquet reads and versioned time travel.",
      metric: "6 Governed Tables",
    },
    {
      tier: "TIER 02",
      title: "Analytical Compute",
      tech: "Databricks Serverless SQL Warehouse",
      icon: Cpu,
      desc: "Zero-management elastic compute warehouse powering sub-second analytical queries and aggregations across all 151 broadcast episodes.",
      metric: "Serverless SQL 2X-Small",
    },
    {
      tier: "TIER 03",
      title: "Data Services Layer",
      tech: "Python 3.13 & Databricks SDK",
      icon: Terminal,
      desc: "In-memory caching and dual-mode hydration engine: reads directly from Databricks SQL when configured, with high-fidelity local CSV fallback.",
      metric: "100% Schema Parity",
    },
    {
      tier: "TIER 04",
      title: "Editorial Presentation",
      tech: "React 19, Framer Motion & Tailwind",
      icon: Layers,
      desc: "Investigative dossier aesthetic with Afacad typography, Web Audio micro-haptics, dynamic SVG sparklines, and live bezier-animated DBML canvas.",
      metric: "60 FPS Tactile UI",
    },
    {
      tier: "TIER 05",
      title: "Application Hosting",
      tech: "Databricks Apps Runtime",
      icon: Server,
      desc: "Hosted on Databricks Apps serverless container infrastructure with unified SSO authorization, SSL termination, and managed environment secrets.",
      metric: "Databricks Apps v1.0",
    },
  ];

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#C8102E] text-white">
            PLATFORM ARCHITECTURE & DATA MODELS
          </span>
          <span className="text-xs text-neutral-400">Unity Catalog main.tvshows</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white font-heading">
          Architecture & Live DBML Graph
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-body">
          Databricks 5-Tier serverless architecture and animated relational entity graph for The Mentalist
        </p>
      </div>

      {/* LIVE DATASET ROW COUNTS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {DBML_TABLES.map((t) => (
          <div
            key={t.id}
            onMouseEnter={() => {
              sound.tab();
              setActiveTable(t.id);
            }}
            onMouseLeave={() => setActiveTable(null)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              activeTable === t.id
                ? "border-[#C8102E] bg-[#C8102E]/10"
                : "border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#12161F]/70"
            }`}
          >
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-[10px] font-mono font-bold">TABLE</span>
              <Table className="w-3.5 h-3.5 text-[#C8102E]" />
            </div>
            <div className="text-xs font-bold text-neutral-900 dark:text-white font-mono truncate">
              {t.name}
            </div>
            <div className="text-lg font-bold text-[#C8102E] font-heading mt-0.5">
              {t.rows} <span className="text-[10px] font-normal text-neutral-400">rows</span>
            </div>
          </div>
        ))}
      </div>

      {/* LIVE MOTION DBML CANVAS SECTION */}
      <section className="p-6 sm:p-8 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#10141D]/80 backdrop-blur-md shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C8102E] flex items-center justify-center text-white">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white font-heading">
                Live Motion Relational DBML Diagram
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Animated bezier wires illustrate streaming entity integrity between Unity Catalog Delta tables
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#C8102E] animate-ping" />
              Live Relational Sync
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
            >
              <defs>
                <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C8102E" />
                  <stop offset="100%" stopColor="#E11D48" />
                </linearGradient>
              </defs>

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
                      stroke={isWireActive ? "rgba(200, 16, 46, 0.25)" : "rgba(100, 100, 100, 0.15)"}
                      strokeWidth={isWireActive ? "4" : "2"}
                      strokeLinecap="round"
                    />

                    {/* Animated Pulsing Stream Flow */}
                    <path
                      d={wire.path}
                      fill="none"
                      stroke={isWireActive ? "#C8102E" : "rgba(150, 150, 150, 0.3)"}
                      strokeWidth={isWireActive ? "2" : "1"}
                      strokeDasharray="6 6"
                      strokeDashoffset={isWireActive ? "-20" : "0"}
                      className={isWireActive ? "animate-[dash_1.5s_linear_infinite]" : ""}
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
                  className={`absolute z-20 rounded-xl overflow-hidden border shadow-md transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-[#C8102E] bg-white dark:bg-[#151923] ring-2 ring-[#C8102E]/30 scale-[1.02]"
                      : "border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-[#12161F]/90"
                  }`}
                >
                  {/* Table Header */}
                  <div
                    className={`px-3 py-2 flex items-center justify-between border-b ${
                      isSelected
                        ? "bg-[#C8102E] text-white border-[#C8102E]"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                      <Table className="w-3.5 h-3.5" />
                      <span>{table.name}</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-80">
                      {table.rows} rows
                    </span>
                  </div>

                  {/* Table Fields */}
                  <div className="p-2 space-y-1 text-[11px] font-mono">
                    {table.fields.map((field) => (
                      <div
                        key={field.name}
                        className="flex items-center justify-between px-1.5 py-0.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
                      >
                        <div className="flex items-center gap-1.5">
                          {field.isPk && (
                            <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[9px] font-bold">
                              PK
                            </span>
                          )}
                          {field.isFk && (
                            <span className="px-1 py-0.2 rounded bg-[#C8102E]/20 text-[#C8102E] text-[9px] font-bold">
                              FK
                            </span>
                          )}
                          <span className="text-neutral-800 dark:text-neutral-200">
                            {field.name}
                          </span>
                        </div>
                        <span className="text-neutral-400 text-[10px]">
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
        <div className="flex items-center justify-between pt-2 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[#C8102E]" />
            <span>Hover any table card to isolate relational foreign key wires and stream pulses</span>
          </div>
          <span className="font-mono text-[11px]">Engine: Delta Lake 3.2.0 ACID</span>
        </div>
      </section>

      {/* SYNTAX HIGHLIGHTED DBML CODE BLOCK WITH 1-CLICK COPY */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white font-heading">
              Declarative DBML Schema Definition
            </h2>
            <p className="text-xs text-neutral-500 font-body">
              Production-ready Database Markup Language file compatible with dbdocs.io and dbdiagram.io
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied DBML</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy DBML</span>
              </>
            )}
          </button>
        </div>

        <div className="relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-950 p-5 overflow-hidden text-neutral-200 font-mono text-xs">
          <pre className="overflow-x-auto max-h-96 leading-relaxed">
            <code>{RAW_DBML_STRING}</code>
          </pre>
        </div>
      </section>

      {/* DATABRICKS 5-TIER ARCHITECTURE SPECIFICATION */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white font-heading">
            Databricks 5-Tier Architecture Stack
          </h2>
          <p className="text-xs text-neutral-500 font-body">
            End-to-end data pipelines from Delta Lake storage to reactive React 19 presentation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {architectureTiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.tier}
                className="p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#12161F]/70 backdrop-blur-sm shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      {tier.tier}
                    </span>
                    <Icon className="w-4 h-4 text-[#C8102E]" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white font-heading">
                    {tier.title}
                  </h3>
                  <div className="text-xs font-semibold text-[#C8102E] font-mono">
                    {tier.tech}
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pt-1">
                    {tier.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                  <span>Spec Metric:</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
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
