import { useState } from "react";
import { useKellyXP } from "@/components/kelly/app-shell";

type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

type Quiz = {
  id: string;
  title: string;
  subject: string;
  questions: QuizQuestion[];
};

type QuizHistory = {
  title: string;
  date: string;
  score: number;
  total: number;
  xp: number;
};

const HISTORY_KEY = "kelly-quiz-history";

const QUIZZES: Quiz[] = [
  {
    id: "biology-basics",
    title: "Biology Basics",
    subject: "Biology",
    questions: [
      {
        question: "Which organelle is known as the powerhouse of the cell?",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Cell membrane"],
        correctIndex: 1,
      },
      {
        question:
          "What process do plants use to convert light energy into chemical energy?",
        options: [
          "Respiration",
          "Digestion",
          "Photosynthesis",
          "Fermentation",
        ],
        correctIndex: 2,
      },
      {
        question:
          "Which molecule carries genetic information in most living organisms?",
        options: ["DNA", "Glucose", "ATP", "Water"],
        correctIndex: 0,
      },
      {
        question: "Which blood cells help defend the body against infection?",
        options: [
          "Red blood cells",
          "Platelets",
          "White blood cells",
          "Plasma cells",
        ],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "algebra-review",
    title: "Algebra Review",
    subject: "Mathematics",
    questions: [
      {
        question: "What is x if 3x + 6 = 21?",
        options: ["3", "5", "7", "9"],
        correctIndex: 1,
      },
      {
        question: "Simplify: 4x + 3x - 2.",
        options: ["7x - 2", "x + 1", "7x + 2", "12x - 2"],
        correctIndex: 0,
      },
      {
        question: "If y = 2x + 1, what is y when x = 4?",
        options: ["7", "8", "9", "10"],
        correctIndex: 2,
      },
    ],
  },
];

const SEED_HISTORY: QuizHistory[] = [
  {
    title: "Biology Basics",
    date: "2026-09-12",
    score: 3,
    total: 4,
    xp: 60,
  },
  {
    title: "Algebra Review",
    date: "2026-09-10",
    score: 2,
    total: 3,
    xp: 40,
  },
];

function loadHistory(): QuizHistory[] {
  try {
    const saved = window.localStorage.getItem(HISTORY_KEY);

    if (!saved) {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(SEED_HISTORY));
      return SEED_HISTORY;
    }

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : SEED_HISTORY;
  } catch {
    return SEED_HISTORY;
  }
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 15H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9.5 4.5a3 3 0 0 0-5 2.2A3.2 3.2 0 0 0 3 9.5a3.2 3.2 0 0 0 1.8 2.9A3.2 3.2 0 0 0 7.5 17a3 3 0 0 0 2 2.2V4.5Z" />
      <path d="M14.5 4.5a3 3 0 0 1 5 2.2A3.2 3.2 0 0 1 21 9.5a3.2 3.2 0 0 1-1.8 2.9 3.2 3.2 0 0 1-2.7 4.6 3 3 0 0 1-2 2.2V4.5Z" />
      <path d="M9.5 8.5H8" />
      <path d="M14.5 8.5H16" />
      <path d="M9.5 12H7.5" />
      <path d="M14.5 12h2" />
      <path d="M12 4v16" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m7 7 10 10" />
      <path d="m17 7-10 10" />
    </svg>
  );
}

