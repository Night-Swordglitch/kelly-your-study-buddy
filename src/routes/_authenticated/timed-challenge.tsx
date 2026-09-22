import { useEffect, useRef, useState } from "react";
import { Clock3, Zap } from "lucide-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
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

const ROUND_SECONDS = 30;
const POINTS_PER_CORRECT = 10;
const LAST_GAME_STORAGE_KEY = "kelly-last-game";

type Toast = {
  id: number;
  text: string;
};

function shuffleQuestions() {
  return [...QUESTIONS].sort(() => Math.random() - 0.5);
}

export function TimedChallengePage() {
  const navigate = useNavigate();
  const { addXP } = useKellyXP();

  const [seconds, setSeconds] = useState(ROUND_SECONDS);
  const [points, setPoints] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [question, setQuestion] = useState(() => QUESTIONS[0]);
  const [finished, setFinished] = useState(false);
  const [sessionXP, setSessionXP] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const questionPoolRef = useRef(shuffleQuestions());
  const questionIndexRef = useRef(0);

  const correctRef = useRef(0);
  const totalAnsweredRef = useRef(0);
  const pointsRef = useRef(0);
  const finishedRef = useRef(false);

  const nextQuestion = () => {
    questionIndexRef.current += 1;

    if (questionIndexRef.current >= questionPoolRef.current.length) {
      questionPoolRef.current = shuffleQuestions();
      questionIndexRef.current = 0;
    }

    setQuestion(questionPoolRef.current[questionIndexRef.current]);
  };

  const finishGame = () => {
    if (finishedRef.current) return;

    finishedRef.current = true;

    const finalCorrect = correctRef.current;
    const finalAnswered = totalAnsweredRef.current;
    const finalPoints = pointsRef.current;

    const xp = finalCorrect === 0 ? 0 : finalCorrect * POINTS_PER_CORRECT;

    setSessionXP(xp);
    setFinished(true);

    if (xp > 0) {
      addXP(xp);

      window.localStorage.setItem(
        LAST_GAME_STORAGE_KEY,
        JSON.stringify({
          name: "Timed Challenge",
          points: finalPoints,
        }),
      );

      const firstToastId = Date.now();
      const secondToastId = firstToastId + 1;

      setToasts([
        {
          id: firstToastId,
          text: `Game over! +${xp} XP`,
        },
        {
          id: secondToastId,
          text: `+${xp} XP · Timed Challenge complete`,
        },
      ]);

      window.setTimeout(() => {
        setToasts([]);
      }, 4200);
    } else {
      window.localStorage.setItem(
        LAST_GAME_STORAGE_KEY,
        JSON.stringify({
          name: "Timed Challenge",
          points: 0,
        }),
      );
    }

    setCorrect(finalCorrect);
    setTotalAnswered(finalAnswered);
    setPoints(finalPoints);
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          finishGame();
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const handleAnswer = (index: number) => {
    if (finishedRef.current || seconds <= 0) return;

    totalAnsweredRef.current += 1;

    setTotalAnswered(totalAnsweredRef.current);

    if (index === question.correctIndex) {
      correctRef.current += 1;
      pointsRef.current += POINTS_PER_CORRECT;

      setCorrect(correctRef.current);
      setPoints(pointsRef.current);
    }

    nextQuestion();
  };

  const progress = (seconds / ROUND_SECONDS) * 100;

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
        <h1>Timed Challenge</h1>
      </div>

      {!finished ? (
        <>
          <div className="kelly-timed-challenge-stats">
            <span className="kelly-timed-challenge-timer" style={{ color: seconds <= 10 ? "#ef4444" : "#f8f7fb" }}>
              <Clock3 size={17} strokeWidth={2.3} style={{ color: seconds <= 10 ? "#ef4444" : "#7c5cff" }} />
              {seconds}s
            </span>

            <span className="kelly-timed-challenge-points">
              {points} pts
            </span>
          </div>

          <div
            className="kelly-timed-challenge-progress"
            aria-label={`${seconds} seconds remaining`}
          >
            <div
              className="kelly-timed-challenge-progress-fill" style={{ width: `${progress}%`, background: seconds <= 10 ? "#ef4444" : "#7c5cff" }}
              style={{ width: `${progress}%`, background: seconds <= 10 ? "#ef4444" : "#7c5cff" }}
            />
          </div>

          <div className="kelly-quick-quiz-content">
            <div className="kelly-quick-quiz-question">
              <h2>{question.question}</h2>
            </div>

            <div className="kelly-quick-quiz-options">
              {question.options.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  className="kelly-quick-quiz-option"
                  onClick={() => handleAnswer(index)}
                  disabled={finished}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="kelly-flashcards-complete">
          <div
            className="kelly-flashcards-complete-icon"
            aria-hidden="true"
          >
            🎉
          </div>

          <h2>Session complete!</h2>

          <p>
            {totalAnswered === 0
              ? "Time's up! You didn't answer any questions."
              : `Time's up! You answered ${correct}/${totalAnswered} questions correctly.`}
          </p>

          <div className="kelly-flashcards-results">
            <div className="kelly-flashcards-result-card">
              <span>Score</span>
              <strong>{points} pts</strong>
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
      )}

      <div
        className="kelly-timed-challenge-toasts"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="kelly-timed-challenge-toast">
            <Zap size={14} strokeWidth={2.3} />
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export const Route = createFileRoute("/_authenticated/timed-challenge")({
  component: TimedChallengePage,
});



