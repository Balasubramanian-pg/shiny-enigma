"use client";

import React, { useState } from "react";
import {
  Users,
  Shield,
  Crosshair,
  Skull,
  CheckCircle2,
  AlertCircle,
  Eye,
  Star,
  Search,
  Filter,
  X,
  Building2,
} from "lucide-react";
import { CHARACTERS, CharacterData } from "@/src/data/mentalist-data";
import { sound } from "@/lib/sound";

interface RedJohnSuspect {
  id: string;
  name: string;
  actor: string;
  role: string;
  status: "DECEASED" | "ARRESTED" | "CONFIRMED RED JOHN";
  eliminatedIn: string;
  tattooStatus: "CONFIRMED THREE DOTS" | "CLEARED" | "UNKNOWN BEFORE DEATH";
  notes: string;
}

const RED_JOHN_SUSPECTS: RedJohnSuspect[] = [
  {
    id: "mcallister",
    name: "Thomas McAllister",
    actor: "Xander Berkeley",
    role: "Sheriff of Napa County / Head of Blake Association",
    status: "CONFIRMED RED JOHN",
    eliminatedIn: "Season 6, Episode 8 ('Red John')",
    tattooStatus: "CONFIRMED THREE DOTS",
    notes: "Faked death in S06E06 explosion. Tracked and strangled by Patrick Jane in a cemetery church after a 10-year pursuit.",
  },
  {
    id: "stiles",
    name: "Bret Stiles",
    actor: "Malcolm McDowell",
    role: "Founder & Supreme Leader of 'Visualize' Church",
    status: "DECEASED",
    eliminatedIn: "Season 6, Episode 6 ('Fire and Brimstone')",
    tattooStatus: "CLEARED",
    notes: "Terminally ill; willingly attended Jane's Malibu gathering and was killed in the blast.",
  },
  {
    id: "bertram",
    name: "Gale Bertram",
    actor: "Michael Gaston",
    role: "Director of the California Bureau of Investigation (CBI)",
    status: "DECEASED",
    eliminatedIn: "Season 6, Episode 8 ('Red John')",
    tattooStatus: "CONFIRMED THREE DOTS",
    notes: "High-ranking Blake Association operator. Assassinated by McAllister's henchman Oscar Cordero at the Alexandria Cemetery.",
  },
  {
    id: "smith",
    name: "Reede Smith",
    actor: "Drew Powell",
    role: "FBI Special Agent",
    status: "ARRESTED",
    eliminatedIn: "Season 6, Episode 7 ('The Great Red Dragon')",
    tattooStatus: "CONFIRMED THREE DOTS",
    notes: "Wounded and turned on the Blake cabal; confessed to murder of Bob Kirkland and supplied state's evidence.",
  },
  {
    id: "haffner",
    name: "Raymond Haffner",
    actor: "Reed Diamond",
    role: "Private Investigator / Former CBI Team Leader",
    status: "DECEASED",
    eliminatedIn: "Season 6, Episode 6 ('Fire and Brimstone')",
    tattooStatus: "CLEARED",
    notes: "Visualize member; perished in the blast at Jane's Malibu residence.",
  },
  {
    id: "kirkland",
    name: "Bob Kirkland",
    actor: "Kevin Corrigan",
    role: "Department of Homeland Security Senior Agent",
    status: "DECEASED",
    eliminatedIn: "Season 6, Episode 4 ('Red Listed')",
    tattooStatus: "CLEARED",
    notes: "Pursued Red John for personal revenge; assassinated roadside by FBI Agent Reede Smith on Blake Association orders.",
  },
  {
    id: "partridge",
    name: "Brett Partridge",
    actor: "Jack Plotnick",
    role: "CBI Forensics Lead & Crime Scene Tech",
    status: "DECEASED",
    eliminatedIn: "Season 6, Episode 1 ('The Desert Rose')",
    tattooStatus: "CLEARED",
    notes: "Murdered by Red John in the season premiere; whispered 'Tyger, Tyger' with his dying breath to Lisbon.",
  },
];

