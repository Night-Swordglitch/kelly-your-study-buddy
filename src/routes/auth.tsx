import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Lock, Mail, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { KellyAvatar } from "@/components/kelly/kelly-avatar";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // Temporary navigation while authentication is being wired up.
    navigate({ to: "/dashboard" });
  }

  return (
    <main className="kelly-auth">
      <div className="kelly-orb kelly-orb-one" />
      <div className="kelly-orb kelly-orb-two" />
      <div className="kelly-grid" />

      <nav className="kelly-auth-nav">
        <Link to="/" className="kelly-logo">
          <span className="kelly-logo-mark">
            <KellyAvatar size="sm" />
          </span>

          <span>
            <strong>Kelly</strong>
            <small>Study companion</small>
          </span>
        </Link>

        <Link to="/" className="kelly-auth-back">
          <ArrowLeft />
          Back home
        </Link>
      </nav>

      <section className="kelly-auth-layout">
        <div className="kelly-auth-intro">
          <div className="kelly-auth-character">
            <div className="kelly-character-glow" />

            <div className="kelly-character-stage">
              <div className="kelly-ring kelly-ring-one" />
              <div className="kelly-ring kelly-ring-two" />

              <div className="kelly-character-platform">
                <KellyAvatar mood="happy" size="lg" />
              </div>
            </div>
          </div>

          <div className="kelly-pill">
            <span />
            Your study companion
          </div>

          <h1>
            Let's get
            <br />
            <span>started.</span>
          </h1>

          <p>
            Kelly will help you stay organised, work through difficult
            questions, and keep track of what matters.
          </p>
        </div>

        <div className="kelly-auth-card">
          <div className="kelly-auth-card-top">
            <div>
              <span className="kelly-auth-eyebrow">
                <Sparkles />
                Welcome to Kelly
              </span>

              <h2>
                {mode === "signup"
                  ? "Create your account"
                  : "Welcome back"}
              </h2>

              <p>
                {mode === "signup"
                  ? "A little space to make studying easier."
                  : "Let's pick up where you left off."}
              </p>
            </div>
          </div>

          <div className="kelly-auth-tabs">
            <button
              type="button"
              className={mode === "signup" ? "active" : ""}
              onClick={() => setMode("signup")}
            >
              Sign up
            </button>

            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Log in
            </button>
          </div>

          <form onSubmit={handleSubmit} className="kelly-auth-form">
            {mode === "signup" && (
              <label>
                <span>Name</span>

                <div className="kelly-input">
                  <User />
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="What should Kelly call you?"
                    autoComplete="name"
                  />
                </div>
              </label>
            )}

            <label>
              <span>Email</span>

              <div className="kelly-input">
                <Mail />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label>
              <span>Password</span>

              <div className="kelly-input">
                <Lock />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                  required
                />
              </div>
            </label>

            <button type="submit" className="kelly-auth-submit">
              {mode === "signup" ? "Create my account" : "Log in"}

              <ArrowRight />
            </button>
          </form>

          <p className="kelly-auth-note">
            {mode === "signup"
              ? "You can add your course and study preferences later."
              : "Your workspace and study context are waiting for you."}
          </p>
        </div>
      </section>
    </main>
  );
}