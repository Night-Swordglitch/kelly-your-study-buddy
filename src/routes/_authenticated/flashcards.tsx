import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useKellyXP } from "@/components/kelly/app-shell";

const FLASHCARDS = [
  {
    question: "Mitosis",
    answer: "Cell division that produces two genetically identical daughter cells.",
  },
  {
    question: "Photosynthesis",
    answer: "The process plants use to convert light energy into chemical energy.",
  },
  {
    question: "Newton's First Law",
    answer: "An object remains at rest or in uniform motion unless acted on by a net force.",
  },
  {
    question: "Mitochondria",
    answer: "Organelles that produce most of a cell's usable energy.",
  },
  {
    question: "Osmosis",
    answer: "The movement of water across a selectively permeable membrane.",
  },
  {
    question: "DNA",
    answer: "The molecule that stores genetic information in living organisms.",
  },
];

const XP_PER_CARD = 10;
const LAST_GAME_STORAGE_KEY = "kelly-last-game";

export function FlashcardsPage() {
  const navigate = useNavigate();
  const { addXP } = useKellyXP();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentCard = FLASHCARDS[currentIndex];
  const progress = currentIndex + 1;

  const finishSession = (finalKnown: number, finalXP: number) => {
    window.localStorage.setItem(
      LAST_GAME_STORAGE_KEY,
      JSON.stringify({
        name: "Flashcards",
        points: finalXP,
      }),
    );

    setKnown(finalKnown);
    setSessionXP(finalXP);
    setFinished(true);
  };

  const advance = (wasKnown: boolean) => {
    const nextKnown = known + (wasKnown ? 1 : 0);
    const nextXP = sessionXP + (wasKnown ? XP_PER_CARD : 0);

    if (wasKnown) {
      addXP(XP_PER_CARD);
    }

    if (currentIndex === FLASHCARDS.length - 1) {
      finishSession(nextKnown, nextXP);
      return;
    }

    setKnown(nextKnown);
    setSessionXP(nextXP);
    setCurrentIndex((index) => index + 1);
    setFlipped(false);
  };

  if (finished) {
    return (
      <section className="kelly-flashcards-page">
        <div className="kelly-flashcards-header">
          <button
            type="button"
            className="kelly-flashcards-back"
            onClick={() => navigate({ to: "/games" })}
          >
            ← Back
          </button>

          <h1>Flashcards</h1>
        </div>

        <div className="kelly-flashcards-complete">
          <div className="kelly-flashcards-complete-icon">🎉</div>

          <h2>Session complete!</h2>

          <p>You finished all {FLASHCARDS.length} flashcards.</p>

          <div className="kelly-flashcards-results">
            <div>
              <span>Known</span>
              <strong>{known} / {FLASHCARDS.length}</strong>
            </div>

            <div>
              <span>XP earned</span>
              <strong>+{sessionXP} XP</strong>
            </div>
          </div>

          <button
            type="button"
            className="kelly-flashcards-complete-button"
            onClick={() => navigate({ to: "/games" })}
          >
            Back to Games
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="kelly-flashcards-page">
      <div className="kelly-flashcards-header">
        <div className="kelly-flashcards-title-row">
          <button
            type="button"
            className="kelly-flashcards-back"
            onClick={() => navigate({ to: "/games" })}
          >
            ← Back
          </button>

          <h1>Flashcards</h1>
        </div>
      </div>

      <div className="kelly-flashcards-stats">
        <span>
          {progress} / {FLASHCARDS.length}
        </span>

        <span className="kelly-flashcards-known">
          ✓ {known} known
        </span>
      </div>

      <div className="kelly-flashcards-stage">
        <button
          type="button"
          className={`kelly-flashcard${flipped ? " flipped" : ""}`}
          onClick={() => setFlipped((value) => !value)}
          aria-label={flipped ? "Answer card" : "Question card, tap to flip"}
        >
          {!flipped ? (
            <>
              <span className="kelly-flashcard-label">
                QUESTION — TAP TO FLIP
              </span>

              <span className="kelly-flashcard-question">
                {currentCard.question}
              </span>
            </>
          ) : (
            <>
              <span className="kelly-flashcard-label">ANSWER</span>

              <span className="kelly-flashcard-answer">
                {currentCard.answer}
              </span>
            </>
          )}
        </button>

        {flipped && (
          <div className="kelly-flashcard-actions">
            <button
              type="button"
              className="kelly-flashcard-action learning"
              onClick={() => advance(false)}
            >
              Still learning
            </button>

            <button
              type="button"
              className="kelly-flashcard-action known"
              onClick={() => advance(true)}
            >
              Got it!
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export const Route = createFileRoute("/_authenticated/flashcards")({
  component: FlashcardsPage,
});
