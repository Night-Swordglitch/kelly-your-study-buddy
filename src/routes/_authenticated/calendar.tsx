import { createFileRoute } from "@tanstack/react-router";
import { useKellyTheme } from "@/components/kelly/app-shell";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/calendar")({
  component: CalendarPage,
});

type Category = "Assignment" | "Exam" | "Class" | "Deadline" | "Study";

type CalendarEvent = {
  id: number;
  title: string;
  date: string;
  time: string;
  category: Category;
  description: string;
};

const CATEGORY_COLORS: Record<Category, string> = {
  Assignment: "#f59e0b",
  Exam: "#ef4444",
  Class: "#7c5cff",
  Deadline: "#ec4899",
  Study: "#22c55e",
};

const CATEGORY_BG: Record<Category, string> = {
  Assignment: "rgba(245,158,11,.10)",
  Exam: "rgba(239,68,68,.11)",
  Class: "rgba(124,92,255,.10)",
  Deadline: "rgba(236,72,153,.10)",
  Study: "rgba(34,197,94,.10)",
};
const MONOCHROME_CATEGORY_COLORS: Record<Category, string> = {
  Assignment: "#ffffff",
  Exam: "#ffffff",
  Class: "#ffffff",
  Deadline: "#ffffff",
  Study: "#ffffff",
};

const MONOCHROME_CATEGORY_BG: Record<Category, string> = {
  Assignment: "rgba(255,255,255,.055)",
  Exam: "rgba(255,255,255,.065)",
  Class: "rgba(255,255,255,.055)",
  Deadline: "rgba(255,255,255,.06)",
  Study: "rgba(255,255,255,.05)",
};

const SEEDED_EVENTS: CalendarEvent[] = [
  {
    id: 1,
    title: "Math Assignment",
    date: "2026-09-18",
    time: "18:00",
    category: "Assignment",
    description: "Complete the assigned mathematics exercises.",
  },
  {
    id: 2,
    title: "Physics Exam",
    date: "2026-09-22",
    time: "09:00",
    category: "Exam",
    description: "Revision exam covering the current physics unit.",
  },
  {
    id: 3,
    title: "Engineering Class",
    date: "2026-09-24",
    time: "14:00",
    category: "Class",
    description: "Common Engineering Programme class.",
  },
  {
    id: 4,
    title: "Project Deadline",
    date: "2026-09-26",
    time: "23:59",
    category: "Deadline",
    description: "Submit the current project milestone.",
  },
  {
    id: 5,
    title: "Study Session",
    date: "2026-09-28",
    time: "19:30",
    category: "Study",
    description: "Focused revision session.",
  },
];

const CATEGORIES: Category[] = [
  "Assignment",
  "Exam",
  "Class",
  "Deadline",
  "Study",
];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function todayKey() {
  return dateKey(new Date());
}

function parseDateKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatPanelDate(key: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(parseDateKey(key));
}

