import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import firestore from "./firestore";

export type KellyStats = {
  totalActivities: number;
  quizzesCompleted: number;
  gamesCompleted: number;
  recordingsCreated: number;
  totalXP: number;
  updatedAt?: unknown;
};

export type KellyStreak = {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  updatedAt?: unknown;
};

export type KellyAchievement = {
  id: string;
  title: string;
  description: string;
  unlockedAt?: unknown;
};

export const KELLY_ACHIEVEMENTS: Omit<
  KellyAchievement,
  "unlockedAt"
>[] = [
  {
    id: "first-step",
    title: "First Step",
    description: "Complete your first activity.",
  },
  {
    id: "game-on",
    title: "Game On",
    description: "Complete your first game.",
  },
  {
    id: "quizzer",
    title: "Quizzer",
    description: "Complete your first quiz.",
  },
  {
    id: "record-keeper",
    title: "Record Keeper",
    description: "Create your first recording.",
  },
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Complete 5 activities.",
  },
  {
    id: "century",
    title: "Century",
    description: "Earn 100 total XP.",
  },
  {
    id: "week-warrior",
    title: "Week Warrior",
    description: "Reach a 7-day streak.",
  },
  {
    id: "dedicated-learner",
    title: "Dedicated Learner",
    description: "Complete 25 activities.",
  },
];

const statsRef = (uid: string) =>
  doc(firestore, "users", uid, "stats", "main");

const streakRef = (uid: string) =>
  doc(firestore, "users", uid, "streak", "main");

const achievementRef = (uid: string, achievementId: string) =>
  doc(
    firestore,
    "users",
    uid,
    "achievements",
    achievementId,
  );

function getDateDifferenceInDays(
  previousDate: string,
  currentDate: string,
): number {
  const previous = new Date(`${previousDate}T00:00:00`);
  const current = new Date(`${currentDate}T00:00:00`);

  return Math.round(
    (current.getTime() - previous.getTime()) / 86400000,
  );
}

function getEligibleAchievements(
  activityType: "quiz" | "game" | "recording",
  stats: KellyStats,
  streak: KellyStreak,
): string[] {
  const eligible: string[] = [];

  if (stats.totalActivities >= 1) {
    eligible.push("first-step");
  }

  if (activityType === "game" && stats.gamesCompleted >= 1) {
    eligible.push("game-on");
  }

  if (activityType === "quiz" && stats.quizzesCompleted >= 1) {
    eligible.push("quizzer");
  }

  if (
    activityType === "recording" &&
    stats.recordingsCreated >= 1
  ) {
    eligible.push("record-keeper");
  }

  if (stats.totalActivities >= 5) {
    eligible.push("getting-started");
  }

  if (stats.totalXP >= 100) {
    eligible.push("century");
  }

  if (streak.currentStreak >= 7) {
    eligible.push("week-warrior");
  }

  if (stats.totalActivities >= 25) {
    eligible.push("dedicated-learner");
  }

  return eligible;
}

export async function recordActivityStats(
  uid: string,
  activityType: "quiz" | "game" | "recording",
  xp: number,
  activityDate = new Date().toISOString().slice(0, 10),
): Promise<string[]> {
  return runTransaction(firestore, async (transaction) => {
    const statsDocument = statsRef(uid);
    const streakDocument = streakRef(uid);

    const [statsSnapshot, streakSnapshot] = await Promise.all([
      transaction.get(statsDocument),
      transaction.get(streakDocument),
    ]);

    const stats = statsSnapshot.exists()
      ? (statsSnapshot.data() as Partial<KellyStats>)
      : {};

    const streak = streakSnapshot.exists()
      ? (streakSnapshot.data() as Partial<KellyStreak>)
      : {};

    const nextStats: KellyStats = {
      totalActivities: (stats.totalActivities ?? 0) + 1,
      quizzesCompleted:
        (stats.quizzesCompleted ?? 0) +
        (activityType === "quiz" ? 1 : 0),
      gamesCompleted:
        (stats.gamesCompleted ?? 0) +
        (activityType === "game" ? 1 : 0),
      recordingsCreated:
        (stats.recordingsCreated ?? 0) +
        (activityType === "recording" ? 1 : 0),
      totalXP: (stats.totalXP ?? 0) + xp,
      updatedAt: serverTimestamp(),
    };

    let currentStreak = streak.currentStreak ?? 0;
    let longestStreak = streak.longestStreak ?? 0;
    const lastActiveDate = streak.lastActiveDate ?? "";

    if (!lastActiveDate) {
      currentStreak = 1;
    } else {
      const difference = getDateDifferenceInDays(
        lastActiveDate,
        activityDate,
      );

      if (difference === 0) {
        currentStreak = Math.max(currentStreak, 1);
      } else if (difference === 1) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    const nextStreak: KellyStreak = {
      currentStreak,
      longestStreak,
      lastActiveDate: activityDate,
      updatedAt: serverTimestamp(),
    };

    const eligibleAchievements = getEligibleAchievements(
      activityType,
      nextStats,
      nextStreak,
    );

    const achievementSnapshots = await Promise.all(
      eligibleAchievements.map((achievementId) =>
        transaction.get(
          achievementRef(uid, achievementId),
        ),
      ),
    );

    const newlyUnlocked: string[] = [];

    eligibleAchievements.forEach(
      (achievementId, index) => {
        if (achievementSnapshots[index].exists()) {
          return;
        }

        const achievement = KELLY_ACHIEVEMENTS.find(
          (item) => item.id === achievementId,
        );

        if (!achievement) {
          return;
        }

        transaction.set(
          achievementRef(uid, achievementId),
          {
            ...achievement,
            unlockedAt: serverTimestamp(),
          },
        );

        newlyUnlocked.push(achievementId);
      },
    );

    transaction.set(statsDocument, nextStats);
    transaction.set(streakDocument, nextStreak);

    return newlyUnlocked;
  });
}

export async function loadKellyStats(
  uid: string,
): Promise<KellyStats | null> {
  const snapshot = await getDoc(statsRef(uid));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as KellyStats;
}

export async function loadKellyStreak(
  uid: string,
): Promise<KellyStreak | null> {
  const snapshot = await getDoc(streakRef(uid));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as KellyStreak;
}

export async function loadKellyAchievements(
  uid: string,
): Promise<KellyAchievement[]> {
  const snapshots = await Promise.all(
    KELLY_ACHIEVEMENTS.map((achievement) =>
      getDoc(achievementRef(uid, achievement.id)),
    ),
  );

  return snapshots
    .map((snapshot) =>
      snapshot.exists()
        ? (snapshot.data() as KellyAchievement)
        : null,
    )
    .filter(
      (achievement): achievement is KellyAchievement =>
        achievement !== null,
    );
}