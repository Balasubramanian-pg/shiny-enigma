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
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-paper-2 border border-rule text-ink shadow-sm hover:border-accent/40 active:opacity-85 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
        aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMobileOpen}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="w-5 h-5" aria-hidden="true" />
        ) : (
          <Menu className="w-5 h-5" aria-hidden="true" />
        )}
      </button>

      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 md:hidden transition-opacity duration-200"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        ref={sidebarRef}
        aria-label="Sidebar Navigation"
        className={cn(
          "relative flex flex-col h-screen transition-transform duration-200 ease-in-out motion-reduce:transition-none z-40",
          "border-r border-rule bg-paper-2 overflow-hidden",
          isCollapsed ? "w-20" : "w-64",
          "fixed md:sticky top-0 left-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className
        )}
      >
        {/* Background Visual Backdrop with subtle opacity */}
        {bgImageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center -z-10 opacity-10"
            style={{ backgroundImage: `url(${bgImageUrl})` }}
            aria-hidden="true"
          />
        )}

        {/* Brand Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-rule">
          <div className="flex items-center gap-3 overflow-hidden">
            {brandLogo ? (
              <div className="shrink-0">{brandLogo}</div>
            ) : (
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-accent-ink font-bold shrink-0 shadow-sm">
                M
              </div>
            )}
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-semibold text-ink text-sm tracking-tight truncate">
                  {brandTitle}
                </span>
                <span className="text-xs text-muted font-normal truncate">
                  {brandSubtitle}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Toggle Button */}
          <button
            type="button"
            onClick={handleToggle}
            className="hidden md:flex p-1.5 rounded-md hover:bg-paper-3 active:opacity-85 disabled:opacity-40 text-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus transition-colors duration-150"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
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
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 motion-reduce:transition-none group",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus active:opacity-90 disabled:opacity-40",
                  isActive
                    ? "bg-accent/15 text-accent font-semibold border border-accent/30"
                    : "text-ink-2 hover:bg-paper-3 hover:text-ink border border-transparent"
                )}
                role="menuitem"
                aria-current={isActive ? "page" : undefined}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  aria-hidden="true"
                  className={cn(
                    "w-5 h-5 shrink-0 transition-colors duration-150",
                    isActive
                      ? "text-accent"
                      : "text-muted group-hover:text-ink"
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
                        ? "bg-accent text-accent-ink"
                        : "bg-paper-3 text-muted"
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
        <div className="p-3 border-t border-rule text-center">
          {!isCollapsed ? (
            <div className="text-xs text-muted">
              © 2026 Databricks Apps, Unity Catalog
            </div>
          ) : (
            <div className="text-xs text-muted">v1.0</div>
          )}
        </div>
      </aside>
    </>
  );
};

export default ResponsiveSidebar;
