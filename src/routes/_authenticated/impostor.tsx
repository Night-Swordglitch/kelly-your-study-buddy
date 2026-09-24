import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Clock3,
  Eye,
  EyeOff,
  RotateCcw,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useKellyXP } from "@/components/kelly/app-shell";

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 8;
const XP_REWARD = 25;
const LAST_GAME_STORAGE_KEY = "kelly-last-game";

const TOPICS = [
  {
    subject: "Biology",
    prompt: "Cell Division",
  },
  {
    subject: "Mathematics",
    prompt: "Quadratic Equations",
  },
  {
    subject: "Physics",
    prompt: "Forces and Motion",
  },
  {
    subject: "Chemistry",
    prompt: "Chemical Reactions",
  },
  {
    subject: "History",
    prompt: "World War II",
  },
  {
    subject: "Engineering",
    prompt: "Newton's Laws",
  },
];

type Phase = "setup" | "reveal" | "result";

type Player = {
  id: number;
  name: string;
};

type Role = {
  playerId: number;
  impostor: boolean;
};

export function ImpostorPage() {
  const navigate = useNavigate();
  const { addXP } = useKellyXP();

  const [phase, setPhase] = useState<Phase>("setup");
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Player 1" },
    { id: 2, name: "Player 2" },
    { id: 3, name: "Player 3" },
  ]);
  const [currentReveal, setCurrentReveal] = useState(0);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showRole, setShowRole] = useState(false);
  const [topic, setTopic] = useState(TOPICS[0] ?? {
    subject: "Biology",
    prompt: "Cell Division",
  });
  const [impostorCaught, setImpostorCaught] = useState<boolean | null>(null);
  const [sessionXP, setSessionXP] = useState(0);

  const validPlayers = useMemo(
    () =>
      players
        .map((player) => ({
          ...player,
          name: player.name.trim(),
        }))
        .filter((player) => player.name.length > 0),
    [players],
  );

  const currentPlayer = validPlayers[currentReveal];

  const startRound = () => {
    if (validPlayers.length < MIN_PLAYERS) return;

    const selectedTopic =
      TOPICS[Math.floor(Math.random() * TOPICS.length)] ??
      TOPICS[0] ?? {
        subject: "Biology",
        prompt: "Cell Division",
      };

    const impostorIndex = Math.floor(
      Math.random() * validPlayers.length,
    );

    setTopic(selectedTopic);

    setRoles(
      validPlayers.map((player, index) => ({
        playerId: player.id,
        impostor: index === impostorIndex,
      })),
    );

    setCurrentReveal(0);
    setShowRole(false);
    setImpostorCaught(null);
    setSessionXP(0);
    setPhase("reveal");
  };

  const handleRevealNext = () => {
    if (!showRole) {
      setShowRole(true);
      return;
    }

    if (currentReveal < validPlayers.length - 1) {
      setCurrentReveal((current) => current + 1);
      setShowRole(false);
      return;
    }

    setPhase("result");
  };

  const finishRound = (caught: boolean) => {
    if (impostorCaught !== null) return;

    const xp = caught ? XP_REWARD : 10;

    addXP(xp);

    window.localStorage.setItem(
      LAST_GAME_STORAGE_KEY,
      JSON.stringify({
        name: "Impostor",
        points: xp,
      }),
    );

    setImpostorCaught(caught);
    setSessionXP(xp);
  };

  const resetRound = () => {
    setPhase("setup");
    setCurrentReveal(0);
    setRoles([]);
    setShowRole(false);
    setImpostorCaught(null);
    setSessionXP(0);
  };

  const addPlayer = () => {
    if (players.length >= MAX_PLAYERS) return;

    const nextId =
      Math.max(...players.map((player) => player.id), 0) + 1;

    setPlayers((current) => [
      ...current,
      {
        id: nextId,
        name: `Player ${nextId}`,
      },
    ]);
  };

  const removePlayer = () => {
    if (players.length <= MIN_PLAYERS) return;

    setPlayers((current) => current.slice(0, -1));
  };

  const updatePlayer = (id: number, name: string) => {
    setPlayers((current) =>
      current.map((player) =>
        player.id === id ? { ...player, name } : player,
      ),
    );
  };

  const currentRole = roles.find(
    (role) => role.playerId === currentPlayer?.id,
  );

  return (
    <section className="kelly-impostor-page">
      <div className="kelly-flashcards-header">
        <button
          type="button"
          className="kelly-flashcards-back"
          onClick={() => navigate({ to: "/games" })}
        >
          ← Back
        </button>

        <h1>Impostor</h1>
      </div>

      {phase === "setup" && (
        <div className="kelly-impostor-content">
          <div className="kelly-impostor-intro">
            <div className="kelly-impostor-icon" aria-hidden="true">
              🎭
            </div>

            <div>
              <h2>Find the impostor.</h2>
              <p>
                Everyone gets the study topic except one player.
              </p>
            </div>
          </div>

          <div className="kelly-impostor-panel">
            <div className="kelly-impostor-panel-header">
              <div>
                <h3>Players</h3>
                <span>
                  {players.length} / {MAX_PLAYERS}
                </span>
              </div>

              <Users size={18} strokeWidth={2} />
            </div>

            <div className="kelly-impostor-player-list">
              {players.map((player, index) => (
                <label
                  key={player.id}
                  className="kelly-impostor-player-row"
                >
                  <span>{index + 1}</span>

                  <input
                    type="text"
                    value={player.name}
                    maxLength={24}
                    onChange={(event) =>
                      updatePlayer(player.id, event.target.value)
                    }
                    aria-label={`Player ${index + 1} name`}
                  />
                </label>
              ))}
            </div>

            <div className="kelly-impostor-player-actions">
              <button
                type="button"
                className="kelly-impostor-secondary-button"
                onClick={removePlayer}
                disabled={players.length <= MIN_PLAYERS}
              >
                − Remove player
              </button>

              <button
                type="button"
                className="kelly-impostor-secondary-button"
                onClick={addPlayer}
                disabled={players.length >= MAX_PLAYERS}
              >
                + Add player
              </button>
            </div>
          </div>

          <div className="kelly-impostor-rule">
            <span aria-hidden="true">⚡</span>
            <span>
              Minimum {MIN_PLAYERS} players · Exactly 1 impostor
            </span>
          </div>

          <button
            type="button"
            className="kelly-impostor-primary-button"
            onClick={startRound}
            disabled={validPlayers.length < MIN_PLAYERS}
          >
            Start Round
          </button>
        </div>
      )}

      {phase === "reveal" && currentPlayer && currentRole && (
        <div className="kelly-impostor-content">
          <div className="kelly-impostor-progress">
            <span>
              Player {currentReveal + 1} of {validPlayers.length}
            </span>

            <span>
              <Clock3 size={14} strokeWidth={2.1} />
              Private reveal
            </span>
          </div>

          <div className="kelly-impostor-reveal-card">
            <div className="kelly-impostor-reveal-name">
              {currentPlayer.name}
            </div>

            {!showRole ? (
              <>
                <div className="kelly-impostor-hidden-icon" aria-hidden="true">
                  👁️
                </div>

                <h2>Tap to reveal your role</h2>

                <p>
                  Make sure nobody else is looking.
                </p>
              </>
            ) : currentRole.impostor ? (
              <>
                <div className="kelly-impostor-role-icon" aria-hidden="true">
                  🎭
                </div>

                <div className="kelly-impostor-role impostor">
                  YOU ARE THE IMPOSTOR
                </div>

                <p>
                  You do not know the topic. Blend in.
                </p>
              </>
            ) : (
              <>
                <div className="kelly-impostor-role-icon" aria-hidden="true">
                  📚
                </div>

                <div className="kelly-impostor-role normal">
                  YOU ARE NORMAL
                </div>

                <p>
                  Study topic: <strong>{topic.prompt}</strong>
                  <br />
                  Subject: {topic.subject}
                </p>
              </>
            )}

            <button
              type="button"
              className="kelly-impostor-primary-button"
              onClick={handleRevealNext}
            >
              {showRole
                ? currentReveal < validPlayers.length - 1
                  ? "Hide & Pass"
                  : "Start Discussion"
                : "Reveal Role"}
            </button>
          </div>

          <div className="kelly-impostor-rule">
            {showRole ? (
              <>
                <EyeOff size={14} strokeWidth={2.1} />
                Hide this screen before passing the device.
              </>
            ) : (
              <>
                <Eye size={14} strokeWidth={2.1} />
                Only {currentPlayer.name} should see this.
              </>
            )}
          </div>
        </div>
      )}

      {phase === "result" && (
        <div className="kelly-impostor-content">
          <div className="kelly-flashcards-complete">
            <div className="kelly-flashcards-complete-icon" aria-hidden="true">
              🎭
            </div>

            <h2>Discussion complete!</h2>

            <p>
              Did the group identify the impostor?
            </p>

            {impostorCaught === null ? (
              <div className="kelly-impostor-vote-actions">
                <button
                  type="button"
                  className="kelly-impostor-primary-button"
                  onClick={() => finishRound(true)}
                >
                  <Trophy size={15} strokeWidth={2.2} />
                  Caught the impostor
                </button>

                <button
                  type="button"
                  className="kelly-impostor-secondary-button large"
                  onClick={() => finishRound(false)}
                >
                  Impostor escaped
                </button>
              </div>
            ) : (
              <>
                <div className="kelly-flashcards-results">
                  <div className="kelly-flashcards-result-card">
                    <span>Players</span>
                    <strong>{validPlayers.length}</strong>
                  </div>

                  <div className="kelly-flashcards-result-card">
                    <span>XP earned</span>
                    <strong className="xp">+{sessionXP} XP</strong>
                  </div>
                </div>

                <p className="kelly-impostor-result-status">
                  {impostorCaught
                    ? "The group caught the impostor."
                    : "The impostor got away."}
                </p>

                <div className="kelly-impostor-result-actions">
                  <button
                    type="button"
                    className="kelly-impostor-primary-button"
                    onClick={resetRound}
                  >
                    <RotateCcw size={15} strokeWidth={2.2} />
                    New Round
                  </button>

                  <button
                    type="button"
                    className="kelly-impostor-secondary-button large"
                    onClick={() => navigate({ to: "/games" })}
                  >
                    Back to Games
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="kelly-impostor-toasts" aria-live="polite">
        {impostorCaught !== null && (
          <div className="kelly-impostor-toast">
            <Zap size={14} strokeWidth={2.3} />
            <span>+{sessionXP} XP · Impostor round complete</span>
          </div>
        )}
      </div>
    </section>
  );
}

export const Route = createFileRoute("/_authenticated/impostor")({
  component: ImpostorPage,
});
