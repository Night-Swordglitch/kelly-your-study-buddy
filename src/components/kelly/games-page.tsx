import { Gamepad2, Trophy } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

const GAMES = [
  {
    icon: "🧩",
    title: "Memory Match",
    description: "Match pairs of cards",
    to: "/memory-match",
  },
  {
    icon: "⚡",
    title: "Quick Quiz",
    description: "Answer questions quickly",
    to: "/quick-quiz",
  },
  {
    icon: "⏱️",
    title: "Timed Challenge",
    description: "30 seconds, max points",
    to: "/timed-challenge",
  },
  {
    icon: "🎴",
    title: "Flashcards",
    description: "Flip cards to test your memory",
    to: "/flashcards",
  },
];

const LAST_GAME_STORAGE_KEY = "kelly-last-game";

type LastGame = {
  name: string;
  points: number;
};

export function GamesPage() {
  const navigate = useNavigate();

  let lastGame: LastGame | null = null;

  if (typeof window !== "undefined") {
    try {
      const stored = window.localStorage.getItem(LAST_GAME_STORAGE_KEY);

      if (stored) {
        lastGame = JSON.parse(stored) as LastGame;
      }
    } catch {
      lastGame = null;
    }
  }

  return (
    <section className="kelly-games-page">
      <div className="kelly-games-header">
        <div>
          <h1>Study Games</h1>
          <p>Learn, play, and earn XP.</p>
        </div>

        <div className="kelly-games-header-right">
          {lastGame && (
            <div className="kelly-last-game-badge">
              <Trophy size={14} strokeWidth={2} />
              <span>
                Last: {lastGame.name} · {lastGame.points} pts
              </span>
            </div>
          )}

          <Gamepad2
            className="kelly-games-header-icon"
            size={28}
            strokeWidth={1.8}
          />
        </div>
      </div>

      <div className="kelly-games-grid">
        {GAMES.map((game) => (
          <button
            key={game.title}
            type="button"
            className="kelly-game-card"
            onClick={() => {
              if (game.to) {
                navigate({ to: game.to });
              }
            }}
            disabled={!game.to}
          >
            <span className="kelly-game-emoji" aria-hidden="true">
              {game.icon}
            </span>

            <h2>{game.title}</h2>

            <p>{game.description}</p>

            <span className="kelly-game-xp">
              <span aria-hidden="true">⚡</span>
              Earn XP
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}



