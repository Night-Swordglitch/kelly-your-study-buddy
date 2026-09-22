import { useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  Clock3,
  Gamepad2,
  Brain,
  Home,
  Mic,
  Users,
  BookOpen,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useKellyXP } from "@/components/kelly/app-shell";

type SidebarItem = {
  id: string;
  label: string;
  icon: typeof Home;
  to?: string;
};

const ITEMS: SidebarItem[] = [
  { id: "home", label: "Home", icon: Home, to: "/dashboard" },
  { id: "notes", label: "Notes", icon: BookOpen, to: "/notes" },
  { id: "listen", label: "Listen & Transcribe", icon: Mic, to: "/listen" },
  { id: "quizzes", label: "Quizzes", icon: Brain, to: "/quizzes" },
  { id: "games", label: "Games", icon: Gamepad2, to: "/games" },
  { id: "friends", label: "Friends", icon: Users, to: "/friends" },
  { id: "timer", label: "Timer", icon: Clock3, to: "/timer" },
  { id: "calendar", label: "Calendar", icon: CalendarDays, to: "/calendar" },
];

function getActivePage(pathname: string): string {
  if (pathname === "/dashboard" || pathname === "/") return "home";
  if (pathname.startsWith("/notes")) return "notes";
  if (pathname.startsWith("/listen")) return "listen";
  if (pathname.startsWith("/study")) return "study";
  if (pathname.startsWith("/quizzes")) return "quizzes";
  if (
    pathname.startsWith("/games") ||
    pathname.startsWith("/memory-match") ||
    pathname.startsWith("/quick-quiz")
  ) return "games";
  if (pathname.startsWith("/calendar")) return "calendar";
  if (pathname.startsWith("/friends")) return "friends";
  if (pathname.startsWith("/timer")) return "timer";
  if (pathname.startsWith("/settings")) return "settings";
  return "home";
}

export function KellySidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { xp } = useKellyXP();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
const activePage = getActivePage(location.pathname);

  const goTo = (item: SidebarItem) => {
    if (!item.to) return;avigate({ to: item.to });
  };

  return (
    <>
<aside className={`kelly-sidebar ${collapsed ? "collapsed" : "expanded"}`}>
        <div className="kelly-sidebar-header">
          <button
            type="button"
            className="kelly-sidebar-logo"
            onClick={() => navigate({ to: "/dashboard" })}
            aria-label="Go to KELLY Home"
          >
            <span className="kelly-sidebar-avatar">
              <img src="/KELLY/kelly-sidebar.png" alt="KELLY" />
            </span>
            <span className="kelly-sidebar-word">KELLY</span>
          </button>
        </div><button        type="button"n        className="kelly-sidebar-menu-button"n        onClick={() => setCollapsed((current) => !current)}n        aria-label="Toggle sidebar"n      ><Menu          className="kelly-sidebar-icon"n          size={16}n          strokeWidth={2}n        /></button><div className="kelly-sidebar-level">
          <div className="kelly-sidebar-level-row">
            <span className="kelly-sidebar-level-name">Lv 3</span>
            <span className="kelly-sidebar-level-xp">{xp} XP</span>
          </div>

          <div className="kelly-sidebar-xp-track">
            <div className="kelly-sidebar-xp-fill" />
          </div>
        </div>

        <nav className="kelly-sidebar-nav" aria-label="KELLY navigation">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={`kelly-sidebar-link${active ? " active" : ""}`}
                onClick={() => goTo(item)}
                disabled={!item.to}
                aria-current={active ? "page" : undefined}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className="kelly-sidebar-icon"
                  size={16}
                  strokeWidth={2}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="kelly-sidebar-bottom">
          <div className="kelly-settings-wrapper">
            <button
              type="button"
              className="kelly-sidebar-link kelly-settings-trigger"
              onMouseEnter={() => setSettingsOpen(true)}
              onMouseLeave={() => {
                window.setTimeout(() => {
                  const hovered = document.querySelector(
                    ".kelly-settings-popup:hover"
                  );

                  if (!hovered) setSettingsOpen(false);
                }, 40);
              }}
              title={collapsed ? "Settings" : undefined}
            >
              <Settings
                className="kelly-sidebar-icon"
                size={16}
                strokeWidth={2}
              />
              <span>Settings</span>
            </button>

            {settingsOpen && (
              <div
                className="kelly-settings-popup"
                onMouseEnter={() => setSettingsOpen(true)}
                onMouseLeave={() => setSettingsOpen(false)}
              >
                <button
                  type="button"
                  className="kelly-settings-logout"
                  onClick={async () => {
                    await window.KellyAuth?.logout();
                    window.location.href = "/";
                  }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}








