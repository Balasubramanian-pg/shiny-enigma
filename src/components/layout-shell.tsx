"use client";

import React, { useState, useEffect } from "react";
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
  X,
  ExternalLink,
  ChevronRight,
  Star,
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
    const savedTheme = localStorage.getItem("mentalist_theme");
    if (savedTheme === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    setAudioEnabled(sound.isEnabled());

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
      label: "Series dossier",
      icon: LayoutDashboard,
      onClick: () => {
        sound.tab();
        router.push("/");
      },
    },
    {
      id: "episodes",
      label: "Episodes explorer",
      icon: Tv,
      badge: "151",
      onClick: () => {
        sound.tab();
        router.push("/episodes");
      },
    },
    {
      id: "compare",
      label: "Compare episodes",
      icon: GitCompare,
      onClick: () => {
        sound.tab();
        router.push("/compare");
      },
    },
    {
      id: "characters",
      label: "CBI dossiers and suspects",
      icon: Users,
      badge: "14",
      onClick: () => {
        sound.tab();
        router.push("/characters");
      },
    },
    {
      id: "awards",
      label: "Honors and nominations",
      icon: Trophy,
      badge: "12",
      onClick: () => {
        sound.tab();
        router.push("/awards");
      },
    },
    {
      id: "about",
      label: "Architecture and DBML",
      icon: Database,
      onClick: () => {
        sound.tab();
        router.push("/about");
      },
    },
    {
      id: "contact",
      label: "CBI field dispatch",
      icon: Shield,
      onClick: () => {
        sound.tab();
        router.push("/contact");
      },
    },
  ];

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
    <div className="min-h-screen bg-paper text-ink flex flex-col md:flex-row transition-colors duration-200">
      {/* Responsive Sidebar */}
      <ResponsiveSidebar
        brandTitle="The Mentalist"
        brandSubtitle="CBI Analytical Portal"
        bgImageUrl="/static/images/mentalist_banner.jpg"
        items={navItems}
        activeId={getActiveId()}
        brandLogo={
          <div className="w-9 h-9 rounded-md bg-accent flex items-center justify-center text-accent-ink font-semibold">
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
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
        <header className="sticky top-0 z-30 h-16 border-b border-rule bg-paper-2 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-normal text-muted">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-paper-3 text-ink border border-rule text-xs">
                <Database className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                <span>Unity Catalog: main.tvshows</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-muted" aria-hidden="true" />
              <span className="capitalize text-ink font-medium">
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
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-rule bg-paper-3 hover:bg-paper text-muted text-xs transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-focus"
            >
              <Search className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Search cases</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-paper-2 border border-rule text-[11px] text-muted">
                ⌘K
              </kbd>
            </button>

            {/* Audio Micro-Haptics Toggle */}
            <button
              type="button"
              onClick={toggleAudio}
              className="p-2 rounded-md border border-rule bg-paper-3 hover:bg-paper text-ink transition-colors focus-visible:outline-2 focus-visible:outline-focus"
              title={audioEnabled ? "Disable tactile micro-haptics audio" : "Enable tactile micro-haptics audio"}
              aria-label="Toggle interaction audio"
            >
              {audioEnabled ? (
                <Volume2 className="w-4 h-4 text-accent" aria-hidden="true" />
              ) : (
                <VolumeX className="w-4 h-4 text-muted" aria-hidden="true" />
              )}
            </button>

            {/* Dark / Light Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-md border border-rule bg-paper-3 hover:bg-paper text-ink transition-colors focus-visible:outline-2 focus-visible:outline-focus"
              title={isDark ? "Switch to light theme" : "Switch to dark theme"}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-muted" aria-hidden="true" />
              )}
            </button>
          </div>
        </header>

        {/* Child Pages Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>

        {/* Editorial Footer */}
        <footer className="border-t border-rule py-6 px-6 text-xs text-muted">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
              <span>
                CBI Serious Crimes Analytical Portal on Databricks Apps with Unity Catalog
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span>7 seasons</span>
              <span className="text-muted">/</span>
              <span>151 episodes</span>
              <span className="text-muted">/</span>
              <span>CBS 2008 to 2015</span>
              <span className="text-muted">/</span>
              <a
                href="https://www.imdb.com/title/tt1196946/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent underline flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-focus"
              >
                <span>IMDb tt1196946</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-paper-2 rounded-xl border border-rule overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center px-4 py-3 border-b border-rule">
              <Search className="w-4 h-4 text-muted shrink-0 mr-3" aria-hidden="true" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search episode title, suspect, or writer…"
                className="w-full bg-transparent border-0 focus:outline-none text-sm text-ink placeholder-muted"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded hover:bg-paper-3 text-muted focus-visible:outline-2 focus-visible:outline-focus"
                aria-label="Close search dialog"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {searchQuery.trim() === "" ? (
                <div className="p-6 text-center text-xs text-muted">
                  Type to search across all 151 episodes and 14 character files.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEpisodes.length > 0 && (
                    <div>
                      <div className="px-2 py-1 text-xs font-medium text-muted">
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
                          className="px-3 py-2 rounded-md hover:bg-paper-3 cursor-pointer flex items-center justify-between transition-colors focus-visible:outline-2 focus-visible:outline-focus"
                        >
                          <div>
                            <div className="text-sm font-medium text-ink">
                              {ep.title}
                            </div>
                            <div className="text-xs text-muted">
                              Season {ep.season_no}, Episode {ep.episode_no} · {ep.air_date}
                            </div>
                          </div>
                          <span className="text-xs font-medium text-accent flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-current text-amber-500" aria-hidden="true" />
                            <span>{ep.imdb_rating}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {filteredCharacters.length > 0 && (
                    <div>
                      <div className="px-2 py-1 text-xs font-medium text-muted">
                        Characters and suspects
                      </div>
                      {filteredCharacters.map((char) => (
                        <div
                          key={char.character_id}
                          onClick={() => {
                            sound.click();
                            setSearchOpen(false);
                            router.push(`/characters#${char.character_id}`);
                          }}
                          className="px-3 py-2 rounded-md hover:bg-paper-3 cursor-pointer flex items-center gap-3 transition-colors focus-visible:outline-2 focus-visible:outline-focus"
                        >
                          <img
                            src={char.image_url}
                            alt={char.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-sm font-medium text-ink">
                              {char.name}
                            </div>
                            <div className="text-xs text-muted">
                              {char.actor} · {char.generation}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {filteredEpisodes.length === 0 && filteredCharacters.length === 0 && (
                    <div className="p-6 text-center text-xs text-muted">
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
