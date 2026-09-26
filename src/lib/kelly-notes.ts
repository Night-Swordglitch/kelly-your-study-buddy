import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import firestore from "./firestore";

export type NoteColor = "green" | "blue" | "orange";

export type NoteDefinition = {
  term: string;
  definition: string;
};

export type KellyNote = {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  date: string;
  color: NoteColor;
  summary: string;
  keyConcepts: string[];
  keyPoints: string[];
  definitions: NoteDefinition[];
  takeaways: string[];
  createdAt?: unknown;
  updatedAt?: unknown;
};

const notesCollection = (uid: string) =>
  collection(firestore, "users", uid, "notes");

export async function loadUserNotes(
  uid: string,
): Promise<KellyNote[]> {
  const notesQuery = query(
    notesCollection(uid),
    orderBy("updatedAt", "desc"),
  );

  const snapshot = await getDocs(notesQuery);

  return snapshot.docs.map((note) => {
    const data = note.data();

    return {
      id: note.id,
      title:
        typeof data.title === "string"
          ? data.title
          : "Untitled Note",
      subject:
        typeof data.subject === "string"
          ? data.subject
          : "General",
      chapter:
        typeof data.chapter === "string"
          ? data.chapter
          : "",
      date:
        typeof data.date === "string"
          ? data.date
          : new Date().toISOString().slice(0, 10),
      color:
        data.color === "blue" ||
        data.color === "orange"
          ? data.color
          : "green",
      summary:
        typeof data.summary === "string"
          ? data.summary
          : "",
      keyConcepts: Array.isArray(data.keyConcepts)
        ? data.keyConcepts.filter(
            (value): value is string =>
              typeof value === "string",
          )
        : [],
      keyPoints: Array.isArray(data.keyPoints)
        ? data.keyPoints.filter(
            (value): value is string =>
              typeof value === "string",
          )
        : [],
      definitions: Array.isArray(data.definitions)
        ? data.definitions.filter(
            (value): value is NoteDefinition =>
              typeof value === "object" &&
              value !== null &&
              typeof value.term === "string" &&
              typeof value.definition === "string",
          )
        : [],
      takeaways: Array.isArray(data.takeaways)
        ? data.takeaways.filter(
            (value): value is string =>
              typeof value === "string",
          )
        : [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  });
}

export async function createUserNote(
  uid: string,
  note: Omit<KellyNote, "id" | "createdAt" | "updatedAt">,
): Promise<string> {
  const noteRef = await addDoc(notesCollection(uid), {
    ...note,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return noteRef.id;
}

export async function updateUserNote(
  uid: string,
  noteId: string,
  updates: Partial<Omit<KellyNote, "id" | "createdAt" | "updatedAt">>,
): Promise<void> {
  const noteRef = doc(
    firestore,
    "users",
    uid,
    "notes",
    noteId,
  );

  await updateDoc(noteRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteUserNote(
  uid: string,
  noteId: string,
): Promise<void> {
  const noteRef = doc(
    firestore,
    "users",
    uid,
    "notes",
    noteId,
  );

  await deleteDoc(noteRef);
}

export async function seedUserNotes(
  uid: string,
  notes: Omit<KellyNote, "createdAt" | "updatedAt">[],
): Promise<void> {
  const collectionRef = notesCollection(uid);

  await Promise.all(
    notes.map((note) =>
      setDoc(doc(collectionRef, note.id), {
        ...note,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }),
    ),
  );
}
