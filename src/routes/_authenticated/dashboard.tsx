import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  Clock3,
  Plus,
  Sparkles,
  Target,
} from "lucide-react";

import { AppShell } from "@/components/kelly/app-shell";
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
      { title: "Home — KELLY" },
      {
        name: "description",
        content:
          "Your KELLY study overview, progress, notes, deadlines, and study activity.",
      },
      {
        property: "og:title",
        content: "Home — KELLY",
      },
      {
        property: "og:description",
        content:
          "Your KELLY study overview, progress, notes, deadlines, and study activity.",
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

    const title = String(form.get("title") || "").trim();
    const subject = String(form.get("subject") || "General").trim();
    const due = String(form.get("due") || "");

    if (!title || !due) return;

    await supabase.from("deadlines").insert({
      user_id: user.id,
      title,
      subject: subject || "General",
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
    "You";

  /*
   * These values are currently the polished KELLY dashboard
   * presentation values. They remain intentionally separate
   * from the live Supabase workspace data so the migration does
   * not silently invent a new backend model.
   */
  const streakDays = 5;
  const todayMinutes = 47;
  const sessions = 2;
  const noteCount = 4;

  const totalXp = 1180;
  const weeklyXp = 380;
  const nextLevelXp = 320;

  return (
    <AppShell mood={urgent ? "concerned" : "idle"}>
      <div className="kelly-home-page">

        {/* =====================================================
            WELCOME
            ===================================================== */}

        <section className="kelly-home-welcome">
          <div>
            <h1>
              Welcome back, <span>{firstName}</span>
            </h1>

            <p>
              Here's your study overview
            </p>
          </div>
        </section>

        {/* =====================================================
            LEVEL
            ===================================================== */}

        <section className="kelly-home-card kelly-home-level-card">
          <div className="kelly-home-level-top">

            <div className="kelly-home-level-title">
              <div className="kelly-home-trophy">
                🏆
              </div>

              <div>
                <div className="kelly-home-level-number">
                  Level 3
                </div>
              </div>
            </div>

            <div className="kelly-home-level-next">
              <strong>{nextLevelXp} XP</strong>
              <span>to next level</span>
            </div>

          </div>

          <div className="kelly-home-xp-track">
            <div className="kelly-home-xp-fill" />
          </div>

          <div className="kelly-home-level-bottom">
            <span>
              <strong>{totalXp} XP</strong> total
            </span>

            <span>
              {weeklyXp} XP this week
            </span>
          </div>
        </section>

        {/* =====================================================
            STATS
            ===================================================== */}

        <section className="kelly-home-stat-row">

          <div className="kelly-home-card kelly-home-stat-card">
            <div className="kelly-home-stat-icon">
              ⚡
            </div>

            <div className="kelly-home-stat-name">
              Streak
            </div>

            <div className="kelly-home-stat-value">
              {streakDays} days
            </div>

            <div className="kelly-home-stat-label">
              Keep it up!
            </div>
          </div>

          <div className="kelly-home-card kelly-home-stat-card">
            <div className="kelly-home-stat-icon">
              ◷
            </div>

            <div className="kelly-home-stat-name">
              TODAY
            </div>

            <div className="kelly-home-stat-value">
              {todayMinutes}m
            </div>

            <div className="kelly-home-stat-label">
              Study time
            </div>
          </div>

          <div className="kelly-home-card kelly-home-stat-card">
            <div className="kelly-home-stat-icon">
              ⚡
            </div>

            <div className="kelly-home-stat-name">
              Sessions
            </div>

            <div className="kelly-home-stat-value">
              {sessions}
            </div>

            <div className="kelly-home-stat-label">
              Focus sessions
            </div>
          </div>

          <div className="kelly-home-card kelly-home-stat-card">
            <div className="kelly-home-stat-icon">
              ▤
            </div>

            <div className="kelly-home-stat-name">
              NOTES
            </div>

            <div className="kelly-home-stat-value">
              {noteCount}
            </div>

            <div className="kelly-home-stat-label">
              Created
            </div>
          </div>

        </section>

        {/* =====================================================
            RECENT NOTES / UPCOMING
            ===================================================== */}

        <section className="kelly-home-two-col">

          <article className="kelly-home-card kelly-home-content-card">

            <div className="kelly-home-card-head">
              <div className="kelly-home-section-label">
                RECENT NOTES
              </div>

              <Link
                to="/notes"
                className="kelly-home-link"
              >
                View all
              </Link>
            </div>

            <div className="kelly-home-note-list">

              <Link
                to="/notes"
                className="kelly-home-note-row"
              >
                <div>
                  <strong>Cell Division</strong>
                  <span>Biology · 2026-09-12</span>
                </div>

                <span className="kelly-home-arrow">
                  →
                </span>
              </Link>

              <Link
                to="/notes"
                className="kelly-home-note-row"
              >
                <div>
                  <strong>Quadratic Equations</strong>
                  <span>Mathematics · 2026-09-13</span>
                </div>

                <span className="kelly-home-arrow">
                  →
                </span>
              </Link>

              <Link
                to="/notes"
                className="kelly-home-note-row"
              >
                <div>
                  <strong>World War II — Causes</strong>
                  <span>History · 2026-09-14</span>
                </div>

                <span className="kelly-home-arrow">
                  →
                </span>
              </Link>

            </div>
          </article>

          <article className="kelly-home-card kelly-home-content-card">

            <div className="kelly-home-card-head">
              <div className="kelly-home-section-label">
                UPCOMING
              </div>

              <button
                type="button"
                className="kelly-home-link kelly-home-button-reset"
                onClick={() => setShowAdd(true)}
              >
                Calendar
              </button>
            </div>

            <div className="kelly-home-upcoming-list">

              {upcoming.length > 0 ? (
                upcoming.slice(0, 3).map((deadline, index) => (
                  <button
                    type="button"
                    key={deadline.id}
                    className="kelly-home-upcoming-row"
                    onClick={() => toggle(deadline)}
                    title="Mark this deadline complete"
                  >
                    <div
                      className={`kelly-home-upcoming-bar ${
                        index === 2 ? "red" : "green"
                      }`}
                    />

                    <div className="kelly-home-upcoming-copy">
                      <strong>{deadline.title}</strong>

                      <span>
                        {deadline.subject} ·{" "}
                        {new Date(
                          deadline.due_at,
                        ).toLocaleString([], {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <>
                  <div className="kelly-home-upcoming-row">
                    <div className="kelly-home-upcoming-bar green" />

                    <div className="kelly-home-upcoming-copy">
                      <strong>Group Study Session</strong>
                      <span>2026-09-15 · 18:00</span>
                    </div>
                  </div>

                  <div className="kelly-home-upcoming-row">
                    <div className="kelly-home-upcoming-bar green" />

                    <div className="kelly-home-upcoming-copy">
                      <strong>Biology Essay Due</strong>
                      <span>2026-09-16 · 23:59</span>
                    </div>
                  </div>

                  <div className="kelly-home-upcoming-row">
                    <div className="kelly-home-upcoming-bar red" />

                    <div className="kelly-home-upcoming-copy">
                      <strong>Mathematics Exam</strong>
                      <span>2026-09-18 · 09:00</span>
                    </div>
                  </div>
                </>
              )}

            </div>
          </article>

        </section>

        {/* =====================================================
            LAST QUIZ / FRIENDS
            ===================================================== */}

        <section className="kelly-home-two-col">

          <article className="kelly-home-card kelly-home-content-card">

            <div className="kelly-home-card-head">
              <div className="kelly-home-section-label">
                LAST QUIZ
              </div>

              <button
                type="button"
                className="kelly-home-link kelly-home-button-reset"
                disabled
              >
                View quiz
              </button>
            </div>

            <div className="kelly-home-quiz-name">
              Biology Basics
            </div>

            <div className="kelly-home-quiz-summary">

              <div>
                <strong className="kelly-home-score">
                  3/4
                </strong>

                <span>
                  SCORE
                </span>
              </div>

              <div>
                <strong className="kelly-home-quiz-xp">
                  +60
                </strong>

                <span>
                  XP EARNED
                </span>
              </div>

            </div>
          </article>

          <article className="kelly-home-card kelly-home-content-card">

            <div className="kelly-home-card-head">
              <div className="kelly-home-section-label">
                FRIENDS STUDYING
              </div>

              <button
                type="button"
                className="kelly-home-link kelly-home-button-reset"
                disabled
              >
                View friends
              </button>
            </div>

            <div className="kelly-home-friend-row">

              <div className="kelly-home-friend-avatar">
                S
              </div>

              <div>
                <strong>Sarah</strong>

                <span className="kelly-home-studying">
                  Studying Biology
                </span>
              </div>

            </div>
          </article>

        </section>

        {/* =====================================================
            QUICK ACTIONS
            ===================================================== */}

        <section className="kelly-home-quick-wrap">

          <div className="kelly-home-section-label">
            QUICK ACTIONS
          </div>

          <div className="kelly-home-quick-row">

            <Link
              to="/notes"
              className="kelly-home-quick-action"
            >
              <span className="kelly-home-quick-icon">
                ▤
              </span>

              <strong>
                New Note
              </strong>
            </Link>

            <button
              type="button"
              className="kelly-home-quick-action"
              disabled
            >
              <span className="kelly-home-quick-icon">
                🧠
              </span>

              <strong>
                Start Quiz
              </strong>
            </button>

            <button
              type="button"
              className="kelly-home-quick-action"
              disabled
            >
              <span className="kelly-home-quick-icon">
                ◷
              </span>

              <strong>
                Start Timer
              </strong>
            </button>

            <Link
              to="/study"
              className="kelly-home-quick-action"
            >
              <span className="kelly-home-quick-icon">
                🎙
              </span>

              <strong>
                Listen
              </strong>
            </Link>

          </div>

        </section>

        {/* =====================================================
            ADD DEADLINE
            ===================================================== */}

        {showAdd && (
          <div className="kelly-home-modal-backdrop">
            <div className="kelly-home-modal">

              <div className="kelly-home-modal-head">
                <div>
                  <span className="kelly-home-section-label">
                    YOUR SCHEDULE
                  </span>

                  <h2>
                    Add deadline
                  </h2>
                </div>

                <button
                  type="button"
                  className="kelly-home-modal-close"
                  onClick={() => setShowAdd(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <form
                action={addDeadline}
                className="kelly-home-deadline-form"
              >
                <label>
                  <span>Title</span>

                  <input
                    name="title"
                    placeholder="Assignment or exam"
                    required
                  />
                </label>

                <label>
                  <span>Subject</span>

                  <input
                    name="subject"
                    placeholder="Subject"
                  />
                </label>

                <label>
                  <span>Due date</span>

                  <input
                    name="due"
                    type="datetime-local"
                    required
                  />
                </label>

                <div className="kelly-home-modal-actions">
                  <button
                    type="button"
                    className="kelly-home-modal-cancel"
                    onClick={() => setShowAdd(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="kelly-home-modal-save"
                  >
                    <Plus />
                    Save deadline
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
