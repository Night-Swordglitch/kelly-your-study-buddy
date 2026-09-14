import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  Clock3,
  Sparkles,
  Target,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="kelly-home">

      {/* NAVIGATION */}
      <nav className="kelly-home-nav">
        <Link to="/" className="kelly-home-brand">
          <span className="kelly-home-brand-mark">
            <img
              src="/favicon.png"
              alt="Kelly"
              style={{
                width: "24px",
                height: "24px",
                objectFit: "contain",
                display: "block",
              }}
            />
          </span>

          <span>Kelly</span>
        </Link>

        <div className="kelly-home-nav-links">
          <a href="#features">Features</a>
          <a href="#preview">Preview</a>
        </div>

        <div className="kelly-home-nav-actions">
          <Link to="/auth" className="kelly-home-login">
            <span>Log in</span>
          </Link>

          <Link to="/auth" className="kelly-home-nav-cta">
            <span>Get started</span>
            <ArrowRight />
          </Link>
        </div>
      </nav>


      {/* HERO */}
      <section className="kelly-home-hero">
        <div className="kelly-home-hero-copy">

          <div className="kelly-home-eyebrow">
            <span className="kelly-home-status-dot" />
            <span>Your study companion</span>
          </div>

          <h1>
            Study with <span>less stress.</span>
          </h1>

          <p>
            Kelly stays with you through assignments, remembers what you're
            working on, and helps you stay ahead before deadlines sneak up.
          </p>

          <div className="kelly-home-hero-actions">

            <Link to="/auth" className="kelly-home-primary">
              <span>Try Kelly free</span>
              <ArrowRight />
            </Link>

            <a href="#preview" className="kelly-home-secondary">
              <span>See how it works</span>
            </a>

          </div>

          <div className="kelly-home-note">

            <div className="kelly-home-note-avatar">
              <img
                src="/favicon.png"
                alt="Kelly"
                style={{
                  width: "28px",
                  height: "28px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>

            <div>
              <strong>Meet Kelly</strong>
              <span>Your study buddy that remembers.</span>
            </div>

          </div>

        </div>


        {/* PRODUCT PREVIEW */}
        <div className="kelly-home-preview-wrap" id="preview">

          <div className="kelly-home-preview-glow" />

          <div className="kelly-home-preview">

            <div className="kelly-home-preview-top">

              <div className="kelly-home-preview-user">

                <div className="kelly-home-preview-avatar">
                  <img
                    src="/favicon.png"
                    alt="Kelly"
                    style={{
                      width: "25px",
                      height: "25px",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>

                <div>
                  <span>GOOD MORNING</span>
                  <strong>Let's get things done.</strong>
                </div>

              </div>

              <div className="kelly-home-preview-menu">
                <span />
                <span />
                <span />
              </div>

            </div>


            <div className="kelly-home-preview-heading">
              <h2>Here's what you have today.</h2>
              <p>Kelly has organised your study session.</p>
            </div>


            <div className="kelly-home-preview-grid">

              {/* TODAY */}
              <div className="kelly-preview-card">

                <div className="kelly-preview-card-heading">

                  <div>
                    <div className="kelly-preview-label">TODAY</div>
                    <h3>Mathematics</h3>
                  </div>

                  <div className="kelly-preview-icon blue">
                    <BookOpen />
                  </div>

                </div>

                <p>
                  Continue working through your quadratic equations practice.
                </p>

                <div className="kelly-preview-progress-label">
                  <span>Progress</span>
                  <strong>72%</strong>
                </div>

                <div className="kelly-preview-progress">
                  <span style={{ width: "72%" }} />
                </div>

                <Link
                  to="/dashboard"
                  className="kelly-preview-button"
                >
                  <span>Continue</span>
                  <ArrowRight />
                </Link>

              </div>


              {/* PROGRESS */}
              <div className="kelly-preview-card">

                <div className="kelly-preview-card-heading">

                  <div>
                    <div className="kelly-preview-label">
                      YOUR PROGRESS
                    </div>

                    <h3>Keep going.</h3>
                  </div>

                  <div className="kelly-preview-icon pink">
                    <Target />
                  </div>

                </div>

                <div className="kelly-preview-big-progress">
                  <span style={{ width: "72%" }} />
                </div>

                <div className="kelly-preview-stats">

                  <div>
                    <strong>4</strong>
                    <span>Tasks completed</span>
                  </div>

                  <div>
                    <strong>72%</strong>
                    <span>Weekly progress</span>
                  </div>

                </div>

              </div>

            </div>


            {/* UPCOMING */}
            <div className="kelly-preview-schedule">

              <div className="kelly-preview-schedule-heading">

                <div>
                  <div className="kelly-preview-label">
                    UPCOMING
                  </div>

                  <h3>Don't let deadlines sneak up.</h3>
                </div>

                <CalendarDays />

              </div>


              <div className="kelly-preview-deadline">

                <div className="kelly-preview-deadline-icon blue">
                  <BookOpen />
                </div>

                <div>
                  <strong>Science project</strong>
                  <span>Due tomorrow</span>
                </div>

                <div className="kelly-preview-check">
                  <Clock3 />
                </div>

              </div>


              <div className="kelly-preview-deadline">

                <div className="kelly-preview-deadline-icon pink">
                  <Sparkles />
                </div>

                <div>
                  <strong>English assignment</strong>
                  <span>Due Friday</span>
                </div>

                <div className="kelly-preview-check">
                  <Check />
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* FEATURES */}
      <section className="kelly-home-features" id="features">

        <div className="kelly-home-section-heading">

          <div className="kelly-home-eyebrow">
            <span className="kelly-home-status-dot" />
            <span>Built around you</span>
          </div>

          <h2>
            More than answers.
            <br />
            <span>A study partner.</span>
          </h2>

          <p>
            Kelly is designed to stay with you throughout the process, not
            disappear after giving you an answer.
          </p>

        </div>


        <div className="kelly-home-feature-grid">

          {/* FEATURE 1 */}
          <article className="kelly-home-feature">

            <div className="kelly-home-feature-icon blue">
              <BookOpen />
            </div>

            <h3>Guides you through it</h3>

            <p>
              Kelly walks with you through the actual work, step by step,
              instead of just handing over an answer.
            </p>

            <div className="kelly-home-feature-arrow">
              <ArrowRight />
            </div>

          </article>


          {/* FEATURE 2 */}
          <article className="kelly-home-feature">

            <div className="kelly-home-feature-icon pink">
              <Sparkles />
            </div>

            <h3>Remembers your context</h3>

            <p>
              Your courses, your ongoing tasks, and what you talked through
              last week — Kelly keeps track so you don't have to.
            </p>

            <div className="kelly-home-feature-arrow">
              <ArrowRight />
            </div>

          </article>


          {/* FEATURE 3 */}
          <article className="kelly-home-feature">

            <div className="kelly-home-feature-icon green">
              <CalendarDays />
            </div>

            <h3>Reminds you on time</h3>

            <p>
              Deadlines land on your dashboard before they become an
              emergency, not after.
            </p>

            <div className="kelly-home-feature-arrow">
              <ArrowRight />
            </div>

          </article>

        </div>

      </section>


      {/* FINAL CTA */}
      <section className="kelly-home-final">

        {/* Kelly from public/favicon.png */}
        <div className="kelly-home-final-avatar">
          <img
            src="/favicon.png"
            alt="Kelly"
            className="kelly-home-final-avatar-image"
          />
        </div>


        <div className="kelly-home-final-copy">

          <span>READY WHEN YOU ARE</span>

          <h2>
            Let's make studying <em>easier.</em>
          </h2>

        </div>


        <Link to="/auth" className="kelly-home-primary">

          <span>Get started</span>
          <ArrowRight />

        </Link>

      </section>


      {/* FOOTER */}
      <footer className="kelly-home-footer">

        <span>© 2026 Kelly</span>
        <span>Your study buddy.</span>

      </footer>

    </main>
  );
}