import { useNavigate } from "@tanstack/react-router";
import { useKellyXP } from "@/components/kelly/app-shell";

const RECENT_NOTES = [
  {
    title: "Cell Division",
    meta: "Biology · 2026-09-12",
  },
  {
    title: "Quadratic Equations",
    meta: "Mathematics · 2026-09-13",
  },
  {
    title: "World War II — Causes",
    meta: "History · 2026-09-14",
  },
];

const UPCOMING = [
  {
    title: "Group Study Session",
    date: "2026-09-15 · 18:00",
    tone: "green",
  },
  {
    title: "Biology Essay Due",
    date: "2026-09-16 · 23:59",
    tone: "green",
  },
  {
    title: "Mathematics Exam",
    date: "2026-09-18 · 09:00",
    tone: "red",
  },
];

const STATS = [
  {
    icon: "⚡",
    name: "Streak",
    value: "5 days",
    label: "Keep it up!",
  },
  {
    icon: "◷",
    name: "TODAY",
    value: "47m",
    label: "Study time",
  },
  {
    icon: "⚡",
    name: "Sessions",
    value: "2",
    label: "Focus sessions",
  },
  {
    icon: "▤",
    name: "NOTES",
    value: "4",
    label: "Created",
  },
];

const QUICK_ACTIONS = [
  {
    icon: "▤",
    label: "New Note",
    to: "/study",
  },
  {
    icon: "🧠",
    label: "Start Quiz",
    to: "/quizzes",
  },
  {
    icon: "◷",
    label: "Start Timer",
    to: "/calendar",
  },
  {
    icon: "🎙",
    label: "Listen",
    to: "/listen",
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const { xp } = useKellyXP();

  return (
    <section className="kelly-home-page">
      <div className="kelly-home-dashboard">

        <div className="kelly-home-welcome">
          <div>
            <h1>
              Welcome back, <span>You</span>
            </h1>
            <p>Here's your study overview</p>
          </div>
        </div>

        <div className="kelly-home-card kelly-home-level-card">
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
              <strong>320 XP</strong>
              <span>to next level</span>
            </div>
          </div>

          <div className="kelly-home-xp-track">
            <div className="kelly-home-xp-fill" />
          </div>

          <div className="kelly-home-level-bottom">
            <span>
              <strong>{xp} XP</strong> total
            </span>

            <span>380 XP this week</span>
          </div>
        </div>

        <div className="kelly-home-stat-row">
          {STATS.map((stat) => (
            <div
              key={stat.name}
              className="kelly-home-card kelly-home-stat-card"
            >
              <div className="kelly-home-stat-icon">
                {stat.icon}
              </div>

              <div className="kelly-home-stat-name">
                {stat.name}
              </div>

              <div className="kelly-home-stat-value">
                {stat.value}
              </div>

              <div className="kelly-home-stat-label">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="kelly-home-two-col">

          <div className="kelly-home-card kelly-home-content-card">
            <div className="kelly-home-card-head">
              <div className="kelly-home-section-label">
                RECENT NOTES
              </div>

              <button
                type="button"
                className="kelly-home-link"
                onClick={() => navigate({ to: "/notes" })}
              >
                View all
              </button>
            </div>

            <div className="kelly-home-note-list">
              {RECENT_NOTES.map((note) => (
                <button
                  key={note.title}
                  type="button"
                  className="kelly-home-note-row"
                  onClick={() => navigate({ to: "/study" })}
                >
                  <div>
                    <strong>{note.title}</strong>
                    <span>{note.meta}</span>
                  </div>

                  <span className="kelly-home-arrow">→</span>
                </button>
              ))}
            </div>
          </div>

          <div className="kelly-home-card kelly-home-content-card">
            <div className="kelly-home-card-head">
              <div className="kelly-home-section-label">
                UPCOMING
              </div>

              <button
                type="button"
                className="kelly-home-link"
                onClick={() => navigate({ to: "/calendar" })}
              >
                Calendar
              </button>
            </div>

            <div className="kelly-home-upcoming-list">
              {UPCOMING.map((item) => (
                <div
                  key={item.title}
                  className="kelly-home-upcoming-row"
                >
                  <div
                    className={`kelly-home-upcoming-bar ${item.tone}`}
                  />

                  <div className="kelly-home-upcoming-copy">
                    <strong>{item.title}</strong>
                    <span>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="kelly-home-two-col">

          <div className="kelly-home-card kelly-home-content-card">
            <div className="kelly-home-card-head">
              <div className="kelly-home-section-label">
                LAST QUIZ
              </div>

              <button
                type="button"
                className="kelly-home-link"
                onClick={() => navigate({ to: "/quizzes" })}
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

                <span>SCORE</span>
              </div>

              <div>
                <strong className="kelly-home-quiz-xp">
                  +60
                </strong>

                <span>XP EARNED</span>
              </div>
            </div>
          </div>

          <div className="kelly-home-card kelly-home-content-card">
            <div className="kelly-home-card-head">
              <div className="kelly-home-section-label">
                FRIENDS STUDYING
              </div>

              <button
                type="button"
                className="kelly-home-link"
                onClick={() => navigate({ to: "/groups" })}
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
          </div>

        </div>

        <div className="kelly-home-quick-wrap">
          <div className="kelly-home-section-label">
            QUICK ACTIONS
          </div>

          <div className="kelly-home-quick-row">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                className="kelly-home-quick-action"
                onClick={() => navigate({ to: action.to })}
              >
                <span className="kelly-home-quick-icon">
                  {action.icon}
                </span>

                <strong>{action.label}</strong>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}