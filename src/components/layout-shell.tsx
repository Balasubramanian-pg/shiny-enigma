"use client";

import React, { useState, useEffect } from "react";
import Link from "next/navigation";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Tv,
  GitCompare,
  Users,
  Trophy,
  Database,
  Shield,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Search,
  Sparkles,
  Command,
  X,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { ResponsiveSidebar, NavItem } from "@/src/components/ui/responsive-sidebar";
import { sound } from "@/lib/sound";
import { EPISODES, CHARACTERS } from "@/src/data/mentalist-data";

interface LayoutShellProps {
  children: React.ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isDark, setIsDark] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    // Check initial dark mode from DOM or localStorage
    const savedTheme = localStorage.getItem("mentalist_theme");
    if (savedTheme === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    setAudioEnabled(sound.isEnabled());

    // Keyboard shortcut for search (Cmd+K or Ctrl+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        sound.click();
      }
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  const toggleTheme = () => {
    sound.click();
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("mentalist_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("mentalist_theme", "light");
    }
  };

  const toggleAudio = () => {
    const next = sound.toggle();
    setAudioEnabled(next);
  };

  // Map path to active navigation ID
  const getActiveId = () => {
    if (!pathname || pathname === "/") return "dashboard";
    if (pathname.startsWith("/episodes")) return "episodes";
    if (pathname.startsWith("/compare")) return "compare";
    if (pathname.startsWith("/characters")) return "characters";
    if (pathname.startsWith("/awards")) return "awards";
    if (pathname.startsWith("/about")) return "about";
    if (pathname.startsWith("/contact")) return "contact";
    return "dashboard";
  };

  const navItems: NavItem[] = [
    {
      id: "dashboard",
      label: "Series Dossier",
      icon: LayoutDashboard,
      onClick: () => {
        sound.tab();
        router.push("/");
      },
    },
    {
      id: "episodes",
      label: "Episodes Explorer",
      icon: Tv,
      badge: "151",
      onClick: () => {
        sound.tab();
        router.push("/episodes");
      },
    },
    {
      id: "compare",
      label: "Compare Episodes",
      icon: GitCompare,
      onClick: () => {
        sound.tab();
        router.push("/compare");
      },
    },
    {
      id: "characters",
      label: "CBI Dossiers & Suspects",
      icon: Users,
      badge: "14",
      onClick: () => {
        sound.tab();
        router.push("/characters");
      },
    },
    {
      id: "awards",
      label: "Honors & Nominations",
      icon: Trophy,
      badge: "12",
      onClick: () => {
        sound.tab();
        router.push("/awards");
      },
    },
    {
      id: "about",
      label: "Architecture & DBML",
      icon: Database,
      onClick: () => {
        sound.tab();
        router.push("/about");
      },
    },
    {
      id: "contact",
      label: "CBI Field Contact",
      icon: Shield,
      onClick: () => {
        sound.tab();
        router.push("/contact");
      },
    },
  ];

  // Filter search results
  const filteredEpisodes = searchQuery.trim()
    ? EPISODES.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.written_by.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const filteredCharacters = searchQuery.trim()
    ? CHARACTERS.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.bio.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <div className="min-h-screen bg-[#F9F8F6] dark:bg-[#0A0C10] text-neutral-900 dark:text-neutral-100 flex flex-col md:flex-row transition-colors duration-200">
      {/* Responsive Sidebar */}
      <ResponsiveSidebar
        brandTitle="The Mentalist"
        brandSubtitle="CBI Analytical Portal"
        bgImageUrl="/static/images/mentalist_banner.jpg"
        items={navItems}
        activeId={getActiveId()}
        brandLogo={
          <div className="w-9 h-9 rounded-lg bg-[#C8102E] flex items-center justify-center text-white font-bold shadow-sm ring-1 ring-white/20">
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {/* Red John Smile Motif Icon in pure SVG */}
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="9" cy="10" r="1.5" />
              <circle cx="15" cy="10" r="1.5" />
              <path
                d="M8 14.5 C9.5 17.5, 14.5 17.5, 16 14.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-[#0A0C10]/85 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 font-mono text-[11px]">
                <Database className="w-3 h-3 text-[#C8102E]" />
                Unity Catalog: main.tvshows
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="capitalize text-neutral-800 dark:text-neutral-200 font-semibold">
                {getActiveId()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Search Button */}
            <button
              type="button"
              onClick={() => {
                sound.click();
                setSearchOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-900/80 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 text-neutral-500 dark:text-neutral-400 text-xs transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search cases, suspects, episodes...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-[10px] font-mono text-neutral-600 dark:text-neutral-400">
                ⌘K
              </kbd>
            </button>

            {/* Audio Micro-Haptics Toggle */}
            <button
              type="button"
              onClick={toggleAudio}
              className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
              title={audioEnabled ? "Disable tactile micro-haptics audio" : "Enable tactile micro-haptics audio"}
              aria-label="Toggle interaction audio"
            >
              {audioEnabled ? (
                <Volume2 className="w-4 h-4 text-[#C8102E]" />
              ) : (
                <VolumeX className="w-4 h-4 text-neutral-400" />
              )}
            </button>

            {/* Dark / Light Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
              title={isDark ? "Switch to Light dossier theme" : "Switch to Obsidian dark theme"}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-600" />
              )}
            </button>
          </div>
        </header>

        {/* Child Pages Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>

        {/* Editorial Footer */}
        <footer className="border-t border-neutral-200/80 dark:border-neutral-800/80 py-6 px-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C8102E] animate-pulse" />
              <span>
                CBI Special Crimes Behavioral Analytics · Running on <strong>Databricks Apps</strong> with <strong>Unity Catalog</strong>
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>7 Seasons · 151 Episodes · CBS (2008–2015)</span>
              <span>·</span>
              <a
                href="https://www.imdb.com/title/tt1196946/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#C8102E] underline flex items-center gap-1"
              >
                IMDb tt1196946
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-white dark:bg-[#12161F] rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <Search className="w-4 h-4 text-neutral-400 shrink-0 mr-3" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search episode title, suspect, or writer..."
                className="w-full bg-transparent border-0 focus:outline-none text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {searchQuery.trim() === "" ? (
                <div className="p-6 text-center text-xs text-neutral-400">
                  Type to instantly search across all 151 episodes and 14 character files.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEpisodes.length > 0 && (
                    <div>
                      <div className="px-2 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                        Episodes
                      </div>
                      {filteredEpisodes.map((ep) => (
                        <div
                          key={ep.episode_id}
                          onClick={() => {
                            sound.click();
                            setSearchOpen(false);
                            router.push(`/episodes?season=${ep.season_no}#${ep.episode_id}`);
                          }}
                          className="px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/70 cursor-pointer flex items-center justify-between transition-colors"
                        >
                          <div>
                            <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                              {ep.title}
                            </div>
                            <div className="text-xs text-neutral-500">
                              Season {ep.season_no}, Ep {ep.episode_no} · {ep.air_date}
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-[#C8102E]">
                            ★ {ep.imdb_rating}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {filteredCharacters.length > 0 && (
                    <div>
                      <div className="px-2 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                        Characters & Suspects
                      </div>
                      {filteredCharacters.map((char) => (
                        <div
                          key={char.character_id}
                          onClick={() => {
                            sound.click();
                            setSearchOpen(false);
                            router.push(`/characters#${char.character_id}`);
                          }}
                          className="px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/70 cursor-pointer flex items-center gap-3 transition-colors"
                        >
                          <img
                            src={char.image_url}
                            alt={char.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                              {char.name}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {char.actor} · {char.generation}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {filteredEpisodes.length === 0 && filteredCharacters.length === 0 && (
                    <div className="p-6 text-center text-xs text-neutral-400">
                      No case matches found for "{searchQuery}".
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
