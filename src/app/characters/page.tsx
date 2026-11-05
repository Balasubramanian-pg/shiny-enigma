"use client";

import React, { useState } from "react";
import {
  Crosshair,
  Search,
  X,
} from "lucide-react";
import { CHARACTERS, CharacterData } from "@/src/data/mentalist-data";
import { sound } from "@/lib/sound";

interface RedJohnSuspect {
  id: string;
  name: string;
  actor: string;
  role: string;
  status: "Confirmed Red John" | "Arrested" | "Deceased";
  eliminatedIn: string;
  tattooStatus: "Three dots confirmed" | "Cleared" | "Unknown prior to death";
  notes: string;
}

const RED_JOHN_SUSPECTS: RedJohnSuspect[] = [
  {
    id: "mcallister",
    name: "Thomas McAllister",
    actor: "Xander Berkeley",
    role: "Sheriff of Napa County, Head of Blake Association",
    status: "Confirmed Red John",
    eliminatedIn: "Season 6, Episode 8 (“Red John”)",
    tattooStatus: "Three dots confirmed",
    notes: "Faked death in S06E06 explosion. Tracked and strangled by Patrick Jane in a cemetery church after a 10-year pursuit.",
  },
  {
    id: "stiles",
    name: "Bret Stiles",
    actor: "Malcolm McDowell",
    role: "Founder & Supreme Leader of “Visualize” Church",
    status: "Deceased",
    eliminatedIn: "Season 6, Episode 6 (“Fire and Brimstone”)",
    tattooStatus: "Cleared",
    notes: "Terminally ill; willingly attended Jane’s Malibu gathering and was killed in the blast.",
  },
  {
    id: "bertram",
    name: "Gale Bertram",
    actor: "Michael Gaston",
    role: "Director of the California Bureau of Investigation (CBI)",
    status: "Deceased",
    eliminatedIn: "Season 6, Episode 8 (“Red John”)",
    tattooStatus: "Three dots confirmed",
    notes: "High-ranking Blake Association operator. Assassinated by McAllister’s henchman Oscar Cordero at the Alexandria Cemetery.",
  },
  {
    id: "smith",
    name: "Reede Smith",
    actor: "Drew Powell",
    role: "FBI Special Agent",
    status: "Arrested",
    eliminatedIn: "Season 6, Episode 7 (“The Great Red Dragon”)",
    tattooStatus: "Three dots confirmed",
    notes: "Wounded and turned on the Blake cabal; confessed to murder of Bob Kirkland and supplied state’s evidence.",
  },
  {
    id: "haffner",
    name: "Raymond Haffner",
    actor: "Reed Diamond",
    role: "Private Investigator, Former CBI Team Leader",
    status: "Deceased",
    eliminatedIn: "Season 6, Episode 6 (“Fire and Brimstone”)",
    tattooStatus: "Cleared",
    notes: "Visualize member; perished in the blast at Jane’s Malibu residence.",
  },
  {
    id: "kirkland",
    name: "Bob Kirkland",
    actor: "Kevin Corrigan",
    role: "Department of Homeland Security Senior Agent",
    status: "Deceased",
    eliminatedIn: "Season 6, Episode 4 (“Red Listed”)",
    tattooStatus: "Cleared",
    notes: "Pursued Red John for personal revenge; assassinated roadside by FBI Agent Reede Smith on Blake Association orders.",
  },
  {
    id: "partridge",
    name: "Brett Partridge",
    actor: "Jack Plotnick",
    role: "CBI Forensics Lead and Crime Scene Tech",
    status: "Deceased",
    eliminatedIn: "Season 6, Episode 1 (“The Desert Rose”)",
    tattooStatus: "Cleared",
    notes: "Murdered by Red John in the season premiere; whispered “Tyger, Tyger” with his dying breath to Lisbon.",
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
          Characters & Case Hierarchy
        </h1>
        <p className="mt-2 text-sm text-muted">
          CBI Serious Crimes Unit, FBI Austin Field Office, and the 7 Blake Association Red John suspects across 14 verified dossiers.
        </p>
      </div>

      {/* Red John 7 Suspects Elimination Matrix */}
      <section className="p-6 sm:p-8 rounded-xl border border-rule bg-paper-2 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rule pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-ink">
              <Crosshair className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink">
                The Red John Suspects Matrix
              </h2>
              <p className="text-xs text-muted">
                Patrick Jane’s 7 confirmed suspects notebook (Season 5 finale through Season 6 unmasking)
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-accent/15 text-accent font-semibold border border-accent/25">
            Blake Association (“Tyger, Tyger”)
          </span>
        </div>

        {/* Suspects Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RED_JOHN_SUSPECTS.map((suspect) => {
            const isConfirmed = suspect.status === "Confirmed Red John";
            const isArrested = suspect.status === "Arrested";

            return (
              <div
                key={suspect.id}
                className={`p-5 rounded-xl border transition-colors duration-150 flex flex-col justify-between ${
                  isConfirmed
                    ? "border-accent bg-accent/10"
                    : "border-rule bg-paper"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        isConfirmed
                          ? "bg-accent text-accent-ink"
                          : isArrested
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-paper-3 text-muted border border-rule"
                      }`}
                    >
                      {suspect.status}
                    </span>
                    <span className="text-xs text-muted">
                      {suspect.tattooStatus}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-ink">
                    {suspect.name}
                  </h3>
                  <div className="text-xs font-medium text-muted">
                    Played by {suspect.actor}
                  </div>
                  <div className="text-xs font-medium text-accent">
                    {suspect.role}
                  </div>
                  <p className="text-xs text-muted leading-relaxed pt-1">
                    {suspect.notes}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-rule text-xs text-muted">
                  Resolution: {suspect.eliminatedIn}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg border border-rule bg-paper-2">
          {households.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => {
                sound.tab();
                setFilterHousehold(h);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 active:opacity-85 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus cursor-pointer ${
                filterHousehold === h
                  ? "bg-accent text-accent-ink shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              {h === "ALL" ? "All Dossiers" : h}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search characters, actors, bios..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-rule bg-paper-2 text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus disabled:opacity-40"
          />
        </div>
      </div>

      {/* Characters Portraits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCharacters.map((char) => (
          <div
            key={char.character_id}
            onClick={() => {
              sound.expand();
              setSelectedCharacter(char);
            }}
            className="group rounded-xl overflow-hidden border border-rule bg-paper-2 shadow-sm hover:border-accent/60 transition-colors duration-150 cursor-pointer flex flex-col justify-between"
          >
            {/* Portrait Image with Scrim */}
            <div className="relative h-64 w-full overflow-hidden bg-paper-3">
              <img
                src={char.image_url}
                alt={char.name}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/static/images/characters/patrick_jane.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/75 text-white border border-white/20">
                  {char.household}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="text-lg font-semibold leading-tight group-hover:text-accent transition-colors duration-150">
                  {char.name}
                </h3>
                <div className="text-xs text-neutral-300 font-normal">
                  {char.actor}
                </div>
              </div>
            </div>

            {/* Dossier Details Body */}
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-xs font-medium text-accent mb-1">
                  {char.generation}
                </div>
                <p className="text-xs text-muted line-clamp-3 leading-relaxed">
                  {char.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-rule flex items-center justify-between text-xs text-muted">
                <span>{char.seasons_active}</span>
                <span className="text-accent font-medium group-hover:underline">
                  View file
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Character Dossier Full Modal */}
      {selectedCharacter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => setSelectedCharacter(null)}
        >
          <div
            className="w-full max-w-lg bg-paper-2 rounded-xl overflow-hidden border border-rule shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-72 w-full bg-paper-3">
              <img
                src={selectedCharacter.image_url}
                alt={selectedCharacter.name}
                className="w-full h-full object-cover object-top"
              />
              <button
                type="button"
                onClick={() => setSelectedCharacter(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-accent active:opacity-85 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus transition-colors duration-150 cursor-pointer"
                aria-label="Close dossier modal"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              <div className="text-xs font-semibold text-accent">
                {selectedCharacter.household}, {selectedCharacter.generation}
              </div>
              <h2 className="text-2xl font-semibold text-ink">
                {selectedCharacter.name}
              </h2>
              <div className="text-xs text-muted">
                Portrayed by {selectedCharacter.actor}, {selectedCharacter.seasons_active}
              </div>
              <p className="text-xs text-ink-2 leading-relaxed pt-2">
                {selectedCharacter.bio}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
