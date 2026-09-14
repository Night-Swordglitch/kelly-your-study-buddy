import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Lock, Mail, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { KellyAvatar } from "@/components/kelly/kelly-avatar";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (mode === "signup") {
        if (!name.trim()) {
          setErrorMessage("Please enter your name.");
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              display_name: name.trim(),
            },
          },
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          await navigate({ to: "/dashboard" });
          return;
        }

        setSuccessMessage(
          "Account created. Check your email to confirm your account.",
        );

        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      await navigate({ to: "/dashboard" });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  function switchMode(nextMode: "login" | "signup") {
    setMode(nextMode);
    setErrorMessage("");
    setSuccessMessage("");
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
              onClick={() => switchMode("signup")}
              disabled={loading}
            >
              Sign up
            </button>

            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => switchMode("login")}
              disabled={loading}
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
                    disabled={loading}
                    required
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
                  disabled={loading}
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
                    mode === "signup"
                      ? "new-password"
                      : "current-password"
                  }
                  disabled={loading}
                  required
                />
              </div>
            </label>

            {errorMessage && (
              <div className="kelly-auth-message error" role="alert">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="kelly-auth-message success" role="status">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              className="kelly-auth-submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "signup"
                  ? "Create my account"
                  : "Log in"}

              {!loading && <ArrowRight />}
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