function CalendarPage() {
  const { theme } = useKellyTheme();

  const categoryColors =
    theme === "monochrome"
      ? MONOCHROME_CATEGORY_COLORS
      : CATEGORY_COLORS;

  const categoryBackgrounds =
    theme === "monochrome"
      ? MONOCHROME_CATEGORY_BG
      : CATEGORY_BG;
  const today = todayKey();

  const [viewDate, setViewDate] = useState(() => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState(today);
  const [events, setEvents] = useState<CalendarEvent[]>(SEEDED_EVENTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState<"header" | "day">("header");
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState(today);
  const [eventTime, setEventTime] = useState("09:00");
  const [category, setCategory] = useState<Category>("Study");
  const [description, setDescription] = useState("");

  const monthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(viewDate);

  const calendarCells = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: Array<Date | null> = [];

    for (let i = 0; i < firstDay; i += 1) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(new Date(year, month, day));
    }

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    return cells;
  }, [viewDate]);

  const selectedEvents = events
    .filter((event) => event.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const openNewEvent = (source: "header" | "day") => {
    setEditingEvent(null);
    setModalSource(source);
    setTitle("");
    setEventDate(source === "header" ? today : selectedDate);
    setEventTime("09:00");
    setCategory("Study");
    setDescription("");
    setModalOpen(true);
  };

  const openEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setModalSource("day");
    setTitle(event.title);
    setEventDate(event.date);
    setEventTime(event.time);
    setCategory(event.category);
    setDescription(event.description);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingEvent(null);
  };

  const submitEvent = (event: React.FormEvent) => {
    event.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle || !eventDate || !eventTime) return;

    if (editingEvent) {
      setEvents((current) =>
        current.map((item) =>
          item.id === editingEvent.id
            ? {
                ...item,
                title: cleanTitle,
                date: eventDate,
                time: eventTime,
                category,
                description: description.trim(),
              }
            : item,
        ),
      );
    } else {
      const newEvent: CalendarEvent = {
        id: Date.now(),
        title: cleanTitle,
        date: eventDate,
        time: eventTime,
        category,
        description: description.trim(),
      };

      setEvents((current) => [...current, newEvent]);
    }

    setSelectedDate(eventDate);

    const parsed = parseDateKey(eventDate);
    setViewDate(new Date(parsed.getFullYear(), parsed.getMonth(), 1));

    closeModal();
  };

  const deleteEvent = (id: number) => {
    setEvents((current) => current.filter((event) => event.id !== id));
  };

  const changeMonth = (offset: number) => {
    setViewDate(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + offset, 1),
    );
  };

  return (
    <div className="kelly-calendar-page">
      <div className="kelly-calendar-header">
        <h1>Calendar</h1>

        <button
          type="button"
          className="kelly-calendar-new-event"
          onClick={() => openNewEvent("header")}
        >
          <Plus size={17} strokeWidth={2.5} />
          New Event
        </button>
      </div>

      <div className="kelly-calendar-layout">
        <section className="kelly-calendar-card">
          <div className="kelly-calendar-month-header">
            <button
              type="button"
              className="kelly-calendar-month-arrow"
              aria-label="Previous month"
              onClick={() => changeMonth(-1)}
            >
              <ChevronLeft size={19} />
            </button>

            <strong>{monthName}</strong>

            <button
              type="button"
              className="kelly-calendar-month-arrow"
              aria-label="Next month"
              onClick={() => changeMonth(1)}
            >
              <ChevronRight size={19} />
            </button>
          </div>

          <div className="kelly-calendar-weekdays">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="kelly-calendar-grid">
            {calendarCells.map((date, index) => {
              if (!date) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="kelly-calendar-cell empty"
                  />
                );
              }

              const key = dateKey(date);
              const dayEvents = events.filter((event) => event.date === key);
              const selected = key === selectedDate;

              return (
                <button
                  type="button"
                  key={key}
                  className={`kelly-calendar-cell${selected ? " selected" : ""}`}
                  onClick={() => setSelectedDate(key)}
                >
                  <span className="kelly-calendar-day-number">
                    {date.getDate()}
                  </span>

                  <span className="kelly-calendar-event-dots">
                    {dayEvents.slice(0, 4).map((event) => (
                      <span
                        key={event.id}
                        className="kelly-calendar-event-dot"
                        style={{
                          background: categoryColors[event.category],
                        }}
                      />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="kelly-calendar-legend">
            {CATEGORIES.map((item) => (
              <span key={item}>
                <i
                  style={{
                    background: categoryColors[item],
                  }}
                />
                {item}
              </span>
            ))}
          </div>
        </section>

        <aside className="kelly-calendar-detail-card">
          <div className="kelly-calendar-detail-header">
            <strong>{formatPanelDate(selectedDate)}</strong>

            <button
              type="button"
              className="kelly-calendar-day-add"
              aria-label="Add event to selected day"
              onClick={() => openNewEvent("day")}
            >
              <Plus size={17} strokeWidth={2.5} />
            </button>
          </div>

          <div className="kelly-calendar-events">
            {selectedEvents.length === 0 ? (
              <div className="kelly-calendar-empty-state">
                <CalendarDays size={24} />
                <span>No events</span>
              </div>
            ) : (
              selectedEvents.map((event) => (
                <article
                  key={event.id}
                  className="kelly-calendar-event-card"
                  style={{
                    background: categoryBackgrounds[event.category],
                    borderColor: `${categoryColors[event.category]}33`,
                  }}
                >
                  <div className="kelly-calendar-event-top">
                    <strong>{event.title}</strong>

                    <div className="kelly-calendar-event-actions">
                      <button
                        type="button"
                        aria-label={`Edit ${event.title}`}
                        onClick={() => openEditEvent(event)}
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        type="button"
                        className="delete"
                        aria-label={`Delete ${event.title}`}
                        onClick={() => deleteEvent(event.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div
                    className="kelly-calendar-event-time"
                    style={{ color: categoryColors[event.category] }}
                  >
                    <Clock3 size={14} />
                    {event.time}
                  </div>

                  <div
                    className="kelly-calendar-event-category"
                    style={{ color: categoryColors[event.category] }}
                  >
                    {event.category}
                  </div>

                  {event.description && (
                    <p>{event.description}</p>
                  )}
                </article>
              ))
            )}
          </div>
        </aside>
      </div>

      {modalOpen && (
        <div
          className="kelly-calendar-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <form
            className="kelly-calendar-modal"
            onSubmit={submitEvent}
          >
            <div className="kelly-calendar-modal-header">
              <strong>{editingEvent ? "Edit Event" : "New Event"}</strong>

              <button
                type="button"
                className="kelly-calendar-modal-close"
                aria-label="Close"
                onClick={closeModal}
              >
                <X size={18} />
              </button>
            </div>

            <label className="kelly-calendar-field">
              <span>Event title</span>
              <input
                autoFocus
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Mathematics revision"
                required
              />
            </label>

            <div className="kelly-calendar-field-row">
              <label className="kelly-calendar-field">
                <span>Date</span>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(event) => setEventDate(event.target.value)}
                  required
                />
              </label>

              <label className="kelly-calendar-field">
                <span>Time</span>
                <input
                  type="time"
                  value={eventTime}
                  onChange={(event) => setEventTime(event.target.value)}
                  required
                />
              </label>
            </div>

            <label className="kelly-calendar-field">
              <span>Category</span>
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as Category)
                }
              >
                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="kelly-calendar-field">
              <span>Description (optional)</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add some details..."
                rows={3}
              />
            </label>

            <div className="kelly-calendar-modal-actions">
              <button
                type="submit"
                className="kelly-calendar-add-button"
              >
                {editingEvent ? "Save Changes" : "Add Event"}
              </button>

              <button
                type="button"
                className="kelly-calendar-cancel-button"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}


