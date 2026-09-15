import { useEffect } from "react";
import { KellyAvatar } from "@/components/kelly/kelly-avatar";
import { useNavigate } from "@tanstack/react-router";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function LandingNav() {
  const navigate = useNavigate();

  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <button
          className="logo"
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <KellyAvatar mood="happy" theme="gold" size={36} />
          <span className="logo-word">KELLY</span>
        </button>

        <div className="nav-links">
          <button type="button" className="nav-link" onClick={() => scrollToSection("who-kelly")}>
            Who's KELLY?
          </button>
          <button type="button" className="nav-link" onClick={() => scrollToSection("how-it-works")}>
            How It Works
          </button>
          <button type="button" className="nav-link" onClick={() => scrollToSection("features")}>
            Features
          </button>
          <button type="button" className="nav-link" onClick={() => scrollToSection("study-together")}>
            Study Together
          </button>
        </div>

        <div className="nav-actions">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => navigate({ to: "/auth" })}
          >
            Login
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => navigate({ to: "/auth" })}
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}

function LandingHero() {
  const navigate = useNavigate();

  return (
    <header className="hero">
      <div className="hero-inner">
        <div className="hero-copy">
          <span className="eyebrow gold">
            <span className="dot" />
            Your AI study companion
          </span>

          <h1>Meet KELLY. Your studies, finally figured out.</h1>

          <p className="hero-lede">
            Record lectures. Turn them into notes. Get quizzed. Fix your
            weaknesses. Study with friends. KELLY brings your entire study life
            together.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => navigate({ to: "/auth" })}
            >
              Get Started
            </button>

            <button
              type="button"
              className="btn btn-ghost-light btn-lg"
              onClick={() => scrollToSection("who-kelly")}
            >
              Who's KELLY?
            </button>
          </div>

          <div className="hero-note">
            <span>🎓</span>
            Built for university &amp; polytechnic students — free to start.
          </div>
        </div>

        <div className="hero-visual">
          <div className="glow" />

          <div className="hero-chip hero-chip-1">
            💬 "Let's fix Chapter 3 together"
          </div>

          <div className="hero-mascot-wrap">
            <KellyAvatar mood="waving" theme="gold" size={300} />
          </div>

          <div className="hero-chip hero-chip-2">
            🔥 6-day streak
          </div>
        </div>
      </div>

      <div className="container landing-process-container">
        <div className="process-strip">
          <div className="process-step">
            <span>🎙</span>
            <strong>Record</strong>
          </div>
          <span className="process-arrow">→</span>
          <div className="process-step">
            <span>📝</span>
            <strong>Notes</strong>
          </div>
          <span className="process-arrow">→</span>
          <div className="process-step">
            <span>🧠</span>
            <strong>Quiz</strong>
          </div>
          <span className="process-arrow">→</span>
          <div className="process-step">
            <span>🎯</span>
            <strong>Improve</strong>
          </div>
          <span className="process-arrow">→</span>
          <div className="process-step">
            <span>👥</span>
            <strong>Study Together</strong>
          </div>
        </div>
      </div>

      <div className="hero-spacer" />
    </header>
  );
}

