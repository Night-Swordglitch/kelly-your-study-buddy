import { useEffect, useMemo, useState } from "react";
import { useKellyXP } from "@/components/kelly/app-shell";
import {
  ChevronDown,
  Clock,
  Mic,
  Pause,
  Save,
  StickyNote,
  Trash2,
} from "lucide-react";

const SUBJECTS = [
  "Biology",
  "Mathematics",
  "History",
  "Physics",
  "Chemistry",
  "English",
  "Geography",
];

type PreviousRecording = {
  id: string;
  title: string;
  duration: string;
  date: string;
};

const INITIAL_RECORDINGS: PreviousRecording[] = [
  {
    id: "biology-cell-division",
    title: "Biology Lecture — Cell Division",
    duration: "54:00",
    date: "2026-09-12",
  },
];

function formatElapsedTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");

  const seconds = (totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function formatDate() {
  return new Date().toISOString().slice(0, 10);
}

export function ListenTranscribePage() {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [recordingStopped, setRecordingStopped] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [subject, setSubject] = useState(SUBJECTS[0] ?? "Biology");
  const [recordings, setRecordings] =
    useState<PreviousRecording[]>(INITIAL_RECORDINGS);
  const { addXP } = useKellyXP();
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!recording) return;

    const interval = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [recording]);

  useEffect(() => {
    if (!feedback) return;

    const timeout = window.setTimeout(() => {
      setFeedback("");
    }, 2600);

    return () => window.clearTimeout(timeout);
  }, [feedback]);

  const waveformBars = useMemo(
    () =>
      Array.from({ length: 44 }, (_, index) => ({
        id: index,
        height: recording
          ? 8 + ((index * 17) % 34)
          : recordingStopped
            ? 8 + ((index * 11) % 24)
            : 2,
      })),
    [recording, recordingStopped],
  );

  const resetRecorder = () => {
    setRecording(false);
    setPaused(false);
    setRecordingStopped(false);
    setElapsedSeconds(0);
  };

  const handleStartRecording = () => {
    setRecording(true);
    setPaused(false);
    setRecordingStopped(false);
    setElapsedSeconds(0);
  };

  const handleStopRecording = () => {
    setRecording(false);
    setPaused(false);
    setRecordingStopped(true);
  };

  const handleContinueRecording = () => {
    setPaused(false);
    setRecording(true);
    setRecordingStopped(false);
  };

  const handlePauseRecording = () => {
    setRecording(false);
    setPaused(true);
    setRecordingStopped(false);
  };

  const handleSave = (asNote = false) => {
    const duration = formatElapsedTime(elapsedSeconds);

    const newRecording: PreviousRecording = {
      id: `${subject.toLowerCase()}-${Date.now()}`,
      title: `${subject} Recording`,
      duration,
      date: formatDate(),
    };

    setRecordings((current) => [newRecording, ...current]);
    addXP(25);

    setFeedback(
      asNote
        ? "Recording saved as a note • +25 XP"
        : "Recording saved • +25 XP",
    );

    resetRecorder();
  };

  const handleDiscard = () => {
    setFeedback("Recording discarded");
    resetRecorder();
  };

  const handleDeleteRecording = (id: string) => {
    setRecordings((current) =>
      current.filter((recordingItem) => recordingItem.id !== id),
    );
  };

  return (
    <section className="kelly-listen-page">
      <header className="kelly-listen-header">
        <h1>Listen &amp; Transcribe</h1>
      </header>

      <div className="kelly-listen-grid">
        <section className="kelly-listen-card kelly-listen-recorder">
          <div className="kelly-listen-card-header">
            <h2>New Recording</h2>
          </div>

          <div className="kelly-listen-divider" />

          <div className="kelly-listen-field">
            <div className="kelly-listen-select-wrap">
              <select
                aria-label="Subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className="kelly-listen-select"
                disabled={recording || paused || recordingStopped}
              >
                {SUBJECTS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <ChevronDown
                className="kelly-listen-select-icon"
                size={17}
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="kelly-listen-recorder-center">
            <div className="kelly-listen-timer">
              {formatElapsedTime(elapsedSeconds)}
            </div>

            <p className="kelly-listen-status">
              {recording
                ? "Recording..."
                : paused
                  ? "Recording paused"
                  : recordingStopped
                    ? "Recording complete"
                    : "Ready to record"}
            </p>

            <div
              className={`kelly-listen-waveform${
                recording ? " is-recording" : ""
              }${recordingStopped ? " is-stopped" : ""}`}
              aria-hidden="true"
            >
              {waveformBars.map((bar) => (
                <span
                  key={bar.id}
                  style={{ height: `${bar.height}px` }}
                />
              ))}
            </div>

            {!recording && !paused && !recordingStopped && (
              <button
                type="button"
                className="kelly-listen-record-button"
                onClick={handleStartRecording}
              >
                <Mic size={17} strokeWidth={2.1} />
                <span>Start Recording</span>
              </button>
            )}

            {(recording || paused) && (
              <div className="kelly-listen-recording-controls">
                {paused ? (
                  <button
                    type="button"
                    className="kelly-listen-continue-button"
                    onClick={handleContinueRecording}
                    aria-label="Continue recording"
                  >
                    <Mic
                      size={16}
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                    <span>Continue</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="kelly-listen-pause-button"
                    onClick={handlePauseRecording}
                    aria-label="Pause recording"
                  >
                    <Pause
                      size={16}
                      strokeWidth={2.4}
                      className="kelly-listen-pause-icon"
                      aria-hidden="true"
                    />
                    <span>Pause</span>
                  </button>
                )}

                <button
                  type="button"
                  className="kelly-listen-stop-button"
                  onClick={handleStopRecording}
                  aria-label="Stop recording"
                >
                  <span
                    className="kelly-listen-stop-icon"
                    aria-hidden="true"
                  />
                  <span>Stop</span>
                </button>
              </div>
            )}

            {!recording && !paused && recordingStopped && (
              <button
                type="button"
                className="kelly-listen-continue-button"
                onClick={handleContinueRecording}
                aria-label="Continue recording"
              >
                <Mic
                  size={16}
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
                <span>Continue</span>
              </button>
            )}

            {recordingStopped && (
              <div className="kelly-listen-record-actions">
                <button
                  type="button"
                  className="kelly-listen-action-button is-primary"
                  onClick={() => handleSave(false)}
                >
                  <Save size={16} strokeWidth={2} />
                  <span>Save Recording</span>
                </button>

                <button
                  type="button"
                  className="kelly-listen-action-button"
                  onClick={() => handleSave(true)}
                >
                  <StickyNote size={16} strokeWidth={2} />
                  <span>Save as Note</span>
                </button>

                <button
                  type="button"
                  className="kelly-listen-action-button is-danger"
                  onClick={handleDiscard}
                >
                  <Trash2 size={16} strokeWidth={2} />
                  <span>Discard</span>
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="kelly-listen-card kelly-listen-transcript">
          <div className="kelly-listen-card-header">
            <h2>Live Transcript</h2>
          </div>

          <div className="kelly-listen-transcript-empty">
            <p>
              {recording
                ? "Listening for transcript..."
                : "Start recording to see transcript"}
            </p>
          </div>
        </section>
      </div>

      <section className="kelly-listen-history">
        <div className="kelly-listen-history-label">
          PREVIOUS RECORDINGS
        </div>

        <div className="kelly-listen-recordings">
          {recordings.map((recordingItem) => (
            <article
              key={recordingItem.id}
              className="kelly-listen-recording-row"
            >
              <div className="kelly-listen-recording-icon">
                <Mic size={18} strokeWidth={2} />
              </div>

              <div className="kelly-listen-recording-info">
                <strong>{recordingItem.title}</strong>

                <div className="kelly-listen-recording-meta">
                  <Clock size={13} strokeWidth={2} />
                  <span>{recordingItem.duration}</span>
                  <span className="kelly-listen-recording-dot">·</span>
                  <span>{recordingItem.date}</span>
                </div>
              </div>

              <button
                type="button"
                className="kelly-listen-recording-delete"
                onClick={() => handleDeleteRecording(recordingItem.id)}
                aria-label={`Delete ${recordingItem.title}`}
                title="Delete recording"
              >
                <Trash2 size={16} strokeWidth={2} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {feedback && (
        <div className="kelly-listen-feedback" role="status">
          {feedback}
        </div>
      )}
    </section>
  );
}



