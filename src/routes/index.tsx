import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Sparkles,
} from "lucide-react";

import { KellyAvatar } from "@/components/kelly/kelly-avatar";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="kelly-landing">
      <div className="kelly-landing-orb kelly-landing-orb-one" />
      <div className="kelly-landing-orb kelly-landing-orb-two" />
      <div className="kelly-landing-grid" />

      <nav className="kelly-landing-nav">
        <Link to="/" className="kelly-landing-brand">
          <span className="kelly-landing-brand-mark">
            <KellyAvatar size="sm" />
          </span>

          <span>
            <strong>KELLY</strong>
            <small>Study companion</small>
          </span>
        </Link>

        <Link
          to="/auth"
          className="kelly-landing-login"
        >
          Log in
        </Link>
      </nav>

      <section className="kelly-landing-hero">

        <div className="kelly-landing-copy">

          <div className="kelly-landing-pill">
            <Sparkles />
            Your study companion
          </div>

          <h1>
            Study smarter.
            <br />
            <span>With KELLY.</span>
          </h1>

          <p>
            Stay organised, understand difficult topics,
            and build better study habits with a companion
            that remembers what matters.
          </p>

          <div className="kelly-landing-actions">

            <Link
              to="/auth"
              className="kelly-landing-primary"
            >
              Get started
              <ArrowRight />
            </Link>

            <Link
              to="/auth"
              className="kelly-landing-secondary"
            >
              I already have an account
            </Link>

          </div>

        </div>

        <div className="kelly-landing-character">

          <div className="kelly-landing-glow" />

          <div className="kelly-landing-ring ring-one" />
          <div className="kelly-landing-ring ring-two" />

          <div className="kelly-landing-character-card">
            <KellyAvatar
              mood="happy"
              size="lg"
            />
          </div>

          <div className="kelly-landing-floating-card floating-one">
            <BookOpen />
            <span>
              <strong>Study</strong>
              Guided sessions
            </span>
          </div>

          <div className="kelly-landing-floating-card floating-two">
            <Brain />
            <span>
              <strong>Learn</strong>
              Remember more
            </span>
          </div>

        </div>

      </section>
    </main>
  );
}
