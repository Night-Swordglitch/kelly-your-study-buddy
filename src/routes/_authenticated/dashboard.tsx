import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarPlus,
  Check,
  Clock3,
  Sparkles,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppShell } from "@/components/kelly/app-shell";
import { KellyAvatar } from "@/components/kelly/kelly-avatar";
import {
  loadWorkspace,
  currentUser,
  type Deadline,
  type Memory,
  type Profile,
  type Task,
} from "@/lib/kelly-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Kelly" },
      {
        name: "description",
        content:
          "See upcoming deadlines and continue guided study sessions with Kelly.",
      },
      {
        property: "og:title",
        content: "Dashboard — Kelly",
      },
      {
        property: "og:description",
        content:
          "Your calm study dashboard for deadlines, memories, and guided work.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [data, setData] = useState<{
    profile: Profile;
    deadlines: Deadline[];
    memories: Memory[];
    tasks: Task[];
  } | null>(null);

  const [showAdd, setShowAdd] = useState(false);

  const refresh = () => {
    loadWorkspace()
      .then(setData)
      .catch(console.error);
  };

  useEffect(() => {
    refresh();
  }, []);

  async function addDeadline(form: FormData) {
    const user = await currentUser();

    const due = String(form.get("due"));

    await supabase.from("deadlines").insert({
      user_id: user.id,
      title: String(form.get("title")),
      subject: String(form.get("subject") || "General"),
      due_at: new Date(due).toISOString(),
    });

    setShowAdd(false);
    refresh();
  }

  async function toggle(item: Deadline) {
    await supabase
      .from("deadlines")
      .update({
        completed: !item.completed,
      })
      .eq("id", item.id);

    refresh();
  }

  const upcoming =
    data?.deadlines.filter((deadline) => !deadline.completed) ?? [];

  const urgent = upcoming.some(
    (deadline) =>
      new Date(deadline.due_at).getTime() - Date.now() < 86400000,
  );

  const currentTask = data?.tasks[0];

  const progress = Math.max(
    0,
    Math.min(100, currentTask?.progress ?? 0),
  );

  const firstName =
    data?.profile.display_name?.split(" ")[0] ||
    data?.profile.display_name ||
    "there";

  return (
    <AppShell mood={urgent ? "concerned" : "idle"}>
      <div className="kelly-medo-dashboard">
        <div className="kelly-medo-ambient" />

        {/* ─────────────────────────────────────────────
            WELCOME
        ───────────────────────────────────────────── */}

        <section className="kelly-medo-welcome">
          <div className="kelly-medo-avatar">
            <KellyAvatar
              mood={urgent ? "concerned" : "happy"}
              size="sm"
            />
          </div>

          <p className="kelly-medo-eyebrow">
            YOUR STUDY COMPANION
          </p>

          <h1>
            Good morning,{" "}
            <span>{firstName}</span>
          </h1>

          <p className="kelly-medo-subtitle">
            {upcoming.length
              ? `You have ${upcoming.length} thing${
                  upcoming.length === 1 ? "" : "s"
                } coming up. Let's take them one step at a time.`
              : "Your desk is clear. What would you like to work on?"}
          </p>
        </section>

        {/* ─────────────────────────────────────────────
            MAIN CARDS
        ───────────────────────────────────────────── */}

        <section className="kelly-medo-primary-grid">
          {/* CURRENT STUDY CARD */}

          <article className="kelly-medo-card kelly-medo-study-card">
            <div className="kelly-medo-card-top">
              <div>
                <span className="kelly-medo-label">
                  CURRENT STUDY
                </span>

                <h2>
                  {currentTask?.title ||
                    "Choose your first study goal"}
                </h2>
              </div>

              <div className="kelly-medo-icon blue">
                <BookOpen />
              </div>
            </div>

            <p className="kelly-medo-card-description">
              {currentTask?.current_step ||
                "Tell Kelly what you need to finish and she'll guide you from there."}
            </p>

            <div className="kelly-medo-progress-header">
              <span>
                {currentTask?.subject || "Getting started"}
              </span>

              <strong>{progress}%</strong>
            </div>

            <div className="kelly-medo-progress">
              <div
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <div className="kelly-medo-study-footer">
              <span>
                {progress === 0
                  ? "Ready when you are"
                  : progress >= 100
                    ? "Completed"
                    : "Keep going"}
              </span>

              <Button asChild className="kelly-medo-blue-button">
                <Link to="/study">
                  Continue
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </article>

          {/* PROGRESS CARD */}

          <article className="kelly-medo-card kelly-medo-progress-card">
            <div className="kelly-medo-card-top">
              <div>
                <span className="kelly-medo-label">
                  YOUR PROGRESS
                </span>

                <h2>
                  {progress}%
                </h2>
              </div>

              <div className="kelly-medo-icon pink">
                <Target />
              </div>
            </div>

            <div className="kelly-medo-big-progress">
              <div
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <div className="kelly-medo-stat-row">
              <div>
                <strong>
                  {data?.tasks.length ?? 0}
                </strong>

                <span>study threads</span>
              </div>

              <div>
                <strong>
                  {data?.memories.length ?? 0}
                </strong>

                <span>memories</span>
              </div>
            </div>

            <div className="kelly-medo-small-message">
              <Sparkles />
              Kelly uses your progress to keep sessions focused.
            </div>
          </article>
        </section>

        {/* ─────────────────────────────────────────────
            UPCOMING
        ───────────────────────────────────────────── */}

        <section className="kelly-medo-card kelly-medo-upcoming-card">
          <div className="kelly-medo-section-heading">
            <div>
              <span className="kelly-medo-label">
                YOUR SCHEDULE
              </span>

              <h2>Upcoming</h2>
            </div>

            <Button
              variant="outline"
              className="kelly-medo-add-button"
              onClick={() => setShowAdd(!showAdd)}
            >
              <CalendarPlus />
              Add deadline
            </Button>
          </div>

          {showAdd && (
            <form
              action={addDeadline}
              className="kelly-medo-deadline-form"
            >
              <Input
                name="title"
                placeholder="Assignment or exam"
                required
              />

              <Input
                name="subject"
                placeholder="Subject"
              />

              <Input
                name="due"
                type="datetime-local"
                required
              />

              <Button type="submit">
                Save deadline
              </Button>
            </form>
          )}

          <div className="kelly-medo-deadline-list">
            {upcoming.slice(0, 5).map((deadline) => (
              <button
                key={deadline.id}
                onClick={() => toggle(deadline)}
                className="kelly-medo-deadline"
              >
                <span className="kelly-medo-deadline-icon">
                  <Clock3 />
                </span>

                <span className="kelly-medo-deadline-info">
                  <strong>{deadline.title}</strong>

                  <span>
                    {deadline.subject} ·{" "}
                    {new Date(
                      deadline.due_at,
                    ).toLocaleString([], {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </span>

                <span className="kelly-medo-check">
                  <Check />
                </span>
              </button>
            ))}

            {!upcoming.length && (
              <div className="kelly-medo-empty">
                <div className="kelly-medo-empty-icon">
                  <Check />
                </div>

                <strong>No upcoming deadlines</strong>

                <span>
                  Nice. Your schedule is clear for now.
                </span>
              </div>
            )}
          </div>
        </section>

        {/* ─────────────────────────────────────────────
            QUICK ACTIONS
        ───────────────────────────────────────────── */}

        <section className="kelly-medo-quick-grid">
          <Link
            to="/dashboard"
            className="kelly-medo-quick-card blue-card"
          >
            <div className="kelly-medo-quick-icon">
              <BookOpen />
            </div>

            <div>
              <strong>Start studying</strong>
              <span>
                Begin a guided session with Kelly.
              </span>
            </div>

            <ArrowRight />
          </Link>

          <div className="kelly-medo-quick-card pink-card">
            <div className="kelly-medo-quick-icon">
              <Sparkles />
            </div>

            <div>
              <strong>Kelly remembers</strong>
              <span>
                {data?.memories.length ?? 0} details are currently
                shaping your sessions.
              </span>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}