function WhoIsKelly() {
  const navigate = useNavigate();

  return (
    <section className="section" id="who-kelly">
      <div className="container">
        <div className="kelly-intro">
          <div className="kelly-intro-copy">
            <span className="eyebrow">The character behind the product</span>

            <h2>So... who's KELLY?</h2>

            <p>
              KELLY isn't just another AI chatbot.{" "}
              <strong>KELLY is your personal study companion</strong> — the one
              who organises your lectures, helps you understand the hard
              topics, builds your quizzes and flashcards, and notices exactly
              what you're struggling with.
            </p>

            <p>
              Every subject you bring to KELLY, every quiz you take, every
              lecture you record — KELLY remembers it. The more you study
              together, the better KELLY understands your learning journey,
              and the more useful it becomes at telling you what to do next.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate({ to: "/auth" })}
            >
              Get Started
            </button>
          </div>

          <div className="kelly-stage">
            <div className="kelly-stage-bg" />

            <div className="speech-bubble b1">
              "Don't worry. Let's figure this out together."
            </div>

            <KellyAvatar
              mood="thinking"
              theme="gold"
              size={260}
              className="landing-stage-avatar"
            />

            <div className="speech-bubble b2">
              "You've been struggling with this topic. Want to try again?"
            </div>

            <div className="speech-bubble b3">
              "Your exam is in 3 days. Here's what I think you should focus on."
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: "🎙",
      title: "Bring your material",
      text: "Record a lecture, upload notes, or tell KELLY what you're studying.",
    },
    {
      number: "02",
      icon: "📝",
      title: "KELLY organises it",
      text: "Your messy material becomes clear, structured study notes.",
    },
    {
      number: "03",
      icon: "🧠",
      title: "Test yourself",
      text: "KELLY creates quizzes and flashcards around what you actually need.",
    },
    {
      number: "04",
      icon: "🎯",
      title: "Fix your weaknesses",
      text: "KELLY notices where you're struggling and focuses your revision.",
    },
    {
      number: "05",
      icon: "👥",
      title: "Study together",
      text: "Bring your friends in and make revision feel less like a solo grind.",
    },
  ];

  return (
    <section className="section section-tint" id="how-it-works">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow mint">
            Five steps, one connected system
          </span>

          <h2>How KELLY works</h2>

          <p>
            Not five separate tools. One journey — from messy lecture material
            to knowing exactly what to study tonight.
          </p>
        </div>

        <div className="flow-list">
          {steps.map((step) => (
            <div className="landing-flow-item" key={step.number}>
              <div className="landing-flow-number">{step.number}</div>
              <div className="landing-flow-icon">{step.icon}</div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: "🎙",
      title: "Listen & Transcribe",
      text: "Turn lectures into usable study material.",
      large: true,
    },
    {
      icon: "📝",
      title: "Smart Notes",
      text: "Keep every subject organised.",
    },
    {
      icon: "🧠",
      title: "Quizzes",
      text: "Test what you actually know.",
    },
    {
      icon: "🎯",
      title: "Weakness Tracking",
      text: "Know what needs more work.",
    },
    {
      icon: "🗂",
      title: "Flashcards",
      text: "Review the concepts that matter.",
    },
    {
      icon: "⏱",
      title: "Study Timer",
      text: "Make focused sessions easier.",
    },
    {
      icon: "📅",
      title: "Calendar",
      text: "Never lose track of deadlines.",
    },
    {
      icon: "👥",
      title: "Study Groups",
      text: "Study with your people.",
    },
  ];

  return (
    <section className="section" id="features">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">What KELLY can do</span>

          <h2>Everything your study routine was missing</h2>

          <p>
            Every feature feeds the same brain. Nothing here is a standalone
            tool — it all connects back to what KELLY knows about you.
          </p>
        </div>

        <div className="bento-grid">
          {features.map((feature) => (
            <article
              className={`landing-feature-card ${
                feature.large ? "large" : ""
              }`}
              key={feature.title}
            >
              <div className="landing-feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StudyTogether() {
  const navigate = useNavigate();

  return (
    <section className="social-band" id="study-together">
      <div className="container">
        <div className="social-inner">
          <div className="social-copy">
            <span className="eyebrow gold social-eyebrow">
              Study together
            </span>

            <h2>Studying alone is optional.</h2>

            <p>
              Add friends, build a study group, and turn revision into
              something you actually look forward to. It's a light layer on
              top of studying — not another social feed to scroll.
            </p>

            <div className="social-feature-grid">
              <div className="social-feature">
                <span>👥</span>
                <div>
                  <strong>Study with friends</strong>
                  <p>See who's studying and stay motivated.</p>
                </div>
              </div>

              <div className="social-feature">
                <span>🏆</span>
                <div>
                  <strong>Friendly challenges</strong>
                  <p>Challenge your friends to quick quizzes.</p>
                </div>
              </div>

              <div className="social-feature">
                <span>🔥</span>
                <div>
                  <strong>Keep your streak</strong>
                  <p>Make showing up part of the routine.</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-white btn-lg"
              onClick={() => navigate({ to: "/auth" })}
            >
              Get Started
            </button>
          </div>

          <div className="social-visual">
            <div className="lb-preview">
              <div className="lbp-head">This week</div>

              <div className="lb-preview-row">
                <span className="lb-rank">1</span>
                <div className="lb-avatar">S</div>
                <strong>Sarah</strong>
                <span className="lb-xp">640 XP</span>
              </div>

              <div className="lb-preview-row">
                <span className="lb-rank">2</span>
                <div className="lb-avatar">Y</div>
                <strong>You</strong>
                <span className="lb-xp">580 XP</span>
              </div>

              <div className="lb-preview-row">
                <span className="lb-rank">3</span>
                <div className="lb-avatar">A</div>
                <strong>Alex</strong>
                <span className="lb-xp">420 XP</span>
              </div>
            </div>

            <div className="challenge-preview">
              <div className="cp-top">
                <div className="cp-avatar">S</div>
                <strong>Sarah</strong>
              </div>

              <p>challenged you to a Business Quiz</p>

              <div className="cp-meta">10 Questions</div>

              <button
                type="button"
                className="btn btn-coral btn-sm btn-block"
                onClick={() => navigate({ to: "/auth" })}
              >
                Accept Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="cta-band">
      <div className="container">
        <div className="cta-mascot-row">
          <KellyAvatar mood="celebrating" theme="gold" size={120} />
        </div>

        <h2>Ready to actually get your studying figured out?</h2>

        <p>
          Free to start. No credit card. Just bring your first lecture or set
          of notes.
        </p>

        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={() => navigate({ to: "/auth" })}
        >
          Meet KELLY
        </button>
      </div>
    </section>
  );
}

function LandingFooter() {
  const navigate = useNavigate();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-brand-row">
              <KellyAvatar mood="happy" theme="gold" size={30} />
              <span className="logo-word">KELLY</span>
            </div>

            <p>
              Your personal AI study companion — for lectures, notes, quizzes,
              and everything in between.
            </p>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <h4>Product</h4>

              <button type="button" onClick={() => scrollToSection("how-it-works")}>
                How It Works
              </button>

              <button type="button" onClick={() => scrollToSection("features")}>
                Features
              </button>

              <button type="button" onClick={() => scrollToSection("study-together")}>
                Study Together
              </button>
            </div>

            <div className="footer-col">
              <h4>Account</h4>

              <button type="button" onClick={() => navigate({ to: "/auth" })}>
                Login
              </button>

              <button type="button" onClick={() => navigate({ to: "/auth" })}>
                Get Started
              </button>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <button type="button">About</button>
              <button type="button">Privacy</button>
              <button type="button">Terms</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © 2026 KELLY. Made for students who'd rather be doing anything
            else.
          </span>

          <span>Built with 🔔 + 🐾</span>
        </div>
      </div>
    </footer>
  );
}

export function LandingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="kelly-landing">
      <LandingNav />
      <LandingHero />
      <WhoIsKelly />
      <HowItWorks />
      <Features />
      <StudyTogether />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
}
