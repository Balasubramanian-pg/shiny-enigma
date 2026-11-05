"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  User,
  FolderKanban,
  MessageSquare,
  BarChart3,
  ShoppingCart,
  TrendingUp,
  Settings,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  badge?: string | number;
  onClick?: () => void;
}

export interface ResponsiveSidebarProps {
  className?: string;
  brandTitle?: string;
  brandSubtitle?: string;
  brandLogo?: React.ReactNode;
  bgImageUrl?: string;
  items?: NavItem[];
  defaultCollapsed?: boolean;
  activeId?: string;
  onItemSelect?: (item: NavItem) => void;
  onToggleCollapse?: (collapsed: boolean) => void;
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "User Profiles", icon: User },
  { id: "files", label: "File Management", icon: FolderKanban, badge: 12 },
  { id: "messages", label: "Messaging", icon: MessageSquare, badge: 3 },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "income", label: "Income & Revenue", icon: TrendingUp },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "admin", label: "Admin Login", icon: ShieldAlert },
];

export const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = ({
  className,
  brandTitle = "The Mentalist",
  brandSubtitle = "CBI Analytical Portal",
  brandLogo,
  bgImageUrl = "/static/images/mentalist_banner.jpg",
  items = DEFAULT_NAV_ITEMS,
  defaultCollapsed = false,
  activeId: initialActiveId = "dashboard",
  onItemSelect,
  onToggleCollapse,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [activeItem, setActiveItem] = useState(initialActiveId);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Keyboard accessibility: Escape closes mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen]);

  const handleToggle = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    onToggleCollapse?.(nextState);
  };

  const handleItemClick = (item: NavItem) => {
    setActiveItem(item.id);
    onItemSelect?.(item);
    item.onClick?.();
    if (isMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Trigger */}
      <button
        type="button"
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-md text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-600"
        aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMobileOpen}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        ref={sidebarRef}
        aria-label="Sidebar Navigation"
        className={cn(
          "relative flex flex-col h-screen transition-all duration-300 ease-in-out z-40",
          "border-r border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden",
          // Width transitions
          isCollapsed ? "w-20" : "w-64",
          // Mobile responsive positioning
          "fixed md:sticky top-0 left-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className
        )}
      >
        {/* Background Visual Backdrop with semi-transparent overlay */}
        {bgImageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center -z-10 opacity-15 dark:opacity-20"
            style={{ backgroundImage: `url(${bgImageUrl})` }}
            aria-hidden="true"
          />
        )}
        <div
          className="absolute inset-0 bg-white/85 dark:bg-neutral-950/90 backdrop-blur-md -z-10"
          aria-hidden="true"
        />

        {/* Brand Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-neutral-200/60 dark:border-neutral-800/60">
          <div className="flex items-center gap-3 overflow-hidden">
            {brandLogo ? (
              <div className="shrink-0">{brandLogo}</div>
            ) : (
              <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                M
              </div>
            )}
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm tracking-tight truncate">
                  {brandTitle}
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium truncate">
                  {brandSubtitle}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Toggle Button */}
          <button
            type="button"
            onClick={handleToggle}
            className="hidden md:flex p-1.5 rounded-md hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                  "focus:outline-none focus:ring-2 focus:ring-red-600",
                  isActive
                    ? "bg-red-600/10 text-red-600 dark:bg-red-600/20 dark:text-red-400 font-semibold"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-100"
                )}
                role="menuitem"
                aria-current={isActive ? "page" : undefined}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-colors",
                    isActive
                      ? "text-red-600 dark:text-red-400"
                      : "text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200"
                  )}
                />
                {!isCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!isCollapsed && item.badge !== undefined && (
                  <span
                    className={cn(
                      "px-2 py-0.5 text-xs font-semibold rounded-full",
                      isActive
                        ? "bg-red-600 text-white"
                        : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info / system credit */}
        <div className="p-3 border-t border-neutral-200/60 dark:border-neutral-800/60 text-center">
          {!isCollapsed ? (
            <div className="text-[11px] text-neutral-400 dark:text-neutral-500">
              © 2026 Databricks Apps · Unity Catalog
            </div>
          ) : (
            <div className="text-[10px] text-neutral-400 font-mono">v1.0</div>
          )}
        </div>
      </aside>
    </>
  );
};

export default ResponsiveSidebar;
