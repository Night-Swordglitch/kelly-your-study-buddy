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
} from "lucide-react";
import { useKellyXP } from "@/components/kelly/app-shell";

type SidebarItem = {
  id: string;
  label: string;
  icon: typeof Home;
  to?: string;
};

const ITEMS: SidebarItem[] = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    to: "/dashboard",
  },
  {
    id: "notes",
    label: "Notes",
    icon: BookOpen,
    to: "/notes",
  },
  {
    id: "listen",
    label: "Listen & Transcribe",
    icon: Mic,
    to: "/listen",
  },
  {
    id: "quizzes",
    label: "Quizzes",
    icon: Brain,
  },
  {
    id: "games",
    label: "Games",
    icon: Gamepad2,
  },
  {
    id: "friends",
    label: "Friends",
    icon: Users,
  },
  {
    id: "timer",
    label: "Timer",
    icon: Clock3,
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: CalendarDays,
    to: "/calendar",
  },
];

function getActivePage(pathname: string): string {
  if (pathname === "/dashboard" || pathname === "/") return "home";
  if (pathname.startsWith("/notes")) return "notes";
  if (pathname.startsWith("/listen")) return "listen";
  if (pathname.startsWith("/study")) return "study";
  if (pathname.startsWith("/quizzes")) return "quizzes";
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

  const activePage = getActivePage(location.pathname);

  const goTo = (item: SidebarItem) => {
    if (!item.to) return;

    navigate({
      to: item.to,
    });
  };

  return (
    <aside className="kelly-sidebar">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="kelly-sidebar-header">
        <button
          type="button"
          className="kelly-sidebar-logo"
          onClick={() => navigate({ to: "/dashboard" })}
          aria-label="Go to KELLY Home"
        >
          <span className="kelly-sidebar-avatar">
            <img
              src="/KELLY/kelly-sidebar.png"
              alt="KELLY"
            />
          </span>

          <span className="kelly-sidebar-word">KELLY</span>
        </button>
      </div>

      {/* ── XP ─────────────────────────────────────────────────── */}
      <div className="kelly-sidebar-level">
        <div className="kelly-sidebar-level-row">
          <span className="kelly-sidebar-level-name">
            Lv 3
          </span>

          <span className="kelly-sidebar-level-xp">
            {xp} XP
          </span>
        </div>

        <div className="kelly-sidebar-xp-track">
          <div className="kelly-sidebar-xp-fill" />
        </div>
      </div>

      {/* ── Main navigation ───────────────────────────────────── */}
      <nav
        className="kelly-sidebar-nav"
        aria-label="KELLY navigation"
      >
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

      {/* ── Bottom / Settings ─────────────────────────────────── */}
      <div className="kelly-sidebar-bottom">
        <button
          type="button"
          className={`kelly-sidebar-link${
            activePage === "settings" ? " active" : ""
          }`}
          disabled
          aria-current={
            activePage === "settings" ? "page" : undefined
          }
        >
          <Settings
            className="kelly-sidebar-icon"
            size={16}
            strokeWidth={2}
          />

          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
