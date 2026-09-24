import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Crown,
  Flame,
  Plus,
  Search,
  Trophy,
  UserRound,
  Users,
  X,
  Zap,
} from "lucide-react";

import {
  FRIENDS,
  RANKINGS,
  STUDYING,
  SUGGESTED,
  type Friend,
} from "@/components/kelly/friends-data";
type Tab = "friends" | "rankings" | "groups";

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

export function FriendsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("friends");
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState(FRIENDS);
  const [suggested, setSuggested] = useState(SUGGESTED);

  const filteredFriends = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return friends;

    return friends.filter((friend) =>
      friend.name.toLowerCase().includes(query),
    );
  }, [friends, search]);

  const openFriendProfile = (id: number) => {
    navigate({
      to: "/friend-profile",
      search: {
        id,
      },
    });
  };

  const removeFriend = (id: number) => {
    setFriends((current) => current.filter((friend) => friend.id !== id));
  };

  const addFriend = (id: number) => {
    const friend = suggested.find((item) => item.id === id);

    if (!friend) return;

    setFriends((current) => [
      ...current,
      {
        ...friend,
        id: Date.now(),
      },
    ]);

    setSuggested((current) => current.filter((item) => item.id !== id));
  };

  return (
    <section className="kelly-friends-page">
      <div className="kelly-friends-header">
        <h1>Friends</h1>

        <div className="kelly-friends-tabs" role="tablist">
          <button
            type="button"
            className={tab === "friends" ? "active" : ""}
            onClick={() => setTab("friends")}
            role="tab"
            aria-selected={tab === "friends"}
          >
            Friends
          </button>

          <button
            type="button"
            className={tab === "rankings" ? "active" : ""}
            onClick={() => setTab("rankings")}
            role="tab"
            aria-selected={tab === "rankings"}
          >
            Rankings
          </button>

          <button
            type="button"
            className={tab === "groups" ? "active" : ""}
            onClick={() => setTab("groups")}
            role="tab"
            aria-selected={tab === "groups"}
          >
            Study Groups
          </button>
        </div>
      </div>

      {tab === "friends" && (
        <div className="kelly-friends-tab-content">
          <div className="kelly-friends-search">
            <Search size={17} strokeWidth={2} />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search friends..."
              aria-label="Search friends"
            />
          </div>

          <div className="kelly-friends-scroll">
            <div className="kelly-friends-list">
              {filteredFriends.map((friend) => (
                <div
                  className="kelly-friend-row kelly-friend-row-clickable"
                  key={friend.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openFriendProfile(friend.id)}
                  onKeyDown={(event) => {
                    if (
                      event.target === event.currentTarget &&
                      (event.key === "Enter" || event.key === " ")
                    ) {
                      event.preventDefault();
                      openFriendProfile(friend.id);
                    }
                  }}
                  aria-label={`View ${friend.name}'s profile`}
                >
                  <div
                    className="kelly-friend-avatar"
                    style={{ background: friend.avatar }}
                  >
                    {friend.initial}
                  </div>

                  <div className="kelly-friend-info">
                    <div className="kelly-friend-name">
                      <strong>{friend.name}</strong>
                      {friend.topXP && (
                        <Crown
                          size={14}
                          strokeWidth={2.2}
                          className="kelly-friend-crown"
                        />
                      )}
                    </div>

                    <div className="kelly-friend-meta">
                      <span className="kelly-friend-status">
                        <StatusDot status={friend.status} />
                        {friend.status}
                      </span>
                      <span>Lv {friend.level} · {formatXP(friend.xp)} XP</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="kelly-friend-remove"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeFriend(friend.id);
                    }}
                    aria-label={`Remove ${friend.name}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            {suggested.length > 0 && (
              <section className="kelly-friends-section">
                <div className="kelly-friends-section-label">SUGGESTED</div>

                <div className="kelly-friends-list">
                  {suggested.map((friend) => (
                    <div className="kelly-friend-row" key={friend.id}>
                      <div
                        className="kelly-friend-avatar"
                        style={{ background: friend.avatar }}
                      >
                        {friend.initial}
                      </div>

                      <div className="kelly-friend-info">
                        <div className="kelly-friend-name">
                          <strong>{friend.name}</strong>
                        </div>

                        <div className="kelly-friend-meta">
                          <span className="kelly-friend-status">
                            <StatusDot status={friend.status} />
                            {friend.status}
                          </span>
                          <span>
                            Lv {friend.level} · {formatXP(friend.xp)} XP
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="kelly-friend-add"
                        onClick={() => addFriend(friend.id)}
                      >
                        <Plus size={14} strokeWidth={2.5} />
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}

      {tab === "rankings" && (
        <div className="kelly-friends-tab-content">
          <div className="kelly-friends-ranking-caption">
            Weekly ranking resets in <strong>3 days</strong>
          </div>

          <div className="kelly-friends-scroll">
            <div className="kelly-friends-list">
              <div className="kelly-friend-row kelly-ranking-you">
                <div className="kelly-ranking-marker">
                  <Trophy size={18} strokeWidth={2.1} />
                </div>

                <div
                  className="kelly-friend-avatar kelly-ranking-you-avatar"
                >
                  Y
                </div>

                <div className="kelly-friend-info">
                  <div className="kelly-friend-name">
                    <strong>You (You)</strong>
                  </div>
                  <div className="kelly-ranking-level">Level 3</div>
                </div>

                <div className="kelly-ranking-xp">
                  <Zap size={15} strokeWidth={2.4} />
                  1,180 XP
                </div>
              </div>

              {RANKINGS.map((user) => (
                <div className="kelly-friend-row" key={user.rank}>
                  <div className="kelly-ranking-number">#{user.rank}</div>

                  <div
                    className="kelly-friend-avatar"
                    style={{ background: user.avatar }}
                  >
                    {user.initial}
                  </div>

                  <div className="kelly-friend-info">
                    <div className="kelly-friend-name">
                      <strong>{user.name}</strong>
                    </div>
                    <div className="kelly-ranking-level">
                      Level {user.level}
                    </div>
                  </div>

                  <div className="kelly-ranking-xp">
                    <Zap size={15} strokeWidth={2.4} />
                    {formatXP(user.xp)} XP
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "groups" && (
        <div className="kelly-friends-tab-content">
          <button type="button" className="kelly-study-session-start">
            <Plus size={18} strokeWidth={2.4} />
            Start a Study Session
          </button>

          <div className="kelly-friends-scroll">
            <section className="kelly-friends-section">
              <div className="kelly-friends-section-label">
                CURRENTLY STUDYING
              </div>

              <div className="kelly-friends-list">
                {STUDYING.map((session) => (
                  <div className="kelly-friend-row" key={session.id}>
                    <div
                      className="kelly-friend-avatar"
                      style={{ background: session.avatar }}
                    >
                      {session.initial}
                    </div>

                    <div className="kelly-friend-info">
                      <div className="kelly-study-session-name">
                        <span className="kelly-study-pulse" />
                        <strong>{session.name} is studying</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="kelly-study-join"
                    >
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </section>
  );
}

export const Route = createFileRoute("/_authenticated/friends")({
  component: FriendsPage,
});





