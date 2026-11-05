"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  description?: string;
  tag?: string;
  rating?: number | string;
}

export interface ExpandableGalleryProps {
  className?: string;
  items?: GalleryItem[];
  defaultExpandedIndex?: number;
  onItemExpand?: (item: GalleryItem, index: number) => void;
  accentColor?: string;
}

const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "jane",
    title: "Patrick Jane",
    subtitle: "Lead CBI Consultant",
    imageUrl: "/static/images/characters/patrick_jane.jpg",
    description: "Former fraudulent psychic armed with razor-sharp observational instincts and an obsession with Red John.",
    tag: "Consultant",
    rating: "9.5",
  },
  {
    id: "lisbon",
    title: "Teresa Lisbon",
    subtitle: "Senior Special Agent",
    imageUrl: "/static/images/characters/teresa_lisbon.jpg",
    description: "Tough, principled leader of the CBI Serious Crimes Unit and Jane's enduring moral compass.",
    tag: "Special Agent",
    rating: "9.3",
  },
  {
    id: "cho",
    title: "Kimball Cho",
    subtitle: "Senior Tactical Interrogator",
    imageUrl: "/static/images/characters/kimball_cho.jpg",
    description: "The unflappable 'Iceman' whose deadpan pragmatism cracks the most fortified suspects.",
    tag: "Interrogator",
    rating: "9.4",
  },
  {
    id: "rigsby",
    title: "Wayne Rigsby",
    subtitle: "Arson Specialist & Investigator",
    imageUrl: "/static/images/characters/wayne_rigsby.jpg",
    description: "Field enforcer and forensics expert devoted to Lisbon's team and Grace Van Pelt.",
    tag: "Arson Expert",
    rating: "9.0",
  },
  {
    id: "vanpelt",
    title: "Grace Van Pelt",
    subtitle: "Digital Forensics & Databases",
    imageUrl: "/static/images/characters/grace_van_pelt.jpg",
    description: "Technical researcher whose optimism and faith frequently tested Jane's analytical cynicism.",
    tag: "Tech Specialist",
    rating: "9.1",
  },
  {
    id: "redjohn",
    title: "Red John",
    subtitle: "Thomas McAllister / Blake Leader",
    imageUrl: "/static/images/characters/red_john.jpg",
    description: "The shadow mastermind behind the Blake Association cabal ('Tyger, Tyger').",
    tag: "Nemesis",
    rating: "9.8",
  },
];

export const ExpandableGallery: React.FC<ExpandableGalleryProps> = ({
  className,
  items = DEFAULT_GALLERY_ITEMS,
  defaultExpandedIndex = 0,
  onItemExpand,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(defaultExpandedIndex);
  const [modalItem, setModalItem] = useState<GalleryItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectIndex(index);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (index + 1) % items.length;
      selectIndex(next);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (index - 1 + items.length) % items.length;
      selectIndex(prev);
    } else if (e.key === "Escape" && modalItem) {
      setModalItem(null);
    }
  };

  const selectIndex = (index: number) => {
    setActiveIndex(index);
    if (items[index]) {
      onItemExpand?.(items[index], index);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("w-full space-y-4", className)}
      role="region"
      aria-label="Character photo gallery"
    >
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-ink">
            Character dossier showcase
          </h3>
          <p className="text-xs text-muted">
            Select any portrait card to expand storyline notes
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => selectIndex((activeIndex - 1 + items.length) % items.length)}
            aria-label="Previous gallery slide"
            className="p-2 rounded-md border border-rule bg-paper-2 hover:bg-paper-3 text-ink transition-colors focus-visible:outline-2 focus-visible:outline-focus"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => selectIndex((activeIndex + 1) % items.length)}
            aria-label="Next gallery slide"
            className="p-2 rounded-md border border-rule bg-paper-2 hover:bg-paper-3 text-ink transition-colors focus-visible:outline-2 focus-visible:outline-focus"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Accordion / Expandable Gallery Flex Container */}
      <div className="flex flex-col lg:flex-row gap-3 h-[450px] w-full select-none">
        {items.map((item, idx) => {
          const isExpanded = activeIndex === idx;
          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              aria-label={`${item.title}, ${item.subtitle}`}
              onClick={() => selectIndex(idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={cn(
                "relative rounded-xl overflow-hidden cursor-pointer transition-[flex,opacity] duration-300 ease-out motion-reduce:transition-none",
                "border border-rule",
                "focus-visible:outline-2 focus-visible:outline-focus",
                isExpanded
                  ? "flex-[3.5] lg:flex-[3.5] ring-2 ring-accent/40"
                  : "flex-1 lg:flex-1 opacity-85 hover:opacity-100"
              )}
            >
              {/* Image Background */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />

              {/* Scrim Overlay */}
              <div
                className={cn(
                  "absolute inset-0 transition-opacity duration-200",
                  isExpanded
                    ? "bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                    : "bg-gradient-to-t from-black/80 via-black/20 to-black/20"
                )}
              />

              {/* Tag / Badge */}
              {item.tag && (
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className={cn(
                      "px-2.5 py-1 text-xs font-medium rounded-md border border-rule",
                      item.tag === "Nemesis"
                        ? "bg-accent text-accent-ink"
                        : "bg-paper-2 text-ink"
                    )}
                  >
                    {item.tag}
                  </span>
                </div>
              )}

              {/* Modal Zoom Button */}
              {isExpanded && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalItem(item);
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-md bg-paper-2 border border-rule text-ink hover:bg-accent hover:text-accent-ink transition-colors focus-visible:outline-2 focus-visible:outline-focus"
                  aria-label={`View portrait of ${item.title}`}
                >
                  <Maximize2 className="w-4 h-4" aria-hidden="true" />
                </button>
              )}

              {/* Text Card Content */}
              <div className="absolute bottom-0 inset-x-0 p-5 text-white flex flex-col justify-end">
                {isExpanded ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-semibold text-white">
                        {item.title}
                      </h4>
                      {item.rating && (
                        <div className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-accent text-accent-ink">
                          <Star className="w-3 h-3 fill-current" aria-hidden="true" />
                          <span>{item.rating}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-normal text-neutral-300">
                      {item.subtitle}
                    </p>
                    {item.description && (
                      <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="writing-mode-horizontal lg:writing-mode-vertical-rl lg:rotate-180 transform">
                    <h4 className="text-sm font-medium text-white truncate">
                      {item.title}
                    </h4>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Modal Lightbox */}
      {modalItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={modalItem.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => setModalItem(null)}
        >
          <div
            className="relative max-w-lg w-full bg-paper-2 rounded-xl overflow-hidden border border-rule"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalItem(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-md bg-paper-3 text-ink hover:bg-accent hover:text-accent-ink transition-colors focus-visible:outline-2 focus-visible:outline-focus"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>

            <img
              src={modalItem.imageUrl}
              alt={modalItem.title}
              className="w-full h-80 object-cover object-top"
            />

            <div className="p-6 space-y-2">
              <span className="text-xs font-medium text-muted">
                {modalItem.tag || "Character profile"}
              </span>
              <h3 className="text-2xl font-semibold text-ink">
                {modalItem.title}
              </h3>
              <p className="text-sm font-normal text-muted">
                {modalItem.subtitle}
              </p>
              <p className="text-sm text-ink leading-relaxed pt-2">
                {modalItem.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandableGallery;
