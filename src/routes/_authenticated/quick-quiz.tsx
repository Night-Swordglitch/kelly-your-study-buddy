import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { useKellyXP } from "@/components/kelly/app-shell";

const QUESTIONS = [
  {
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Cell wall"],
    correctIndex: 1,
  },
  {
    question: "What is 12 × 8?",
    options: ["86", "94", "96", "108"],
    correctIndex: 2,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Mercury"],
    correctIndex: 1,
  },
  {
    question: "What gas do plants primarily absorb during photosynthesis?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
    correctIndex: 2,
  },
  {
    question: "How many sides does a hexagon have?",
    options: ["5", "6", "7", "8"],
    correctIndex: 1,
  },
];

const LAST_GAME_STORAGE_KEY = "kelly-last-game";

type Toast = {
  id: number;
  text: string;
};

export function QuickQuizPage() {
  const navigate = useNavigate();
  const { addXP } = useKellyXP();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const currentQuestion = QUESTIONS[currentIndex];
  const answered = selectedIndex !== null;

  const handleAnswer = (index: number) => {
    if (answered || finished) return;

    setSelectedIndex(index);

    if (index === currentQuestion.correctIndex) {
      setScore((current) => current + 1);
    }
  };

  const finishGame = (completedScore: number) => {
    const xp = Math.max(10, 20 + completedScore * 10);

    addXP(xp);

    window.localStorage.setItem(
      LAST_GAME_STORAGE_KEY,
      JSON.stringify({
        name: "Quick Quiz",
        points: xp,
      }),
    );

    setFinalScore(completedScore);
    setSessionXP(xp);
    setFinished(true);

    const firstToastId = Date.now();
    const secondToastId = firstToastId + 1;

    setToasts([
      {
        id: firstToastId,
        text: `Game over! +${xp} XP`,
      },
      {
        id: secondToastId,
        text: `+${xp} XP · Quick Quiz complete`,
      },
    ]);

    window.setTimeout(() => {
      setToasts([]);
    }, 4200);
  };

  const handleNext = () => {
    if (!answered || finished) return;

    const isLastQuestion = currentIndex === QUESTIONS.length - 1;

    if (isLastQuestion) {
      const completedScore =
        score + (selectedIndex === currentQuestion.correctIndex ? 1 : 0);

      finishGame(completedScore);
      return;
    }

    setCurrentIndex((current) => current + 1);
    setSelectedIndex(null);
  };

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
        <h1>Quick Quiz</h1>
      </div>

      {finished ? (
        <div className="kelly-flashcards-complete">
          <div className="kelly-flashcards-complete-icon" aria-hidden="true">
            🎉
          </div>

          <h2>Session complete!</h2>

          <p>
            You answered {finalScore}/{QUESTIONS.length} questions correctly.
          </p>

          <div className="kelly-flashcards-results">
            <div className="kelly-flashcards-result-card">
              <span>Score</span>
              <strong>
                {finalScore}/{QUESTIONS.length}
              </strong>
            </div>

            <div className="kelly-flashcards-result-card">
              <span>XP earned</span>
              <strong className="xp">+{sessionXP} XP</strong>
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
      ) : (
        <>
          <div className="kelly-quick-quiz-stats">
            <span>
              {currentIndex + 1}/{QUESTIONS.length}
            </span>

            <span className="kelly-quick-quiz-score">
              Score: {score}
            </span>
          </div>

          <div className="kelly-quick-quiz-content">
            <div className="kelly-quick-quiz-question">
              <h2>{currentQuestion.question}</h2>
            </div>

            <div className="kelly-quick-quiz-options">
              {currentQuestion.options.map((option, index) => {
                const isCorrect = index === currentQuestion.correctIndex;
                const isSelected = index === selectedIndex;
                const isWrongSelected =
                  answered && isSelected && !isCorrect;

                const className = [
                  "kelly-quick-quiz-option",
                  answered && isCorrect ? "correct" : "",
                  isWrongSelected ? "wrong" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <button
                    key={option}
                    type="button"
                    className={className}
                    onClick={() => handleAnswer(index)}
                    disabled={answered}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {answered && (
              <button
                type="button"
                className="kelly-quick-quiz-next"
                onClick={handleNext}
              >
                Next
              </button>
            )}
          </div>
        </>
      )}

      <div
        className="kelly-quick-quiz-toasts"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="kelly-quick-quiz-toast">
            <Zap size={14} strokeWidth={2.3} />
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export const Route = createFileRoute("/_authenticated/quick-quiz")({
  component: QuickQuizPage,
});
