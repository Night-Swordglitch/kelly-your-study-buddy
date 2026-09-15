import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Pencil, Trash2 } from "lucide-react";
import { AppShell } from "@/components/kelly/app-shell";

export const Route = createFileRoute("/_authenticated/notes")({
  head: () => ({
    meta: [{ title: "Notes — Kelly" }],
  }),
  component: NotesPage,
});

type NoteColor = "green" | "blue" | "orange";

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
  definitions: { term: string; definition: string }[];
  takeaways: string[];
};

const notes: Note[] = [
  {
    id: "cell-division",
    title: "Cell Division",
    subject: "Biology",
    chapter: "Chapter 4",
    date: "2026-09-12",
    color: "green",
    summary:
      "Cell division is the process by which a parent cell produces new cells. Mitosis produces genetically similar body cells for growth and repair, while meiosis produces genetically varied sex cells.",
    keyConcepts: ["Mitosis", "Meiosis", "Cell Cycle", "Chromosomes", "Cytokinesis"],
    keyPoints: [
      "The cell cycle consists of growth, DNA replication, and cell division.",
      "Mitosis produces two genetically similar daughter cells.",
      "Meiosis produces four genetically varied cells with half the chromosome number.",
      "DNA is replicated before nuclear division begins.",
      "Cytokinesis separates the cytoplasm into daughter cells.",
    ],
    definitions: [
      { term: "Mitosis", definition: "A type of cell division that produces two genetically similar daughter cells." },
      { term: "Meiosis", definition: "A specialised type of division that produces cells with half the normal chromosome number." },
      { term: "Cytokinesis", definition: "The division of the cytoplasm to form separate daughter cells." },
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
    keyConcepts: ["Standard Form", "Factorisation", "Quadratic Formula", "Discriminant", "Roots"],
    keyPoints: [
      "The standard form of a quadratic equation is ax² + bx + c = 0.",
      "Factorisation can be used when the quadratic can be split into suitable factors.",
      "The quadratic formula works for any quadratic equation.",
      "The discriminant helps determine the number and type of roots.",
      "A quadratic may have two, one, or no real roots.",
    ],
    definitions: [
      { term: "Quadratic Equation", definition: "An equation in which the highest power of the variable is two." },
      { term: "Discriminant", definition: "The expression b² − 4ac, which indicates the nature of the roots." },
      { term: "Root", definition: "A value of the variable that makes the quadratic equation equal to zero." },
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
    title: "World War II — Causes",
    subject: "History",
    chapter: "Chapter 12",
    date: "2026-09-08",
    color: "orange",
    summary:
      "World War II resulted from a combination of political, economic, and military factors, including unresolved tensions after World War I, aggressive expansion, and the failure of collective security.",
    keyConcepts: ["Treaty of Versailles", "Appeasement", "Expansionism", "Collective Security", "Axis Powers"],
    keyPoints: [
      "The Treaty of Versailles created resentment and instability in Germany.",
      "Economic hardship contributed to political extremism.",
      "Germany, Italy, and Japan pursued aggressive territorial expansion.",
      "Appeasement failed to prevent further German expansion.",
      "The invasion of Poland in 1939 led Britain and France to declare war.",
    ],
    definitions: [
      { term: "Appeasement", definition: "A policy of making concessions to an aggressive power in an attempt to avoid conflict." },
      { term: "Expansionism", definition: "A policy of increasing a country's territory or influence." },
      { term: "Collective Security", definition: "The idea that countries should work together to respond to aggression." },
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
  if (color === "blue") return "note-subject-blue";
  if (color === "orange") return "note-subject-orange";
  return "note-subject-green";
}

function metaSubjectClass(color: NoteColor) {
  return subjectClass(color);
}

function NotesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = notes.filter((note) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      note.title.toLowerCase().includes(q) ||
      note.subject.toLowerCase().includes(q) ||
      note.chapter.toLowerCase().includes(q)
    );
  });

  const selected = notes.find((n) => n.id === selectedId) ?? null;

  return (
    <AppShell>
      <div className="kelly-notes-page">
        <aside className="kelly-notes-list">
          <div className="kelly-notes-header">
            <h1>Notes</h1>
            <button type="button" className="kelly-notes-new">
              + New
            </button>
          </div>

          <div className="kelly-notes-search">
            <input
              type="search"
              placeholder="Search notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div>
            {filtered.map((note) => (
              <button
                key={note.id}
                type="button"
                className="kelly-note-item"
                onClick={() => setSelectedId(note.id)}
              >
                <div>
                  <strong>{note.title}</strong>
                  <div className="kelly-note-meta">
                    <span className={subjectClass(note.color)}>{note.subject}</span>
                    <span style={{ color: "#696975" }}>{note.date}</span>
                  </div>
                </div>
                <span style={{ color: "#5e5e69", fontSize: 20 }}>›</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="kelly-note-reader">
          {!selected && (
            <div style={{ textAlign: "center", paddingTop: 100, color: "#858591" }}>
              <p>Select a note to read it</p>
            </div>
          )}

          {selected && (
            <article>
              <div className="kelly-note-detail-top">
                <div>
                  <h1>{selected.title}</h1>
                  <div className="kelly-detail-meta">
                    <span className={metaSubjectClass(selected.color)}>{selected.subject}</span>
                    {" · "}
                    {selected.chapter}
                    {" · "}
                    {selected.date}
                  </div>
                </div>

                <div className="kelly-detail-actions">
                  <button type="button" className="kelly-note-action">
                    <Pencil size={13} />
                    Edit
                  </button>
                  <button type="button" className="kelly-note-action kelly-note-delete">
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>

              <section className="kelly-note-section">
                <div className="kelly-note-section-label">SUMMARY</div>
                <div className="kelly-note-summary">{selected.summary}</div>
              </section>

              <section className="kelly-note-section">
                <div className="kelly-note-section-label">KEY CONCEPTS</div>
                <div className="kelly-concept-chips">
                  {selected.keyConcepts.map((c) => (
                    <span key={c} className="kelly-concept-chip">
                      {c}
                    </span>
                  ))}
                </div>
              </section>

              <section className="kelly-note-section">
                <div className="kelly-note-section-label">KEY POINTS</div>
                <ul className="kelly-key-points">
                  {selected.keyPoints.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </section>

              <section className="kelly-note-section">
                <div className="kelly-note-section-label">DEFINITIONS</div>
                <div className="kelly-definitions">
                  {selected.definitions.map((d) => (
                    <div key={d.term} className="kelly-definition-card">
                      <div className="kelly-definition-term">{d.term}</div>
                      <div className="kelly-definition-text">{d.definition}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="kelly-note-section">
                <div className="kelly-note-section-label">TAKEAWAYS</div>
                <div className="kelly-takeaways">
                  {selected.takeaways.map((t) => (
                    <div key={t} className="kelly-takeaway">
                      <span className="kelly-takeaway-check">✓</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </section>
            </article>
          )}
        </main>
      </div>
    </AppShell>
  );
}