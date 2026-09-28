import {
  doc,
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

const statsRef = (uid: string) =>
  doc(firestore, "users", uid, "stats", "main");

const streakRef = (uid: string) =>
  doc(firestore, "users", uid, "streak", "main");

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

export async function recordActivityStats(
  uid: string,
  activityType: "quiz" | "game" | "recording",
  xp: number,
  activityDate = new Date().toISOString().slice(0, 10),
): Promise<void> {
  await runTransaction(firestore, async (transaction) => {
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

    transaction.set(statsDocument, nextStats);
    transaction.set(streakDocument, nextStreak);
  });
}

export async function loadKellyStats(
  uid: string,
): Promise<KellyStats | null> {
  const { getDoc } = await import("firebase/firestore");
  const snapshot = await getDoc(statsRef(uid));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as KellyStats;
}

export async function loadKellyStreak(
  uid: string,
): Promise<KellyStreak | null> {
  const { getDoc } = await import("firebase/firestore");
  const snapshot = await getDoc(streakRef(uid));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as KellyStreak;
}
