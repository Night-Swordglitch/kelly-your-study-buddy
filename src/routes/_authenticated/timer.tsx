import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, Users, X } from "lucide-react";
import { FRIENDS } from "@/lib/kelly-friends";

type TimerMode = "pomodoro" | "deep-work" | "custom";
type TimerPhase = "focus" | "break";

const TIMER_STATS_KEY = "kelly-timer-stats";

const SUBJECTS = ["Biology", "Mathematics", "History", "Physics", "Chemistry"];

const MODE_CONFIG = {
  pomodoro: { focus: 25, break: 5 },
  "deep-work": { focus: 50, break: 10 },
};

type TimerStats = {
  todayMinutes: number;
  studyMinutes: number;
  streak: number;
  lastCompletedDate: string | null;
};

function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function loadStats(): TimerStats {
  if (typeof window === "undefined") {
    return { todayMinutes: 0, studyMinutes: 47, streak: 5, lastCompletedDate: null };
  }

  try {
    const stored = window.localStorage.getItem(TIMER_STATS_KEY);
    if (!stored) {
      return { todayMinutes: 0, studyMinutes: 47, streak: 5, lastCompletedDate: null };
    }

    const parsed = JSON.parse(stored);

    return {
      todayMinutes: Number.isFinite(parsed.todayMinutes) ? parsed.todayMinutes : 0,
      studyMinutes: Number.isFinite(parsed.studyMinutes) ? parsed.studyMinutes : 47,
      streak: Number.isFinite(parsed.streak) ? parsed.streak : 5,
      lastCompletedDate: parsed.lastCompletedDate ?? null,
    };
  } catch {
    return { todayMinutes: 0, studyMinutes: 47, streak: 5, lastCompletedDate: null };
  }
}

function saveStats(stats: TimerStats) {
  window.localStorage.setItem(TIMER_STATS_KEY, JSON.stringify(stats));
}

function formatTime(totalSeconds: number) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

