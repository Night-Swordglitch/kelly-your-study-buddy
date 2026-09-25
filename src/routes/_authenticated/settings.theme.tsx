import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useKellyTheme } from "@/components/kelly/app-shell";

export const Route = createFileRoute("/_authenticated/settings/theme")({
  component: ThemePage,
});

function ThemePage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useKellyTheme();

  return (
    <div className="kelly-theme-page">
      <header className="kelly-theme-header">
        <button
          type="button"
          className="kelly-theme-back"
          onClick={() => navigate({ to: "/settings/customisation" })}
        >
          <span aria-hidden="true">←</span>
          <span>Customisation</span>
        </button>

        <div className="kelly-theme-title">
          <h1>Theme</h1>
          <p>Choose the overall visual style of KELLY.</p>
        </div>
      </header>

      <main className="kelly-theme-content">
        <section className="kelly-theme-grid">
          <button
            type="button"
            className={`kelly-theme-card${
              theme === "original"
                ? " kelly-theme-card-selected"
                : ""
            }`}
            onClick={() => setTheme("original")}
          >
            <div className="kelly-theme-preview kelly-theme-preview-original">
              <div className="kelly-theme-preview-sidebar" />
              <div className="kelly-theme-preview-content">
                <div className="kelly-theme-preview-line long" />
                <div className="kelly-theme-preview-line short" />
                <div className="kelly-theme-preview-card" />
                <div className="kelly-theme-preview-card small" />
              </div>
            </div>

            <div className="kelly-theme-card-info">
              <div>
                <strong>KELLY Original</strong>
                <span>Purple-black</span>
              </div>

              {theme === "original" ? (
                <span className="kelly-theme-check" aria-label="Selected">
                  ✓
                </span>
              ) : null}
            </div>
          </button>

          <button
            type="button"
            className={`kelly-theme-card${
              theme === "aurora"
                ? " kelly-theme-card-selected"
                : ""
            }`}
            onClick={() => setTheme("aurora")}
          >
            <div className="kelly-theme-preview kelly-theme-preview-aurora">
              <div className="kelly-theme-preview-sidebar" />
              <div className="kelly-theme-preview-content">
                <div className="kelly-theme-preview-line long" />
                <div className="kelly-theme-preview-line short" />
                <div className="kelly-theme-preview-card" />
                <div className="kelly-theme-preview-card small" />
              </div>
            </div>

            <div className="kelly-theme-card-info">
              <div>
                <strong>Aurora Midnight</strong>
                <span>Blue / aurora</span>
              </div>

              {theme === "aurora" ? (
                <span className="kelly-theme-check" aria-label="Selected">
                  ✓
                </span>
              ) : null}
            </div>
          </button>

          <button
            type="button"
            className={`kelly-theme-card${
              theme === "monochrome"
                ? " kelly-theme-card-selected"
                : ""
            }`}
            onClick={() => setTheme("monochrome")}
          >
            <div className="kelly-theme-preview kelly-theme-preview-monochrome">
              <div className="kelly-theme-preview-sidebar" />
              <div className="kelly-theme-preview-content">
                <div className="kelly-theme-preview-line long" />
                <div className="kelly-theme-preview-line short" />
                <div className="kelly-theme-preview-card" />
                <div className="kelly-theme-preview-card small" />
              </div>
            </div>

            <div className="kelly-theme-card-info">
              <div>
                <strong>Monochrome</strong>
                <span>Black / white</span>
              </div>

              {theme === "monochrome" ? (
                <span className="kelly-theme-check" aria-label="Selected">
                  ✓
                </span>
              ) : null}
            </div>
          </button>

          <button
            type="button"
            className={`kelly-theme-card${
              theme === "rose-eclipse"
                ? " kelly-theme-card-selected"
                : ""
            }`}
            onClick={() => setTheme("rose-eclipse")}
          >
            <div className="kelly-theme-preview kelly-theme-preview-rose">
              <div className="kelly-theme-preview-sidebar" />
              <div className="kelly-theme-preview-content">
                <div className="kelly-theme-preview-line long" />
                <div className="kelly-theme-preview-line short" />
                <div className="kelly-theme-preview-card" />
                <div className="kelly-theme-preview-card small" />
              </div>
            </div>

            <div className="kelly-theme-card-info">
              <div>
                <strong>Rose Eclipse</strong>
                <span>Rose / eclipse</span>
              </div>

              {theme === "rose-eclipse" ? (
                <span className="kelly-theme-check" aria-label="Selected">
                  ✓
                </span>
              ) : null}
            </div>
          </button>
        </section>
      </main>
    </div>
  );
}