export function QuizPage() {
  const { addXP } = useKellyXP();

  const [view, setView] = useState<"list" | "create" | "taking">("list");
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [history, setHistory] = useState<QuizHistory[]>(loadHistory);
  const [notice, setNotice] = useState("");

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2200);
  };

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setQuestionIndex(0);
    setAnswers(new Array(quiz.questions.length).fill(-1));
    setView("taking");
  };

  const exitQuiz = () => {
    if (!window.confirm("Exit this quiz? Your current answers will be lost.")) {
      return;
    }

    setActiveQuiz(null);
    setQuestionIndex(0);
    setAnswers([]);
    setView("list");
  };

  const finishQuiz = () => {
    if (!activeQuiz) return;

    const score = activeQuiz.questions.reduce(
      (total, question, index) =>
        total + (answers[index] === question.correctIndex ? 1 : 0),
      0,
    );

    const xp = score * 20;
    addXP(xp);

    const result: QuizHistory = {
      title: activeQuiz.title,
      date: new Date().toISOString().slice(0, 10),
      score,
      total: activeQuiz.questions.length,
      xp,
    };

    const nextHistory = [result, ...history];

    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
    setHistory(nextHistory);

    setActiveQuiz(null);
    setQuestionIndex(0);
    setAnswers([]);
    setView("list");

    notify(`Quiz complete! +${xp} XP`);
  };

  if (view === "create") {
    return (
      <>
        <style>{styles}</style>

        <section className="qz-page">
          <header className="qz-header">
            <h1>Create Quiz</h1>
            <button
              type="button"
              className="qz-btn qz-btn-primary"
              onClick={() => setView("list")}
            >
              ← Back
            </button>
          </header>

          <div className="qz-create-panel">
            <h2>Create a new quiz</h2>
            <p>
              Generate questions from your study material and test your
              understanding.
            </p>

            <button
              type="button"
              className="qz-start-button"
              onClick={() => notify("Quiz generation coming soon")}
            >
              Generate Quiz
            </button>
          </div>

          {notice && <div className="qz-toast">{notice}</div>}
        </section>
      </>
    );
  }

  if (view === "taking" && activeQuiz) {
    const question = activeQuiz.questions[questionIndex];
    const selected = answers[questionIndex];
    const answered = selected >= 0;
    const correct = selected === question.correctIndex;
    const total = activeQuiz.questions.length;
    const last = questionIndex === total - 1;
    const progress = ((questionIndex + 1) / total) * 100;

    return (
      <>
        <style>{styles}</style>

        <section className="qz-page qz-taking">
          <header className="qz-taking-header">
            <button type="button" className="qz-exit" onClick={exitQuiz}>
              ← Exit
            </button>

            <div className="qz-taking-counter">
              Question {questionIndex + 1} of {total}
            </div>

            <div className="qz-taking-spacer" />
          </header>

          <div className="qz-progress">
            <div className="qz-progress-track">
              <div
                className="qz-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <main className="qz-question-area">
            <div className="qz-question-card">
              <div className="qz-question-number">
                QUESTION {questionIndex + 1}
              </div>

              <h1>{question.question}</h1>

              <div className="qz-answer-list">
                {question.options.map((option, index) => {
                  const isSelected = selected === index;
                  const isCorrect = index === question.correctIndex;
                  const isWrong = answered && isSelected && !isCorrect;

                  let answerClass = "qz-answer";

                  if (answered && isCorrect) {
                    answerClass += " correct";
                  } else if (isWrong) {
                    answerClass += " wrong";
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={answered}
                      className={answerClass}
                      onClick={() => {
                        if (answered) return;

                        setAnswers((current) => {
                          const next = [...current];
                          next[questionIndex] = index;
                          return next;
                        });
                      }}
                    >
                      <span className="qz-answer-letter">
                        {answered && isCorrect ? (
                          <CheckIcon />
                        ) : isWrong ? (
                          <XIcon />
                        ) : (
                          String.fromCharCode(65 + index)
                        )}
                      </span>

                      <span className="qz-answer-text">{option}</span>

                      {answered && isCorrect && (
                        <span className="qz-answer-result">✓</span>
                      )}

                      {isWrong && (
                        <span className="qz-answer-result">×</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="qz-question-footer">
                <span className="qz-question-count">
                  {answered
                    ? correct
                      ? "Correct!"
                      : "Correct answer shown"
                    : `${questionIndex + 1} / ${total}`}
                </span>

                <button
                  type="button"
                  className="qz-next-button"
                  disabled={!answered}
                  onClick={() => {
                    if (!answered) return;

                    if (last) {
                      finishQuiz();
                    } else {
                      setQuestionIndex((current) => current + 1);
                    }
                  }}
                >
                  {last ? "Finish Quiz" : "Next Question"}
                  <span>→</span>
                </button>
              </div>
            </div>
          </main>

          {notice && <div className="qz-toast">{notice}</div>}
        </section>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <section className="qz-page">
        <header className="qz-header">
          <h1>Quizzes</h1>

          <button
            type="button"
            className="qz-btn qz-btn-primary"
            onClick={() => setView("create")}
          >
            + Create Quiz
          </button>
        </header>

        <div className="qz-quiz-grid">
          {QUIZZES.map((quiz) => (
            <article className="qz-quiz-card" key={quiz.id}>
              <button
                type="button"
                className="qz-delete"
                aria-label={`Delete ${quiz.title}`}
                onClick={() =>
                  notify(
                    `${quiz.title} is a built-in quiz and cannot be deleted yet.`,
                  )
                }
              >
                <TrashIcon />
              </button>

              <h2>{quiz.title}</h2>

              <p>
                {quiz.subject} <span>·</span> {quiz.questions.length} questions
              </p>

              <button
                type="button"
                className="qz-start-button"
                onClick={() => startQuiz(quiz)}
              >
                Start Quiz
              </button>
            </article>
          ))}
        </div>

        <section className="qz-history-wrap">
          <div className="qz-history-label">HISTORY</div>

          <div className="qz-history">
            {history.map((item, index) => {
              const ratio = item.total ? item.score / item.total : 0;
              const scoreClass =
                ratio >= 0.75 ? "strong" : ratio >= 0.5 ? "mid" : "low";

              return (
                <button
                  type="button"
                  className="qz-history-row"
                  key={`${item.title}-${item.date}-${index}`}
                  onClick={() =>
                    notify(
                      `${item.title}: ${item.score}/${item.total} · +${item.xp} XP`,
                    )
                  }
                >
                  <span className="qz-history-icon">
                    <BrainIcon />
                  </span>

                  <span className="qz-history-copy">
                    <span className="qz-history-name">{item.title}</span>
                    <span className="qz-history-date">{item.date}</span>
                  </span>

                  <span className="qz-history-result">
                    <span className={`qz-history-score ${scoreClass}`}>
                      {item.score}/{item.total}
                    </span>
                    <span className="qz-history-xp">+{item.xp} XP</span>
                  </span>

                  <span className="qz-history-arrow">
                    <ChevronIcon />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {notice && <div className="qz-toast">{notice}</div>}
      </section>
    </>
  );
}

const styles = `
.qz-page {
  min-height: 100%;
  box-sizing: border-box;
  color: #f8f7fb;
  background: #0a0a0f;
  font-family: inherit;
}

.qz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 34px 38px 24px;
}

.qz-header h1 {
  margin: 0;
  color: #f8f7fb;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 750;
  letter-spacing: -0.02em;
}

.qz-btn {
  min-height: 42px;
  border: 0;
  border-radius: 999px;
  padding: 11px 20px;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 160ms ease, transform 160ms ease;
}

.qz-btn:active {
  transform: scale(.98);
}

.qz-btn-primary {
  color: #fff;
  background: #7c5cff;
}

.qz-btn-primary:hover {
  background: #8b6cff;
}

.qz-quiz-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  padding: 0 38px;
}

.qz-quiz-card {
  position: relative;
  min-width: 0;
  box-sizing: border-box;
  padding: 22px;
  background: #101016;
  border: 1px solid #24242e;
  border-radius: 16px;
}

.qz-quiz-card h2 {
  margin: 0 34px 5px 0;
  color: #f8f7fb;
  font-size: 17px;
  line-height: 1.35;
  font-weight: 700;
}

.qz-quiz-card p {
  margin: 0 0 18px;
  color: #8d8d99;
  font-size: 13px;
}

.qz-quiz-card p span {
  color: #5f5f6c;
}

.qz-delete {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: 0;
  background: transparent;
  color: #71717c;
  cursor: pointer;
}

.qz-delete svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.qz-delete:hover {
  color: #a3a3ad;
}

.qz-start-button {
  width: 100%;
  min-height: 44px;
  box-sizing: border-box;
  border: 0;
  border-radius: 11px;
  padding: 13px;
  background: rgba(139, 130, 255, 0.12);
  color: #a78bfa;
  font: inherit;
  font-size: 14.5px;
  font-weight: 700;
  cursor: pointer;
  transition: background 160ms ease;
}

.qz-start-button:hover {
  background: rgba(139, 130, 255, 0.2);
}

.qz-history-wrap {
  padding: 34px 38px 40px;
}

.qz-history-label {
  margin-bottom: 12px;
  color: #767681;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
}

.qz-history {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.qz-history-row {
  width: 100%;
  min-height: 70px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  border: 1px solid #24242e;
  border-radius: 14px;
  background: #101016;
  color: inherit;
  cursor: pointer;
  text-align: left;
  font: inherit;
  transition: border-color 160ms ease, background 160ms ease;
}

.qz-history-row:hover {
  background: #12121a;
  border-color: #30303c;
}

.qz-history-icon {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(139, 92, 246, .12);
  color: #a78bfa;
}

.qz-history-icon svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.qz-history-copy {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.qz-history-name {
  color: #f3f2f7;
  font-size: 14px;
  font-weight: 700;
}

.qz-history-date {
  color: #71717c;
  font-size: 12px;
}

.qz-history-result {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.qz-history-score {
  font-size: 15px;
  font-weight: 800;
}

.qz-history-score.strong {
  color: #42d58a;
}

.qz-history-score.mid {
  color: #f6a04d;
}

.qz-history-score.low {
  color: #e46d75;
}

.qz-history-xp {
  color: #a78bfa;
  font-size: 12px;
  font-weight: 700;
}

.qz-history-arrow {
  color: #5e5e69;
  margin-left: 4px;
}

.qz-history-arrow svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.qz-toast {
  position: fixed;
  left: 50%;
  bottom: 28px;
  z-index: 100;
  transform: translateX(-50%);
  padding: 11px 16px;
  border: 1px solid rgba(139, 130, 255, .25);
  border-radius: 12px;
  background: #17151f;
  color: #e9e5ff;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 12px 32px rgba(0,0,0,.35);
}

.qz-create-panel {
  margin: 0 38px;
  padding: 28px;
  border: 1px solid #24242e;
  border-radius: 16px;
  background: #101016;
}

.qz-create-panel h2 {
  margin: 0 0 7px;
  font-size: 18px;
}

.qz-create-panel p {
  margin: 0 0 20px;
  color: #8d8d99;
  font-size: 13px;
}

/* Quiz-taking screen */

.qz-taking {
  min-height: 100%;
}

.qz-taking-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 28px 38px 18px;
}

.qz-exit {
  justify-self: start;
  padding: 8px 0;
  border: 0;
  background: transparent;
  color: #8d8d99;
  font: inherit;
  font-size: 13px;
  font-weight: 650;
  cursor: pointer;
}

.qz-exit:hover {
  color: #f0eef7;
}

.qz-taking-counter {
  color: #f3f2f7;
  font-size: 13px;
  font-weight: 700;
}

.qz-taking-spacer {
  width: 40px;
}

.qz-progress {
  padding: 0 38px;
}

.qz-progress-track {
  width: 100%;
  height: 9px;
  overflow: hidden;
  border-radius: 999px;
  background: #1e1e27;
}

.qz-progress-fill {
  height: 100%;
  border-radius: 999px;
  background: #7c5cff;
  transition: width 500ms cubic-bezier(.2,.8,.2,1);
}

.qz-question-area {
  display: flex;
  justify-content: center;
  padding: 42px 38px 60px;
}

.qz-question-card {
  width: min(760px, 100%);
  box-sizing: border-box;
  padding: 30px;
  border: 1px solid #24242e;
  border-radius: 18px;
  background: #101016;
}

.qz-question-number {
  margin-bottom: 12px;
  color: #8174c9;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .11em;
}

.qz-question-card h1 {
  margin: 0 0 28px;
  color: #f8f7fb;
  font-size: clamp(21px, 3vw, 27px);
  line-height: 1.35;
  letter-spacing: -.015em;
}

.qz-answer-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.qz-answer {
  width: 100%;
  min-height: 58px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  box-sizing: border-box;
  border: 1px solid #292933;
  border-radius: 12px;
  background: #0d0d13;
  color: #d9d8e1;
  font: inherit;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;
}

.qz-answer:hover:not(:disabled) {
  border-color: #514b70;
  background: #12111a;
}

.qz-answer:disabled {
  cursor: default;
}

.qz-answer.selected {
  border-color: #7c5cff;
  background: rgba(124, 92, 255, .12);
  color: #f5f2ff;
}

.qz-answer.correct {
  border-color: #42d58a;
  background: rgba(66, 213, 138, .11);
  color: #effff6;
}

.qz-answer.wrong {
  border-color: #e46d75;
  background: rgba(228, 109, 117, .11);
  color: #fff1f2;
}

.qz-answer-letter {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: #181820;
  color: #85818f;
  font-size: 13px;
  font-weight: 800;
}

.qz-answer-letter svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.qz-answer.correct .qz-answer-letter {
  background: #42d58a;
  color: #07150d;
}

.qz-answer.wrong .qz-answer-letter {
  background: #e46d75;
  color: #23070a;
}

.qz-answer-text {
  flex: 1;
}

.qz-answer-result {
  flex: 0 0 auto;
  font-size: 20px;
  line-height: 1;
  font-weight: 900;
}

.qz-answer.correct .qz-answer-result {
  color: #42d58a;
}

.qz-answer.wrong .qz-answer-result {
  color: #e46d75;
}

.qz-question-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 28px;
}

.qz-question-count {
  color: #686875;
  font-size: 12px;
  font-weight: 650;
}

.qz-next-button {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 11px 18px;
  border: 0;
  border-radius: 11px;
  background: #7c5cff;
  color: #fff;
  font: inherit;
  font-size: 13px;
  font-weight: 750;
  cursor: pointer;
  transition: background 160ms ease, opacity 160ms ease;
}

.qz-next-button:hover:not(:disabled) {
  background: #8b6cff;
}

.qz-next-button:disabled {
  opacity: .38;
  cursor: not-allowed;
}

@media (max-width: 760px) {
  .qz-header {
    padding: 24px 20px 20px;
  }

  .qz-quiz-grid {
    grid-template-columns: 1fr;
    padding: 0 20px;
  }

  .qz-history-wrap {
    padding: 28px 20px 34px;
  }

  .qz-taking-header {
    padding: 22px 20px 16px;
  }

  .qz-progress {
    padding: 0 20px;
  }

  .qz-question-area {
    padding: 28px 20px 40px;
  }

  .qz-question-card {
    padding: 22px;
  }
}
`;