export default function CharactersPage() {
  const [filterHousehold, setFilterHousehold] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterData | null>(null);

  const households = ["ALL", "CBI Core Team", "FBI Austin Field Office", "CBI Leadership", "Antagonists & Nemeses"];

  const filteredCharacters = CHARACTERS.filter((c) => {
    const matchesFilter = filterHousehold === "ALL" || c.household === filterHousehold;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#C8102E] text-white">
            CBI PERSONNEL & SUSPECT DOSSIERS
          </span>
          <span className="text-xs text-neutral-400">14 Verified Dossiers</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white font-heading">
          Characters & Case Hierarchy
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-body">
          CBI Serious Crimes Unit, FBI Austin Field Office, and the 7 Blake Association Red John Suspects
        </p>
      </div>

      {/* RED JOHN 7 SUSPECTS ELIMINATION MATRIX */}
      <section className="p-6 sm:p-8 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#10141D]/80 backdrop-blur-md shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C8102E] flex items-center justify-center text-white">
              <Crosshair className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white font-heading">
                The Red John Suspects Matrix
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Patrick Jane's 7 confirmed suspects notebook (Season 5 finale through Season 6 unmasking)
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#C8102E]/10 text-[#C8102E] font-semibold">
            Blake Association ("Tyger, Tyger")
          </span>
        </div>

        {/* Suspects Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RED_JOHN_SUSPECTS.map((suspect) => {
            const isConfirmed = suspect.status === "CONFIRMED RED JOHN";
            const isArrested = suspect.status === "ARRESTED";

            return (
              <div
                key={suspect.id}
                className={`p-5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                  isConfirmed
                    ? "border-[#C8102E] bg-[#C8102E]/10 dark:bg-[#C8102E]/20 ring-1 ring-[#C8102E]"
                    : "border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-[#12161F]/60"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        isConfirmed
                          ? "bg-[#C8102E] text-white"
                          : isArrested
                          ? "bg-amber-600 text-white"
                          : "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      {suspect.status}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      {suspect.tattooStatus}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-heading">
                    {suspect.name}
                  </h3>
                  <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    Played by {suspect.actor}
                  </div>
                  <div className="text-xs font-semibold text-[#C8102E]">
                    {suspect.role}
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pt-1">
                    {suspect.notes}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-neutral-200 dark:border-neutral-800/80 text-[11px] text-neutral-400">
                  Resolution: {suspect.eliminatedIn}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#12161F]/70 backdrop-blur-sm">
          {households.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => {
                sound.tab();
                setFilterHousehold(h);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterHousehold === h
                  ? "bg-[#C8102E] text-white shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {h === "ALL" ? "All Dossiers" : h}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search characters, actors, bios..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-[#12161F]/70 focus:outline-none focus:ring-2 focus:ring-[#C8102E] text-neutral-900 dark:text-white"
          />
        </div>
      </div>

      {/* CHARACTERS PORTRAITS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCharacters.map((char) => (
          <div
            key={char.character_id}
            onClick={() => {
              sound.expand();
              setSelectedCharacter(char);
            }}
            className="group rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#12161F]/70 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-[#C8102E]/60 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            {/* Portrait Image with Scrim */}
            <div className="relative h-64 w-full overflow-hidden bg-neutral-900">
              <img
                src={char.image_url}
                alt={char.name}
                className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                onError={(e) => {
                  // Fallback to placeholder if needed
                  (e.target as HTMLImageElement).src = "/static/images/characters/patrick_jane.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                  {char.household}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="text-xl font-bold font-heading leading-tight group-hover:text-[#C8102E] transition-colors">
                  {char.name}
                </h3>
                <div className="text-xs text-neutral-300 font-medium">
                  {char.actor}
                </div>
              </div>
            </div>

            {/* Dossier Details Body */}
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#C8102E] mb-1">
                  {char.generation}
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                  {char.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                <span>{char.seasons_active}</span>
                <span className="text-[#C8102E] font-semibold group-hover:underline">
                  Full File →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Character Dossier Full Modal */}
      {selectedCharacter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedCharacter(null)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-[#12161F] rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-72 w-full bg-neutral-900">
              <img
                src={selectedCharacter.image_url}
                alt={selectedCharacter.name}
                className="w-full h-full object-cover object-top"
              />
              <button
                type="button"
                onClick={() => setSelectedCharacter(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-[#C8102E] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              <span className="text-xs font-bold text-[#C8102E] uppercase tracking-wider">
                {selectedCharacter.household} · {selectedCharacter.generation}
              </span>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white font-heading">
                {selectedCharacter.name}
              </h2>
              <div className="text-sm font-medium text-neutral-500">
                Portrayed by {selectedCharacter.actor} · {selectedCharacter.seasons_active}
              </div>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed pt-2">
                {selectedCharacter.bio}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
