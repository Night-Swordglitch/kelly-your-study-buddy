import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import firestore from "./firestore";

export type QuizActivity = {
  id: string;
  type: "quiz";
  title: string;
  subject?: string;
  date: string;
  score: number;
  total: number;
  xp: number;
  createdAt?: unknown;
};

export type RecordingActivity = {
  id: string;
  type: "recording";
  title: string;
  subject?: string;
  date: string;
  duration: string;
  createdAt?: unknown;
};

const activityCollection = (uid: string) =>
  collection(firestore, "users", uid, "activity");

export async function loadQuizActivity(
  uid: string,
): Promise<QuizActivity[]> {
  const activityQuery = query(
    activityCollection(uid),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(activityQuery);

  return snapshot.docs
    .map((activity) => {
      const data = activity.data();

      if (data.type !== "quiz") {
        return null;
      }

      return {
        id: activity.id,
        type: "quiz" as const,
        title:
          typeof data.title === "string"
            ? data.title
            : "Untitled Quiz",
        subject:
          typeof data.subject === "string"
            ? data.subject
            : undefined,
        date:
          typeof data.date === "string"
            ? data.date
            : new Date().toISOString().slice(0, 10),
        score:
          typeof data.score === "number"
            ? data.score
            : 0,
        total:
          typeof data.total === "number"
            ? data.total
            : 0,
        xp:
          typeof data.xp === "number"
            ? data.xp
            : 0,
        createdAt: data.createdAt,
      };
    })
    .filter((activity): activity is QuizActivity => activity !== null);
}

export async function recordQuizActivity(
  uid: string,
  activity: Omit<QuizActivity, "id" | "createdAt">,
): Promise<void> {
  await addDoc(activityCollection(uid), {
    ...activity,
    createdAt: serverTimestamp(),
  });
}

export async function loadRecordingActivity(
  uid: string,
): Promise<RecordingActivity[]> {
  const activityQuery = query(
    activityCollection(uid),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(activityQuery);

  return snapshot.docs
    .map((activity) => {
      const data = activity.data();

      if (data.type !== "recording") {
        return null;
      }

      return {
        id: activity.id,
        type: "recording" as const,
        title:
          typeof data.title === "string"
            ? data.title
            : "Untitled Recording",
        subject:
          typeof data.subject === "string"
            ? data.subject
            : undefined,
        date:
          typeof data.date === "string"
            ? data.date
            : new Date().toISOString().slice(0, 10),
        duration:
          typeof data.duration === "string"
            ? data.duration
            : "00:00",
        createdAt: data.createdAt,
      };
    })
    .filter(
      (activity): activity is RecordingActivity =>
        activity !== null,
    );
}

export async function recordRecordingActivity(
  uid: string,
  activity: Omit<RecordingActivity, "createdAt">,
): Promise<void> {
  await addDoc(activityCollection(uid), {
    ...activity,
    createdAt: serverTimestamp(),
  });
}

export async function seedQuizActivity(
  uid: string,
  activities: Omit<QuizActivity, "id" | "createdAt">[],
): Promise<void> {
  await Promise.all(
    activities.map((activity) =>
      setDoc(
        doc(activityCollection(uid), activity.id),
        {
          ...activity,
          createdAt: serverTimestamp(),
        },
      ),
    ),
  );
}

export type GameActivity = {
  id: string;
  type: "game";
  game:
    | "memory-match"
    | "quick-quiz"
    | "timed-challenge"
    | "impostor"
    | "flashcards";
  title: string;
  date: string;
  score?: number;
  total?: number;
  points?: number;
  xp: number;
  createdAt?: unknown;
};

export async function loadGameActivity(
  uid: string,
): Promise<GameActivity[]> {
  const activityQuery = query(
    activityCollection(uid),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(activityQuery);

  return snapshot.docs
    .map((activity) => {
      const data = activity.data();

      if (data.type !== "game") {
        return null;
      }

      return {
        id: activity.id,
        type: "game" as const,
        game:
          data.game === "memory-match" ||
          data.game === "quick-quiz" ||
          data.game === "timed-challenge" ||
          data.game === "impostor"
            ? data.game
            : "quick-quiz",
        title:
          typeof data.title === "string"
            ? data.title
            : "Untitled Game",
        date:
          typeof data.date === "string"
            ? data.date
            : new Date().toISOString().slice(0, 10),
        score:
          typeof data.score === "number"
            ? data.score
            : undefined,
        total:
          typeof data.total === "number"
            ? data.total
            : undefined,
        points:
          typeof data.points === "number"
            ? data.points
            : undefined,
        xp:
          typeof data.xp === "number"
            ? data.xp
            : 0,
        createdAt: data.createdAt,
      };
    })
    .filter(
      (activity): activity is GameActivity =>
        activity !== null,
    );
}

export async function recordGameActivity(
  uid: string,
  activity: Omit<GameActivity, "createdAt">,
): Promise<void> {
  await addDoc(activityCollection(uid), {
    ...activity,
    createdAt: serverTimestamp(),
  });
}
