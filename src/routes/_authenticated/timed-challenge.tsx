import { useEffect, useRef, useState } from "react";
import { Clock3, Zap } from "lucide-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useKellyXP } from "@/components/kelly/app-shell";

const QUESTIONS = [
  {
    id: "cell",
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Cell wall"],
    correctIndex: 1,
  },
  {
    id: "math",
    question: "What is 12 × 8?",
    options: ["86", "94", "96", "108"],
    correctIndex: 2,
  },
  {
    id: "planet",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Mercury"],
    correctIndex: 1,
  },
  {
    id: "photosynthesis",
    question: "What gas do plants primarily absorb during photosynthesis?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
    correctIndex: 2,
  },
  {
    id: "hexagon",
    question: "How many sides does a hexagon have?",
    options: ["5", "6", "7", "8"],
    correctIndex: 1,
  },
];

const ROUND_SECONDS = 30;
const RETURN_COUNTDOWN_SECONDS = 10;
const POINTS_PER_CORRECT = 10;
const LAST_GAME_STORAGE_KEY = "kelly-last-game";

type Phase = "main" | "main-end" | "retry" | "retry-end";

type Toast = {
  id: number;
  text: string;
};

type Question = (typeof QUESTIONS)[number];

function shuffleQuestions() {
  return [...QUESTIONS].sort(() => Math.random() - 0.5);
}

