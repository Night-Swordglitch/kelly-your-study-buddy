import { useState } from "react";
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
        description="Manage your KELLY profile and view your study journey."
      />

      <main className="kelly-profile-content">
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

          <div className="kelly-profile-heading">
            <div className="kelly-profile-avatar kelly-profile-avatar-fallback">
              M
            </div>

            <div className="kelly-profile-identity">
              <h3>{name}</h3>
              <p>muhsin@example.com</p>
            </div>
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
                <label htmlFor="profile-email">Email</label>
                <input
                  id="profile-email"
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

        {/* Level */}
        <section className="kelly-profile-card kelly-profile-stat-card">
          <span className="kelly-profile-stat-label">Level</span>
          <strong className="kelly-profile-stat-large">3</strong>
          <span className="kelly-profile-stat-subtle">Current level</span>
        </section>

        {/* XP */}
        <section className="kelly-profile-card kelly-profile-stat-card">
          <span className="kelly-profile-stat-label">Total XP</span>
          <strong className="kelly-profile-stat-large">1,180</strong>
          <span className="kelly-profile-stat-subtle">Earned so far</span>
        </section>

        {/* Streak */}
        <section className="kelly-profile-card kelly-profile-stat-card">
          <span className="kelly-profile-stat-label">Streak</span>
          <strong className="kelly-profile-stat-large">5</strong>
          <span className="kelly-profile-stat-subtle">Days</span>
        </section>

        {/* Study time */}
        <section className="kelly-profile-card kelly-profile-stat-card">
          <span className="kelly-profile-stat-label">Study time</span>
          <strong className="kelly-profile-stat-large">47m</strong>
          <span className="kelly-profile-stat-subtle">Total tracked</span>
        </section>

        {/* Sessions */}
        <section className="kelly-profile-card kelly-profile-stat-card">
          <span className="kelly-profile-stat-label">Sessions</span>
          <strong className="kelly-profile-stat-large">2</strong>
          <span className="kelly-profile-stat-subtle">Completed</span>
        </section>

        {/* Notes */}
        <section className="kelly-profile-card kelly-profile-stat-card">
          <span className="kelly-profile-stat-label">Notes</span>
          <strong className="kelly-profile-stat-large">4</strong>
          <span className="kelly-profile-stat-subtle">Created</span>
        </section>

        {/* Learning Profile */}
        <section className="kelly-profile-card kelly-profile-learning-card">
          <div className="kelly-profile-section-header">
            <div>
              <h2>Learning Profile</h2>
              <p>Your current study preferences and activity.</p>
            </div>
          </div>

          <div className="kelly-profile-learning-grid">
            <div className="kelly-profile-detail">
              <div className="kelly-profile-label">Favourite subject</div>
              <div className="kelly-profile-value">Mathematics</div>
            </div>

            <div className="kelly-profile-detail">
              <div className="kelly-profile-label">Recent activity</div>
              <div className="kelly-profile-value">
                Listen &amp; Transcribe
              </div>
            </div>

            <div className="kelly-profile-detail">
              <div className="kelly-profile-label">Study goal</div>
              <div className="kelly-profile-value">
                Build a consistent study habit
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
