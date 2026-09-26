import {
  doc,
  getDoc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import firestore from "./firestore";

const progressRef = (uid: string) =>
  doc(firestore, "users", uid, "progress", "main");

export async function loadUserXP(
  uid: string,
  fallbackXP: number,
): Promise<number> {
  const ref = progressRef(uid);
  const snapshot = await getDoc(ref);

  if (snapshot.exists()) {
    const data = snapshot.data();
    const xp = data.xp;

    if (typeof xp === "number" && Number.isFinite(xp)) {
      return xp;
    }
  }

  await setDoc(
    ref,
    {
      xp: fallbackXP,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return fallbackXP;
}

export async function addUserXP(
  uid: string,
  amount: number,
): Promise<void> {
  const ref = progressRef(uid);

  await updateDoc(ref, {
    xp: increment(amount),
    updatedAt: serverTimestamp(),
  });
}