function TimerPage() {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [customFocus, setCustomFocus] = useState(30);
  const [customBreak, setCustomBreak] = useState(5);
  const [subject, setSubject] = useState("Biology");

  const [phase, setPhase] = useState<TimerPhase>("focus");
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(25 * 60);
  const [stats, setStats] = useState<TimerStats>(() => loadStats());
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const toggleFriendSelection = (friendId: number) => {
    setSelectedFriends((current) =>
      current.includes(friendId)
        ? current.filter((id) => id !== friendId)
        : [...current, friendId],
    );
  };

  const sendInvites = () => {
    const names = FRIENDS
      .filter((friend) => selectedFriends.includes(friend.id))
      .map((friend) => friend.name);

    if (names.length === 0) return;

    setInviteOpen(false);
    setSelectedFriends([]);
    window.alert(`Study invite sent to ${names.join(", ")}.`);
  };

  const focusMinutes = useMemo(
    () => mode === "custom" ? Math.max(1, customFocus || 1) : MODE_CONFIG[mode].focus,
    [mode, customFocus],
  );

  const breakMinutes = useMemo(
    () => mode === "custom" ? Math.max(1, customBreak || 1) : MODE_CONFIG[mode].break,
    [mode, customBreak],
  );

  const fullFocusSeconds = focusMinutes * 60;
  const fullBreakSeconds = breakMinutes * 60;

  const totalPhaseSeconds = phase === "focus" ? fullFocusSeconds : fullBreakSeconds;
  const progress = totalPhaseSeconds > 0
    ? ((totalPhaseSeconds - remaining) / totalPhaseSeconds) * 100
    : 0;

  useEffect(() => {
    if (!running) return;

    const interval = window.setInterval(() => {
      setRemaining((current) => {
        if (current > 1) return current - 1;

        if (phase === "focus") {
          setPhase("break");
          return fullBreakSeconds;
        }

        setPhase("focus");

        setStats((currentStats) => {
          const today = getTodayKey();
          const next = {
            todayMinutes: currentStats.todayMinutes + focusMinutes,
            studyMinutes: currentStats.studyMinutes + focusMinutes,
            streak: currentStats.streak,
            lastCompletedDate: today,
          };

          saveStats(next);
          return next;
        });

        return fullFocusSeconds;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [running, phase, fullBreakSeconds, fullFocusSeconds, focusMinutes]);

  useEffect(() => {
    if (running) return;
    setPhase("focus");
    setRemaining(fullFocusSeconds);
  }, [mode, customFocus, customBreak]);

  const selectMode = (nextMode: TimerMode) => {
    if (running) return;

    setMode(nextMode);
    setPhase("focus");

    if (nextMode === "pomodoro") setRemaining(25 * 60);
    else if (nextMode === "deep-work") setRemaining(50 * 60);
    else setRemaining(Math.max(1, customFocus || 1) * 60);
  };

  const resetTimer = () => {
    setRunning(false);
    setPhase("focus");
    setRemaining(fullFocusSeconds);
  };

  return (
    <section className="kelly-timer-page">
      <header className="kelly-timer-header">
        <h1>Timer</h1>
      </header>

      <div className="kelly-timer-mode-switcher">
        {([
          ["pomodoro", "25 / 5 Pomodoro"],
          ["deep-work", "50 / 10 Deep Work"],
          ["custom", "Custom"],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`kelly-timer-mode-button${mode === value ? " active" : ""}`}
            onClick={() => selectMode(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "custom" && (
        <div className="kelly-timer-custom-fields">
          <label>
            <span>Focus (min)</span>
            <input
              type="number"
              min="1"
              max="240"
              value={customFocus}
              disabled={running}
              onChange={(e) => setCustomFocus(Math.min(240, Math.max(1, Number(e.target.value) || 1)))}
            />
          </label>

          <label>
            <span>Break (min)</span>
            <input
              type="number"
              min="1"
              max="120"
              value={customBreak}
              disabled={running}
              onChange={(e) => setCustomBreak(Math.min(120, Math.max(1, Number(e.target.value) || 1)))}
            />
          </label>
        </div>
      )}

      <div className="kelly-timer-subject-row">
        <label htmlFor="kelly-timer-subject">Subject:</label>
        <select
          id="kelly-timer-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          {SUBJECTS.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className="kelly-timer-display">
        <div
          className="kelly-timer-ring"
          style={{
            background: `conic-gradient(#7c5cff ${progress}%, #292936 ${progress}% 100%)`,
          }}
        >
          <div className="kelly-timer-ring-inner">
            <strong>{formatTime(remaining)}</strong>
            <span>{phase === "focus" ? "Focus" : "Break"}</span>
          </div>
        </div>

        <div className="kelly-timer-controls">
          <button
            type="button"
            className="kelly-timer-reset"
            aria-label="Reset timer"
            onClick={resetTimer}
          >
            <RotateCcw size={18} strokeWidth={2.2} />
          </button>

          <button
            type="button"
            className="kelly-timer-start"
            onClick={() => setRunning((value) => !value)}
          >
            {running ? (
              <>
                <Pause size={17} fill="currentColor" />
                Pause
              </>
            ) : (
              <>
                <Play size={17} fill="currentColor" />
                Start
              </>
            )}
          </button>
        </div>
      </div>

      <div className="kelly-timer-stats">
        <div className="kelly-timer-stat-card">
          <strong className="violet">{stats.todayMinutes}</strong>
          <span>Today</span>
        </div>
        <div className="kelly-timer-stat-card">
          <strong>{stats.studyMinutes}m</strong>
          <span>Study time</span>
        </div>
        <div className="kelly-timer-stat-card">
          <strong className="amber">{stats.streak}</strong>
          <span>Day streak</span>
        </div>
      </div>

      <div className="kelly-timer-friends-card">
        <div className="kelly-timer-friends-heading">
          <Users size={18} strokeWidth={2.2} />
          <strong>Study with Friends</strong>
        </div>

        <button
          type="button"
          className="kelly-timer-invite"
          onClick={() => setInviteOpen(true)}
        >
          Invite Friends to Study
        </button>
      </div>

      {inviteOpen && (
        <div
          className="kelly-timer-invite-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setInviteOpen(false);
              setSelectedFriends([]);
            }
          }}
        >
          <div
            className="kelly-timer-invite-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="kelly-timer-invite-title"
          >
            <div className="kelly-timer-invite-modal-header">
              <div>
                <h2 id="kelly-timer-invite-title">Invite Friends</h2>
                <p>Select friends to invite to this study session.</p>
              </div>

              <button
                type="button"
                className="kelly-timer-invite-close"
                aria-label="Close invite window"
                onClick={() => {
                  setInviteOpen(false);
                  setSelectedFriends([]);
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="kelly-timer-invite-list">
              {FRIENDS.map((friend) => {
                const selected = selectedFriends.includes(friend.id);

                return (
                  <button
                    key={friend.id}
                    type="button"
                    className={`kelly-timer-friend-option${selected ? " selected" : ""}`}
                    onClick={() => toggleFriendSelection(friend.id)}
                  >
                    <span
                      className="kelly-timer-friend-avatar"
                      style={{ background: friend.avatar }}
                    >
                      {friend.initial}
                    </span>

                    <span className="kelly-timer-friend-info">
                      <strong>{friend.name}</strong>
                      <small>
                        Level {friend.level} · {friend.status}
                      </small>
                    </span>

                    <span className="kelly-timer-friend-check">
                      {selected ? "✓" : ""}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="kelly-timer-send-invites"
              disabled={selectedFriends.length === 0}
              onClick={sendInvites}
            >
              Invite
              {selectedFriends.length > 0
                ? ` (${selectedFriends.length})`
                : ""}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export const Route = createFileRoute("/_authenticated/timer")({
  component: TimerPage,
});





