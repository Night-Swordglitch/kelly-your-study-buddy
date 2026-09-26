import { useState } from "react";
import { Brain, Flame, Lock, Mic, Moon, Target, Trophy } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/kelly/app-shell";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Muhsin");
  const [draftName, setDraftName] = useState("Muhsin");

  const handleEdit = () => {
    setDraftName(name);
    setEditing(true);
  };

  const handleCancel = () => {
    setDraftName(name);
    setEditing(false);
  };

  const handleSave = () => {
    const trimmed = draftName.trim();

    if (trimmed) {
      setName(trimmed);
    }

    setEditing(false);
  };

  return (
    <div className="kelly-profile-page">
      <PageIntro
        title="Profile"
        description="Your learning identity, progress and journey."
      />

      <main className="kelly-profile-content">
        {/* Hero */}
        <section className="kelly-profile-card kelly-profile-hero">
          <div className="kelly-profile-hero-main">
            <div className="kelly-profile-avatar-wrap">
              <div className="kelly-profile-avatar kelly-profile-avatar-fallback">
                M
              </div>
              <div className="kelly-profile-level-badge">3</div>
            </div>

            <div className="kelly-profile-hero-copy">
              <div className="kelly-profile-eyebrow">
                YOUR LEARNING IDENTITY
              </div>

              <h2>{name}</h2>

              <p className="kelly-profile-tagline">
                Building momentum, one session at a time.
              </p>

              <div className="kelly-profile-identity-tags">
                <span>Level 3</span>
                <span>5 day streak</span>
                <span>1,180 XP</span>
              </div>
            </div>
          </div>

          <div className="kelly-profile-level">
            <div className="kelly-profile-level-top">
              <span>Progress to Level 4</span>
              <strong>1,180 / 1,500 XP</strong>
            </div>

            <div className="kelly-profile-progress">
              <div style={{ width: "79%" }} />
            </div>

            <span className="kelly-profile-progress-caption">
              320 XP to go
            </span>
          </div>
        </section>

        {/* Learning identity */}
        <section className="kelly-profile-card kelly-profile-personality-card">
          <div className="kelly-profile-personality-icon"><Moon size={22} /></div>

          <div>
            <span className="kelly-profile-eyebrow">
              YOUR STUDY STYLE
            </span>

            <h2>The Night Owl</h2>

            <p>
              You tend to build momentum through focused sessions and
              keep coming back when it matters.
            </p>
          </div>
        </section>

        {/* Account */}
        <section className="kelly-profile-card kelly-profile-account-card">
          <div className="kelly-profile-section-header">
            <div>
              <h2>Account</h2>
              <p>Your personal KELLY account information.</p>
            </div>

            {!editing && (
              <button
                type="button"
                className="kelly-profile-button"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <div className="kelly-profile-edit">
              <div className="kelly-profile-field">
                <label htmlFor="profile-name">Display name</label>
                <input
                  id="profile-name"
                  type="text"
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  autoFocus
                />
              </div>

              <div className="kelly-profile-field">
                <label>Email</label>
                <input
                  type="email"
                  value="muhsin@example.com"
                  disabled
                  readOnly
                />
              </div>

              <div className="kelly-profile-actions">
                <button
                  type="button"
                  className="kelly-profile-button secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="kelly-profile-button"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="kelly-profile-details">
              <div className="kelly-profile-detail">
                <div className="kelly-profile-label">Display name</div>
                <div className="kelly-profile-value">{name}</div>
              </div>

              <div className="kelly-profile-detail">
                <div className="kelly-profile-label">Email</div>
                <div className="kelly-profile-value">
                  muhsin@example.com
                </div>
              </div>

              <div className="kelly-profile-detail">
                <div className="kelly-profile-label">Sign-in method</div>
                <div className="kelly-profile-value">Google</div>
              </div>

              <div className="kelly-profile-detail">
                <div className="kelly-profile-label">Member since</div>
                <div className="kelly-profile-value">September 2026</div>
              </div>
            </div>
          )}
        </section>

        {/* Streak */}
        <section className="kelly-profile-card kelly-profile-streak-card">
          <div className="kelly-profile-card-icon"><Flame size={20} /></div>
          <span className="kelly-profile-stat-label">CURRENT STREAK</span>
          <strong className="kelly-profile-stat-large">5</strong>
          <span className="kelly-profile-stat-subtle">days</span>

          <div className="kelly-profile-week">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
              <div
                key={`${day}-${index}`}
                className={`kelly-profile-day ${
                  index < 5 ? "complete" : ""
                }`}
              >
                <span>{day}</span>
                <i />
              </div>
            ))}
          </div>
        </section>

        {/* Next milestone */}
        <section className="kelly-profile-card kelly-profile-milestone-card">
          <div className="kelly-profile-card-icon"><Flame size={20} /></div>
          <span className="kelly-profile-stat-label">NEXT MILESTONE</span>
          <strong className="kelly-profile-milestone-title">
            Level 4
          </strong>
          <span className="kelly-profile-stat-subtle">
            320 XP remaining
          </span>

          <div className="kelly-profile-mini-progress">
            <div style={{ width: "79%" }} />
          </div>
        </section>

        {/* Study pulse */}
        <section className="kelly-profile-card kelly-profile-pulse-card">
          <div className="kelly-profile-section-header">
            <div>
              <h2>Study Pulse</h2>
              <p>Your activity over the last 7 days.</p>
            </div>

            <span className="kelly-profile-pulse-total">47 min</span>
          </div>

          <div className="kelly-profile-chart">
            {[34, 48, 22, 62, 84, 45, 72].map((height, index) => (
              <div className="kelly-profile-chart-column" key={index}>
                <div
                  className="kelly-profile-chart-bar"
                  style={{ height: `${height}%` }}
                />
                <span>
                  {["M", "T", "W", "T", "F", "S", "S"][index]}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Improving */}
        <section className="kelly-profile-card kelly-profile-improving-card">
          <div className="kelly-profile-section-header">
            <div>
              <h2>You're Getting Better At</h2>
              <p>Your current learning momentum.</p>
            </div>
          </div>

          <div className="kelly-profile-skills">
            <Skill name="Mathematics" value={82} />
            <Skill name="History" value={71} />
            <Skill name="Biology" value={54} />
          </div>
        </section>

        {/* Achievements */}
        <section className="kelly-profile-card kelly-profile-achievements-card">
          <div className="kelly-profile-section-header">
            <div>
              <h2>Achievements</h2>
              <p>Milestones you've unlocked.</p>
            </div>

            <span className="kelly-profile-achievement-count">
              4 / 8
            </span>
          </div>

          <div className="kelly-profile-achievements">
            <div className="kelly-profile-achievement unlocked">
              <span>+</span>
              <strong>First Note</strong>
            </div>

            <div className="kelly-profile-achievement unlocked">
              <span>+</span>
              <strong>5-Day Streak</strong>
            </div>

            <div className="kelly-profile-achievement unlocked">
              <span>+</span>
              <strong>First Recording</strong>
            </div>

            <div className="kelly-profile-achievement unlocked">
              <span>+</span>
              <strong>Quiz Starter</strong>
            </div>

            <div className="kelly-profile-achievement locked">
              <span>+</span>
              <strong>10-Day Streak</strong>
            </div>
          </div>
        </section>

        {/* Journey */}
        <section className="kelly-profile-card kelly-profile-journey-card">
          <div className="kelly-profile-section-header">
            <div>
              <h2>Your KELLY Journey</h2>
              <p>A few moments from your learning story.</p>
            </div>
          </div>

          <div className="kelly-profile-timeline">
            <TimelineItem
              title="Joined KELLY"
              description="Your learning journey began."
              active
            />
            <TimelineItem
              title="First study session"
              description="You completed your first session."
              active
            />
            <TimelineItem
              title="Created your first note"
              description="You started building your knowledge base."
              active
            />
            <TimelineItem
              title="Reached Level 3"
              description="You kept the momentum going."
              active
            />
            <TimelineItem
              title="Reach Level 4"
              description="320 XP remaining."
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function Skill({ name, value }: { name: string; value: number }) {
  return (
    <div className="kelly-profile-skill">
      <div className="kelly-profile-skill-top">
        <span>{name}</span>
        <strong>{value}%</strong>
      </div>

      <div className="kelly-profile-skill-bar">
        <div style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function TimelineItem({
  title,
  description,
  active = false,
}: {
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div className={`kelly-profile-timeline-item ${active ? "active" : ""}`}>
      <div className="kelly-profile-timeline-dot" />

      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
}
