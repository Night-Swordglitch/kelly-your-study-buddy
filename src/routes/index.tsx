import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, CalendarClock, Sparkles } from "lucide-react";
import { KellyAvatar } from "@/components/kelly/kelly-avatar";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <main className="kelly-landing">
      <div className="kelly-orb kelly-orb-one" />
      <div className="kelly-orb kelly-orb-two" />
      <div className="kelly-grid" />

      <nav className="kelly-landing-nav">
        <Link to="/" className="kelly-logo">
          <span className="kelly-logo-mark">
            <KellyAvatar size="sm" />
          </span>
          <span>
            <strong>Kelly</strong>
            <small>Study companion</small>
          </span>
        </Link>

        <div className="kelly-nav-actions">
          <Link to="/auth" className="kelly-login">
            Log in
          </Link>

          <Link to="/auth" className="kelly-nav-button">
            Try Kelly
            <ArrowRight />
          </Link>
        </div>
      </nav>

      <section className="kelly-hero">
        <div className="kelly-hero-copy">
          <div className="kelly-pill">
            <span />
            Your study companion
          </div>

          <h1>
            Don't study
            <br />
            <span>alone.</span>
          </h1>

          <p>
            Kelly helps you work through your assignments step by step,
            remembers what you're working on, and keeps your deadlines
            visible — without making studying feel overwhelming.
          </p>

          <div className="kelly-hero-buttons">
            <Link to="/auth" className="kelly-primary">
              Meet Kelly
              <ArrowRight />
            </Link>

            <a href="#how" className="kelly-secondary">
              See how it works
            </a>
          </div>

          <div className="kelly-trust">
            <div className="kelly-trust-avatar">
              <KellyAvatar mood="happy" size="sm" />
            </div>

            <div>
              <strong>Built around you</strong>
              <span>Tasks · Memory · Deadlines</span>
            </div>
          </div>
        </div>

        <div className="kelly-hero-character">
          <div className="kelly-character-glow" />

          <div className="kelly-floating kelly-float-task">
            <div className="kelly-float-icon purple">
              <Brain />
            </div>
            <div>
              <strong>Math assignment</strong>
              <span>3 questions left</span>
            </div>
            <div className="kelly-mini-progress">
              <span />
            </div>
          </div>

          <div className="kelly-floating kelly-float-memory">
            <div className="kelly-float-icon blue">
              <Sparkles />
            </div>
            <div>
              <strong>Kelly remembers</strong>
              <span>Quadratic equations</span>
            </div>
          </div>

          <div className="kelly-floating kelly-float-deadline">
            <div className="kelly-float-icon orange">
              <CalendarClock />
            </div>
            <div>
              <strong>Tomorrow</strong>
              <span>Science project · 11:59 PM</span>
            </div>
          </div>

          <div className="kelly-character-stage">
            <div className="kelly-ring kelly-ring-one" />
            <div className="kelly-ring kelly-ring-two" />

            <div className="kelly-character-platform">
              <KellyAvatar mood="happy" size="lg" />
            </div>

            <div className="kelly-speech">
              <span className="kelly-speech-dot" />
              Hey! Ready to get something done?
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="kelly-how">
        <div className="kelly-section-heading">
          <div className="kelly-pill">
            <span />
            How Kelly helps
          </div>

          <h2>
            Less figuring out.
            <br />
            <span>More getting done.</span>
          </h2>

          <p>
            Kelly isn't here to replace your thinking. She's here to make
            the next step easier.
          </p>
        </div>

        <div className="kelly-feature-grid">
          <Feature
            number="01"
            icon={<Brain />}
            title="Guides you"
            text="Work through difficult questions one step at a time instead of simply being handed an answer."
          />

          <Feature
            number="02"
            icon={<Sparkles />}
            title="Remembers"
            text="Your subjects, ongoing work, and useful context stay connected between study sessions."
          />

          <Feature
            number="03"
            icon={<CalendarClock />}
            title="Keeps you ahead"
            text="Upcoming deadlines stay visible so important work doesn't suddenly become a last-minute problem."
          />
        </div>
      </section>

      <section className="kelly-final">
        <div className="kelly-final-avatar">
          <KellyAvatar mood="happy" size="md" />
        </div>

        <div>
          <div className="kelly-pill">
            <span />
            Kelly is ready
          </div>

          <h2>
            Your next study session
            <br />
            <span>starts here.</span>
          </h2>
        </div>

        <Link to="/auth" className="kelly-primary">
          Open Kelly
          <ArrowRight />
        </Link>
      </section>

      <footer className="kelly-footer">
        <div className="kelly-logo">
          <span className="kelly-logo-mark">
            <KellyAvatar size="sm" />
          </span>
          <span>
            <strong>Kelly</strong>
            <small>Study companion</small>
          </span>
        </div>

        <span>Study smarter. Stay ahead.</span>
      </footer>
    </main>
  );
}

function Feature({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="kelly-feature">
      <div className="kelly-feature-top">
        <span>{number}</span>
        <div>{icon}</div>
      </div>

      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