export function TimedChallengePage() {
  const navigate = useNavigate();
  const { addXP } = useKellyXP();

  const [phase, setPhase] = useState<Phase>("main");
  const [seconds, setSeconds] = useState(ROUND_SECONDS);
  const [returnCountdown, setReturnCountdown] = useState(
    RETURN_COUNTDOWN_SECONDS,
  );

  const [points, setPoints] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [question, setQuestion] = useState<Question>(() => QUESTIONS[0]);
  const [sessionXP, setSessionXP] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const questionPoolRef = useRef(shuffleQuestions());
  const questionIndexRef = useRef(0);

  const retryQueueRef = useRef<Question[]>([]);
  const retryIndexRef = useRef(0);

  const correctRef = useRef(0);
  const totalAnsweredRef = useRef(0);
  const pointsRef = useRef(0);

  const xpAwardedRef = useRef(false);
  const phaseRef = useRef<Phase>("main");

  const updatePhase = (nextPhase: Phase) => {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  };

  const nextMainQuestion = () => {
    questionIndexRef.current += 1;

    if (questionIndexRef.current >= questionPoolRef.current.length) {
      return;
    }

    setQuestion(questionPoolRef.current[questionIndexRef.current]);
    setQuestionNumber(questionIndexRef.current + 1);
  };

  const nextRetryQuestion = () => {
    const queue = retryQueueRef.current;

    if (queue.length === 0) {
      finishFinalSession();
      return;
    }

    if (retryIndexRef.current >= queue.length) {
      retryIndexRef.current = 0;
    }

    setQuestion(queue[retryIndexRef.current]);
    setQuestionNumber(retryIndexRef.current + 1);
  };

  const awardFinalXP = () => {
    if (xpAwardedRef.current) return;

    xpAwardedRef.current = true;

    const finalCorrect = correctRef.current;
    const xp = finalCorrect * POINTS_PER_CORRECT;

    setSessionXP(xp);

    window.localStorage.setItem(
      LAST_GAME_STORAGE_KEY,
      JSON.stringify({
        name: "Timed Challenge",
        points: pointsRef.current,
      }),
    );

    if (xp > 0) {
      addXP(xp);

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
    }
  };

  const finishFinalSession = () => {
    awardFinalXP();
    updatePhase("retry-end");
    setReturnCountdown(RETURN_COUNTDOWN_SECONDS);
  };

  const finishMainRound = () => {
    if (phaseRef.current !== "main") return;

    if (retryQueueRef.current.length === 0) {
      awardFinalXP();
    }

    updatePhase("main-end");
    setReturnCountdown(RETURN_COUNTDOWN_SECONDS);
  };

  const continueToRetry = () => {
    if (retryQueueRef.current.length === 0) {
      finishFinalSession();
      return;
    }

    retryIndexRef.current = 0;

    setSeconds(ROUND_SECONDS);
    setQuestionNumber(1);

    updatePhase("retry");
    nextRetryQuestion();
  };

  const handleAnswer = (index: number) => {
    const currentPhase = phaseRef.current;

    if (currentPhase !== "main" && currentPhase !== "retry") {
      return;
    }

    if (seconds <= 0) return;

    totalAnsweredRef.current += 1;
    setTotalAnswered(totalAnsweredRef.current);

    const isCorrect = index === question.correctIndex;

    if (currentPhase === "main") {
      if (isCorrect) {
        correctRef.current += 1;
        pointsRef.current += POINTS_PER_CORRECT;

        setCorrect(correctRef.current);
        setPoints(pointsRef.current);
      } else if (
        !retryQueueRef.current.some(
          (item) => item.id === question.id,
        )
      ) {
        retryQueueRef.current.push(question);
      }

      if (
        questionIndexRef.current >=
        questionPoolRef.current.length - 1
      ) {
        finishMainRound();
        return;
      }

      nextMainQuestion();
      return;
    }

    const currentRetryQuestion =
      retryQueueRef.current[retryIndexRef.current];

    if (!currentRetryQuestion) {
      finishFinalSession();
      return;
    }

    if (isCorrect) {
      correctRef.current += 1;
      pointsRef.current += POINTS_PER_CORRECT;

      setCorrect(correctRef.current);
      setPoints(pointsRef.current);

      retryQueueRef.current = retryQueueRef.current.filter(
        (item) => item.id !== question.id,
      );

      if (retryQueueRef.current.length === 0) {
        finishFinalSession();
        return;
      }

      retryIndexRef.current = 0;
      nextRetryQuestion();
    } else {
      retryIndexRef.current += 1;

      if (
        retryIndexRef.current >=
        retryQueueRef.current.length
      ) {
        retryIndexRef.current = 0;
      }

      nextRetryQuestion();
    }
  };

  useEffect(() => {
    if (phase !== "main" && phase !== "retry") {
      return;
    }

    const interval = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(interval);

          if (phaseRef.current === "main") {
            finishMainRound();
          } else if (phaseRef.current === "retry") {
            finishFinalSession();
          }

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== "main-end" && phase !== "retry-end") {
      return;
    }

    const interval = window.setInterval(() => {
      setReturnCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          navigate({ to: "/games" });
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [phase, navigate]);

  const progress =
    phase === "main" || phase === "retry"
      ? (seconds / ROUND_SECONDS) * 100
      : 0;

  const renderEndSession = (isFinal: boolean) => {
    const hasRetry =
      retryQueueRef.current.length > 0 && !isFinal;

    return (
      <div className="kelly-flashcards-complete">
        <div
          className="kelly-flashcards-complete-icon"
          aria-hidden="true"
        >
          🎉
        </div>

        <h2>Session complete!</h2>

        <p>
          {isFinal
            ? `All questions answered. You got ${correct}/${QUESTIONS.length} questions correctly.`
            : `All ${QUESTIONS.length} questions answered. You got ${correct}/${QUESTIONS.length} questions correctly.`}
        </p>

        <div className="kelly-flashcards-results">
          <div className="kelly-flashcards-result-card">
            <span>Score</span>
            <strong>{points} pts</strong>
          </div>

          <div className="kelly-flashcards-result-card">
            <span>XP earned</span>
            <strong className="xp">
              {isFinal ? `+${sessionXP} XP` : "Pending"}
            </strong>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          <button
            type="button"
            className="kelly-flashcards-complete-button"
            onClick={() => navigate({ to: "/games" })}
          >
            Return
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                marginLeft: "8px",
                gap: "4px",
              }}
            >
              <Clock3 size={14} strokeWidth={2.2} />
              {returnCountdown}s
            </span>
          </button>

          {hasRetry && (
            <button
              type="button"
              className="kelly-flashcards-complete-button"
              onClick={continueToRetry}
            >
              Continue to Retry Round
            </button>
          )}
        </div>

        {hasRetry && (
          <p
            style={{
              marginTop: "14px",
              color: "#8888aa",
              fontSize: "13px",
            }}
          >
            {retryQueueRef.current.length} question
            {retryQueueRef.current.length === 1 ? "" : "s"} to retry.
          </p>
        )}
      </div>
    );
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

        <h1>Timed Challenge</h1>
      </div>

      {phase === "main" || phase === "retry" ? (
        <>
          <div className="kelly-timed-challenge-stats">
            <span
              className="kelly-timed-challenge-timer"
              style={{
                color:
                  seconds <= 10
                    ? "#ef4444"
                    : "#f8f7fb",
              }}
            >
              <Clock3
                size={17}
                strokeWidth={2.3}
                style={{
                  color:
                    seconds <= 10
                      ? "#ef4444"
                      : "#7c5cff",
                }}
              />
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
              className="kelly-timed-challenge-progress-fill"
              style={{
                width: `${progress}%`,
                background:
                  seconds <= 10
                    ? "#ef4444"
                    : "#7c5cff",
              }}
            />
          </div>

          <div className="kelly-quick-quiz-content">
            <div className="kelly-quick-quiz-question">
              <h2>{question.question}</h2>

              <p
                style={{
                  marginTop: "10px",
                  color: "#8888aa",
                  fontSize: "13px",
                }}
              >
                Question {questionNumber} of{" "}
                {phase === "main"
                  ? QUESTIONS.length
                  : retryQueueRef.current.length}
              </p>
            </div>

            <div className="kelly-quick-quiz-options">
              {question.options.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  className="kelly-quick-quiz-option"
                  onClick={() => handleAnswer(index)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : phase === "main-end" ? (
        renderEndSession(false)
      ) : (
        renderEndSession(true)
      )}

      <div
        className="kelly-timed-challenge-toasts"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="kelly-timed-challenge-toast"
          >
            <Zap size={14} strokeWidth={2.3} />
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export const Route = createFileRoute(
  "/_authenticated/timed-challenge",
)({
  component: TimedChallengePage,
});
