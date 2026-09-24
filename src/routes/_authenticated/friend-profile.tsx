import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Flame,
  MessageCircle,
  Send,
  Trophy,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import {
  FRIENDS,
  SUGGESTED,
  type Friend,
} from "@/components/kelly/friends-data";

function formatXP(xp: number) {
  return xp.toLocaleString();
}

function StatusDot({ status }: { status: Friend["status"] }) {
  return (
    <span
      className={`kelly-friends-status-dot kelly-friends-status-${status.toLowerCase()}`}
      aria-hidden="true"
    />
  );
}

export function FriendProfilePage() {
  const { id } = Route.useSearch();
  const friendId = Number(id);

  const friend = [...FRIENDS, ...SUGGESTED].find(
    (item) => item.id === friendId,
  );

  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  if (!friend) {
    return (
      <section className="kelly-friend-profile-page">
        <div className="kelly-flashcards-header">
          <button
            type="button"
            className="kelly-flashcards-back"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={14} strokeWidth={2.1} />
            Back
          </button>

          <h1>Friend Profile</h1>
        </div>

        <div className="kelly-friend-profile-missing">
          <UserRound size={28} strokeWidth={1.8} />
          <h2>Friend not found</h2>
          <p>
            This friend is no longer available in your current Friends list.
          </p>
        </div>
      </section>
    );
  }

  const sendMessage = () => {
    const trimmed = message.trim();

    if (!trimmed) return;

    setMessages((current) => [...current, trimmed]);
    setMessage("");
  };

  return (
    <section className="kelly-friend-profile-page">
      <div className="kelly-flashcards-header">
        <button
          type="button"
          className="kelly-flashcards-back"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={14} strokeWidth={2.1} />
          Back
        </button>

        <h1>Friend Profile</h1>
      </div>

      <div className="kelly-friend-profile-content">
        <div className="kelly-friend-profile-hero">
          <div
            className="kelly-friend-profile-avatar"
            style={{ background: friend.avatar }}
          >
            {friend.initial}
          </div>

          <div className="kelly-friend-profile-identity">
            <div className="kelly-friend-profile-name-row">
              <h2>{friend.name}</h2>

              {friend.topXP && (
                <Trophy
                  size={17}
                  strokeWidth={2.2}
                  className="kelly-friend-profile-trophy"
                  aria-label="Top XP"
                />
              )}
            </div>

            <div className="kelly-friend-profile-status">
              <StatusDot status={friend.status} />
              <span>{friend.status}</span>
            </div>
          </div>
        </div>

        <div className="kelly-friend-profile-stats">
          <div className="kelly-friend-profile-stat">
            <span className="kelly-friend-profile-stat-icon">
              <Zap size={16} strokeWidth={2.3} />
            </span>
            <span className="kelly-friend-profile-stat-label">
              Total XP
            </span>
            <strong>{formatXP(friend.xp)}</strong>
          </div>

          <div className="kelly-friend-profile-stat">
            <span className="kelly-friend-profile-stat-icon">
              <Trophy size={16} strokeWidth={2.2} />
            </span>
            <span className="kelly-friend-profile-stat-label">
              Level
            </span>
            <strong>{friend.level}</strong>
          </div>

          <div className="kelly-friend-profile-stat">
            <span className="kelly-friend-profile-stat-icon">
              <Flame size={16} strokeWidth={2.2} />
            </span>
            <span className="kelly-friend-profile-stat-label">
              Status
            </span>
            <strong>{friend.status}</strong>
          </div>
        </div>

        <div className="kelly-friend-profile-section">
          <div className="kelly-friend-profile-section-heading">
            <div>
              <span>STUDY PROFILE</span>
              <h3>{friend.name}'s progress</h3>
            </div>

            <UserRound size={18} strokeWidth={2} />
          </div>

          <div className="kelly-friend-profile-info-row">
            <div>
              <span>Current level</span>
              <strong>Level {friend.level}</strong>
            </div>

            <div>
              <span>XP earned</span>
              <strong>{formatXP(friend.xp)} XP</strong>
            </div>
          </div>

          <div className="kelly-friend-profile-presence">
            <StatusDot status={friend.status} />

            <div>
              <strong>
                {friend.status === "Studying"
                  ? `${friend.name} is studying`
                  : friend.status === "Online"
                    ? `${friend.name} is online`
                    : `${friend.name} is currently offline`}
              </strong>

              <span>
                Study activity and deeper statistics can appear here as the
                social system grows.
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="kelly-friend-profile-message"
          onClick={() => setChatOpen(true)}
        >
          <MessageCircle size={16} strokeWidth={2.2} />
          Message
        </button>
      </div>

      {chatOpen && (
        <div className="kelly-friend-chat" role="dialog" aria-label={`Chat with ${friend.name}`}>
          <div className="kelly-friend-chat-header">
            <div className="kelly-friend-chat-person">
              <div
                className="kelly-friend-chat-avatar"
                style={{ background: friend.avatar }}
              >
                {friend.initial}
              </div>

              <div>
                <strong>{friend.name}</strong>
                <span>
                  <StatusDot status={friend.status} />
                  {friend.status}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="kelly-friend-chat-close"
              onClick={() => setChatOpen(false)}
              aria-label="Close chat"
            >
              <X size={17} strokeWidth={2.1} />
            </button>
          </div>

          <div className="kelly-friend-chat-messages" aria-live="polite">
            {messages.length === 0 ? (
              <div className="kelly-friend-chat-empty">
                <MessageCircle size={22} strokeWidth={1.8} />
                <strong>Start a conversation</strong>
                <span>Send a message to {friend.name}.</span>
              </div>
            ) : (
              messages.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="kelly-friend-chat-message mine"
                >
                  {item}
                </div>
              ))
            )}
          </div>

          <form
            className="kelly-friend-chat-compose"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Message..."
              maxLength={500}
              aria-label="Message"
            />

            <button
              type="submit"
              aria-label="Send message"
              disabled={!message.trim()}
            >
              <Send size={15} strokeWidth={2.2} />
            </button>
          </form>
        </div>
      )}
    </section>
  );
}

export const Route = createFileRoute("/_authenticated/friend-profile")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: Number(search.id),
  }),
  component: FriendProfilePage,
});
