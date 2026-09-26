import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import firestore from "./firestore";

export type KellyProfile = {
  displayName: string;
  studyStyle: string;
  createdAt?: unknown;
};

const profileRef = (uid: string) =>
  doc(firestore, "users", uid);

export async function loadUserProfile(
  uid: string,
  fallbackDisplayName: string,
): Promise<KellyProfile> {
  const ref = profileRef(uid);
  const snapshot = await getDoc(ref);

  if (snapshot.exists()) {
    const data = snapshot.data();

    return {
      displayName:
        typeof data.displayName === "string" &&
        data.displayName.trim()
          ? data.displayName
          : fallbackDisplayName,
      studyStyle:
        typeof data.studyStyle === "string" &&
        data.studyStyle.trim()
          ? data.studyStyle
          : "The Night Owl",
      createdAt: data.createdAt,
    };
  }

  const profile: KellyProfile = {
    displayName: fallbackDisplayName,
    studyStyle: "The Night Owl",
  };

  await setDoc(
    ref,
    {
      ...profile,
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );

  return profile;
}

export async function updateUserProfile(
  uid: string,
  updates: Pick<KellyProfile, "displayName" | "studyStyle">,
): Promise<void> {
  const ref = profileRef(uid);

  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}
