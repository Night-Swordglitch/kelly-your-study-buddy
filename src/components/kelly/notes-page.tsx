import { useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "@/lib/firebase";
import {
  deleteUserNote,
  KellyNote,
  loadUserNotes,
  seedUserNotes,
} from "@/lib/kelly-notes";

type NoteColor = "green" | "blue" | "orange";

type NoteDefinition = {
  term: string;
  definition: string;
};

type Note = {
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
};

const INITIAL_NOTES: Note[] = [
  {
    id: "cell-division",
    title: "Cell Division",
    subject: "Biology",
    chapter: "Chapter 4",
    date: "2026-09-12",
    color: "green",
    summary:
      "Cell division is the process by which a parent cell produces new cells. Mitosis produces genetically similar body cells for growth and repair, while meiosis produces genetically varied sex cells.",
    keyConcepts: [
      "Mitosis",
      "Meiosis",
      "Cell Cycle",
      "Chromosomes",
      "Cytokinesis",
    ],
    keyPoints: [
      "The cell cycle consists of growth, DNA replication, and cell division.",
      "Mitosis produces two genetically similar daughter cells.",
      "Meiosis produces four genetically varied cells with half the chromosome number.",
      "DNA is replicated before nuclear division begins.",
      "Cytokinesis separates the cytoplasm into daughter cells.",
    ],
    definitions: [
      {
        term: "Mitosis",
        definition:
          "A type of cell division that produces two genetically similar daughter cells.",
      },
      {
        term: "Meiosis",
        definition:
          "A specialised type of division that produces cells with half the normal chromosome number.",
      },
      {
        term: "Cytokinesis",
        definition:
          "The division of the cytoplasm to form separate daughter cells.",
      },
    ],
    takeaways: [
      "Know the main stages of the cell cycle.",
      "Understand the difference between mitosis and meiosis.",
      "Remember that DNA replication occurs before cell division.",
      "Know why meiosis creates genetic variation.",
    ],
  },
  {
    id: "quadratic-equations",
    title: "Quadratic Equations",
    subject: "Mathematics",
    chapter: "Chapter 7",
    date: "2026-09-10",
    color: "blue",
    summary:
      "Quadratic equations contain a variable raised to the second power. They can be solved using factorisation, completing the square, or the quadratic formula.",
    keyConcepts: [
      "Standard Form",
      "Factorisation",
      "Quadratic Formula",
      "Discriminant",
      "Roots",
    ],
    keyPoints: [
      "The standard form of a quadratic equation is axÂ² + bx + c = 0.",
      "Factorisation can be used when the quadratic can be split into suitable factors.",
      "The quadratic formula works for any quadratic equation.",
      "The discriminant helps determine the number and type of roots.",
      "A quadratic may have two, one, or no real roots.",
    ],
    definitions: [
      {
        term: "Quadratic Equation",
        definition:
          "An equation in which the highest power of the variable is two.",
      },
      {
        term: "Discriminant",
        definition:
          "The expression bÂ² - 4ac, which indicates the nature of the roots.",
      },
      {
        term: "Root",
        definition:
          "A value of the variable that makes the quadratic equation equal to zero.",
      },
    ],
    takeaways: [
      "Identify a, b, and c correctly before using the formula.",
      "Check factorised answers by substitution.",
      "Use the discriminant to predict the number of real roots.",
      "Remember that signs matter when substituting into the formula.",
    ],
  },
  {
    id: "ww2-causes",
    title: "World War II â€” Causes",
    subject: "History",
    chapter: "Chapter 12",
    date: "2026-09-08",
    color: "orange",
    summary:
      "World War II resulted from a combination of political, economic, and military factors, including unresolved tensions after World War I, aggressive expansion, and the failure of collective security.",
    keyConcepts: [
      "Treaty of Versailles",
      "Appeasement",
      "Expansionism",
      "Collective Security",
      "Axis Powers",
    ],
    keyPoints: [
      "The Treaty of Versailles created resentment and instability in Germany.",
      "Economic hardship contributed to political extremism.",
      "Germany, Italy, and Japan pursued aggressive territorial expansion.",
      "Appeasement failed to prevent further German expansion.",
      "The invasion of Poland in 1939 led Britain and France to declare war.",
    ],
    definitions: [
      {
        term: "Appeasement",
        definition:
          "A policy of making concessions to an aggressive power in an attempt to avoid conflict.",
      },
      {
        term: "Expansionism",
        definition:
          "A policy of increasing a country's territory or influence.",
      },
      {
        term: "Collective Security",
        definition:
          "The idea that countries should work together to respond to aggression.",
      },
    ],
    takeaways: [
      "Understand how the Treaty of Versailles contributed to German resentment.",
      "Know why appeasement failed.",
      "Connect economic instability with political extremism.",
      "Remember the significance of the invasion of Poland in 1939.",
    ],
  },
];

function subjectClass(color: NoteColor) {
  return `note-subject-${color}`;
}

function metaSubjectClass(color: NoteColor) {
  return `meta-subject-${color}`;
}

function normalizeNote(note: KellyNote): Note {
  return {
    id: note.id,
    title: note.title,
    subject: note.subject,
    chapter: note.chapter,
    date: note.date,
    color: note.color,
    summary: note.summary,
    keyConcepts: note.keyConcepts,
    keyPoints: note.keyPoints,
    definitions: note.definitions,
    takeaways: note.takeaways,
  };
}

export function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadNotes() {
      try {
        const user = await getCurrentUser();

        if (!user) {
          if (!cancelled) {
            setNotes(INITIAL_NOTES);
            setLoading(false);
          }
          return;
        }

        let firestoreNotes = await loadUserNotes(user.uid);

        if (firestoreNotes.length === 0) {
          await seedUserNotes(
            user.uid,
            INITIAL_NOTES.map((note) => ({
              ...note,
            })),
          );

          firestoreNotes = await loadUserNotes(user.uid);
        }

        if (!cancelled) {
          setNotes(firestoreNotes.map(normalizeNote));
        }
      } catch (error) {
        console.error("Failed to load KELLY notes:", error);

        if (!cancelled) {
          setNotes(INITIAL_NOTES);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadNotes();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId) ?? null,
    [notes, selectedNoteId],
  );

  const filteredNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return notes;

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.subject.toLowerCase().includes(query) ||
        note.chapter.toLowerCase().includes(query),
    );
  }, [notes, searchQuery]);

  const handleDelete = async () => {
    if (!selectedNoteId) return;

    const user = await getCurrentUser();

    if (!user) return;

    try {
      await deleteUserNote(user.uid, selectedNoteId);

      setNotes((current) =>
        current.filter((note) => note.id !== selectedNoteId),
      );
      setSelectedNoteId(null);
    } catch (error) {
      console.error("Failed to delete KELLY note:", error);
      window.alert("Unable to delete this note right now.");
    }
  };

  const handleNewNote = () => {
    window.alert("New Note will be connected to the note editor next.");
  };

  const handleEdit = () => {
    if (!selectedNoteId) return;
    window.alert("Edit mode will be connected to the note editor next.");
  };

  return (
    <section className="kelly-notes-page-react">
      <aside className="kelly-notes-list">
        <div className="kelly-notes-header">
          <h1>Notes</h1>

          <button
            type="button"
            className="kelly-notes-new"
            onClick={handleNewNote}
          >
            <span>+</span>
            New
          </button>
        </div>

        <div className="kelly-notes-search">
          <span className="kelly-notes-search-icon" aria-hidden="true">
            ?
          </span>

          <input
            type="search"
            aria-label="Search notes"
            placeholder="Search notes..."
            autoComplete="off"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>

        <div className="kelly-note-items">
          {!loading &&
            filteredNotes.map((note) => (
              <button
                key={note.id}
                type="button"
                className={`kelly-note-item${
                  selectedNoteId === note.id ? " active" : ""
                }`}
                onClick={() => setSelectedNoteId(note.id)}
              >
                <div className="kelly-note-item-copy">
                  <strong>{note.title}</strong>

                  <span>
                    <b className={subjectClass(note.color)}>{note.subject}</b>
                    <em>{note.date}</em>
                  </span>
                </div>

                <span className="kelly-note-chevron" aria-hidden="true">
                  â€º
                </span>
              </button>
            ))}
        </div>
      </aside>

      <main className="kelly-note-reader">
        {!selectedNote ? (
          <div className="kelly-notes-empty">
            <div className="kelly-notes-empty-icon" aria-hidden="true">
              <span />
            </div>

            <p>{loading ? "Loading notes..." : "Select a note to read it"}</p>

            <button
              type="button"
              className="kelly-create-note"
              onClick={handleNewNote}
            >
              Create your first note
            </button>
          </div>
        ) : (
          <article className="kelly-note-detail">
            <div className="kelly-note-detail-top">
              <div>
                <h1>{selectedNote.title}</h1>

                <div className="kelly-detail-meta">
                  <span className={metaSubjectClass(selectedNote.color)}>
                    {selectedNote.subject}
                  </span>
                  {" Â· "}
                  {selectedNote.chapter}
                  {" Â· "}
                  {selectedNote.date}
                </div>
              </div>

              <div className="kelly-detail-actions">
                <button
                  type="button"
                  className="kelly-note-action"
                  onClick={handleEdit}
                >
                  <span aria-hidden="true">?</span>
                  Edit
                </button>

                <button
                  type="button"
                  className="kelly-note-action kelly-note-delete"
                  onClick={handleDelete}
                >
                  <span aria-hidden="true">Ã—</span>
                  Delete
                </button>
              </div>
            </div>

            <div className="kelly-note-sections">
              <section className="kelly-note-section">
                <div className="kelly-note-section-label">SUMMARY</div>
                <div className="kelly-note-summary">
                  {selectedNote.summary}
                </div>
              </section>

              <section className="kelly-note-section">
                <div className="kelly-note-section-label">KEY CONCEPTS</div>

                <div className="kelly-concept-chips">
                  {selectedNote.keyConcepts.map((concept) => (
                    <span key={concept} className="kelly-concept-chip">
                      {concept}
                    </span>
                  ))}
                </div>
              </section>

              <section className="kelly-note-section">
                <div className="kelly-note-section-label">KEY POINTS</div>

                <ul className="kelly-key-points">
                  {selectedNote.keyPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>

              <section className="kelly-note-section">
                <div className="kelly-note-section-label">DEFINITIONS</div>

                <div className="kelly-definitions">
                  {selectedNote.definitions.map((definition) => (
                    <div
                      key={definition.term}
                      className="kelly-definition-card"
                    >
                      <div className="kelly-definition-term">
                        {definition.term}
                      </div>

                      <div className="kelly-definition-text">
                        {definition.definition}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="kelly-note-section">
                <div className="kelly-note-section-label">TAKEAWAYS</div>

                <div className="kelly-takeaways">
                  {selectedNote.takeaways.map((takeaway) => (
                    <div key={takeaway} className="kelly-takeaway">
                      <span
                        className="kelly-takeaway-check"
                        aria-hidden="true"
                      >
                        ?
                      </span>

                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </article>
        )}
      </main>
    </section>
  );
}
