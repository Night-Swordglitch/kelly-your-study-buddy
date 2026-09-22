import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { useKellyXP } from "@/components/kelly/app-shell";

const PAIRS = ["🧬", "🌊", "📊", "⚛️", "🧠", "🌱", "🔬", "📚"];
const LAST_GAME_STORAGE_KEY = "kelly-last-game";

type MemoryCard = {
  id: number;
  pair: string;
  matched: boolean;
};

type Toast = {
  id: number;
  text: string;
};

function createDeck(): MemoryCard[] {
  return [...PAIRS, ...PAIRS]
    .map((pair, index) => ({
      id: index,
      pair,
      matched: false,
      sort: Math.random(),
    }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ sort: _sort, ...card }) => card);
}

export function MemoryMatchPage() {
  const navigate = useNavigate();
  const { addXP } = useKellyXP();

  const initialDeck = useMemo(() => createDeck(), []);

  const [cards, setCards] = useState<MemoryCard[]>(initialDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [finished, setFinished] = useState(false);
  const [sessionXP, setSessionXP] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const lockedRef = useRef(false);
  const completedRef = useRef(false);
  const toastIdRef = useRef(0);

  useEffect(() => {
    if (matched !== PAIRS.length || completedRef.current) return;

    completedRef.current = true;

    const xp = Math.max(10, 40 - moves);

    addXP(xp);

    window.localStorage.setItem(
      LAST_GAME_STORAGE_KEY,
      JSON.stringify({
        name: "Memory Match",
        points: xp,
      }),
    );

    setSessionXP(xp);
    setFinished(true);

    const firstToastId = ++toastIdRef.current;
    const secondToastId = ++toastIdRef.current;

    setToasts([
      {
        id: firstToastId,
        text: `Game over! +${xp} XP`,
      },
      {
        id: secondToastId,
        text: `+${xp} XP · Memory Match complete`,
      },
    ]);

    const timeout = window.setTimeout(() => {
      setToasts([]);
    }, 4200);

    return () => window.clearTimeout(timeout);
  }, [matched, moves, addXP]);

  const handleCardClick = (card: MemoryCard) => {
    if (lockedRef.current) return;
    if (finished) return;
    if (card.matched) return;
    if (flipped.includes(card.id)) return;
    if (flipped.length >= 2) return;

    const nextFlipped = [...flipped, card.id];

    setFlipped(nextFlipped);

    if (nextFlipped.length !== 2) return;

    setMoves((current) => current + 1);

    const first = cards.find((item) => item.id === nextFlipped[0]);
    const second = cards.find((item) => item.id === nextFlipped[1]);

    if (!first || !second) {
      setFlipped([]);
      return;
    }

    lockedRef.current = true;

    if (first.pair === second.pair) {
      window.setTimeout(() => {
        setCards((current) =>
          current.map((item) =>
            nextFlipped.includes(item.id)
              ? { ...item, matched: true }
              : item,
          ),
        );

        setMatched((current) => current + 1);
        setFlipped([]);
        lockedRef.current = false;
      }, 180);

      return;
    }

    window.setTimeout(() => {
      setFlipped([]);
      lockedRef.current = false;
    }, 700);
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
        <h1>Memory Match</h1>
      </div>

      {finished ? (
        <div className="kelly-flashcards-complete">
          <div className="kelly-flashcards-complete-icon" aria-hidden="true">
            🎉
          </div>

          <h2>Session complete!</h2>

          <p>
            You matched all 8 pairs in {moves} moves.
          </p>

          <div className="kelly-flashcards-results">
            <div className="kelly-flashcards-result-card">
              <span>Moves</span>
              <strong>{moves}</strong>
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
          <div className="kelly-memory-match-stats">
            <span>Moves: {moves}</span>
            <span className="kelly-memory-match-matched">
              Matched: {matched}/8
            </span>
          </div>

          <div className="kelly-memory-match-grid">
            {cards.map((card) => {
              const isFlipped = flipped.includes(card.id);
              const isVisible = isFlipped || card.matched;

              return (
                <button
                  key={card.id}
                  type="button"
                  className={[
                    "kelly-memory-card",
                    isVisible ? "flipped" : "",
                    card.matched ? "matched" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => handleCardClick(card)}
                  aria-label={
                    card.matched
                      ? `Matched ${card.pair}`
                      : isVisible
                        ? `Revealed ${card.pair}`
                        : "Hidden memory card"
                  }
                >
                  <span aria-hidden="true">
                    {isVisible ? card.pair : "?"}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}

      <div
        className="kelly-memory-match-toasts"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="kelly-memory-match-toast">
            <Zap size={14} strokeWidth={2.3} />
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export const Route = createFileRoute("/_authenticated/memory-match")({
  component: MemoryMatchPage,
});
