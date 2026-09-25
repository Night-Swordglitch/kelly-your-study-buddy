import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings/customisation")({
  component: CustomisationPage,
});

function CustomisationPage() {
  const navigate = useNavigate();

  return (
    <div className="kelly-customisation-page">
      <header className="kelly-customisation-header">
        <div>
          <h1>Customisation</h1>
          <p>
            Make KELLY feel like yours. Change the look, feel, and behaviour of
            your study space.
          </p>
        </div>
      </header>

      <main className="kelly-customisation-content">
        <section className="kelly-customisation-section">
          <div className="kelly-customisation-section-header">
            <h2>Appearance</h2>
            <p>Choose how KELLY looks and feels.</p>
          </div>

          <div className="kelly-customisation-card">
            <button
              type="button"
              className="kelly-customisation-row kelly-customisation-clickable"
              onClick={() => navigate({ to: "/settings/theme" })}
            >
              <div>
                <strong>Theme</strong>
                <span>
                  Choose the overall visual style of KELLY.
                </span>
              </div>

              <div className="kelly-customisation-row-right">
                <span className="kelly-customisation-current">
                  KELLY Original
                </span>
                <span className="kelly-customisation-chevron">›</span>
              </div>
            </button>

            <div className="kelly-customisation-divider" />

            <div className="kelly-customisation-row">
              <div>
                <strong>Accent colour</strong>
                <span>
                  Choose the colour used for highlights and actions.
                </span>
              </div>

              <div className="kelly-customisation-placeholder">
                Coming soon
              </div>
            </div>
          </div>
        </section>

        <section className="kelly-customisation-section">
          <div className="kelly-customisation-section-header">
            <h2>Typography</h2>
            <p>Adjust how text looks throughout the app.</p>
          </div>

          <div className="kelly-customisation-card">
            <div className="kelly-customisation-row">
              <div>
                <strong>Font family</strong>
                <span>Choose the typeface used by KELLY.</span>
              </div>

              <div className="kelly-customisation-placeholder">
                Coming soon
              </div>
            </div>

            <div className="kelly-customisation-divider" />

            <div className="kelly-customisation-row">
              <div>
                <strong>Font size</strong>
                <span>Make interface text smaller or larger.</span>
              </div>

              <div className="kelly-customisation-placeholder">
                Coming soon
              </div>
            </div>
          </div>
        </section>

        <section className="kelly-customisation-section">
          <div className="kelly-customisation-section-header">
            <h2>Interface</h2>
            <p>Fine-tune how the KELLY interface behaves.</p>
          </div>

          <div className="kelly-customisation-card">
            <div className="kelly-customisation-row">
              <div>
                <strong>Interface preferences</strong>
                <span>
                  More controls for layout, animations, spacing, and other
                  details will live here.
                </span>
              </div>

              <div className="kelly-customisation-placeholder">
                Coming soon
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
