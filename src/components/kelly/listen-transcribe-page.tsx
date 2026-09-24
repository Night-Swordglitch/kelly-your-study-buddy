import { useEffect, useMemo, useRef, useState } from "react";
import { useKellyXP } from "@/components/kelly/app-shell";
import {
  ChevronDown,
  Clock,
  Mic,
  Pause,
  Play,
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
  audioUrl?: string | undefined;
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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordedAudioUrlRef = useRef<string | null>(null);

  const [activePlaybackId, setActivePlaybackId] = useState<string | null>(null);
  const [playbackCurrentSeconds, setPlaybackCurrentSeconds] = useState(0);
  const [playbackTotalSeconds, setPlaybackTotalSeconds] = useState(0);
  const [isPlaybackPlaying, setIsPlaybackPlaying] = useState(false);

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

  const parseDuration = (value: string) => {
    const parts = value.split(":").map(Number);

    if (
      parts.length !== 2 ||
      parts.some((part) => !Number.isFinite(part))
    ) {
      return 0;
    }

    return Math.max(
      0,
      (parts[0] ?? 0) * 60 + (parts[1] ?? 0),
    );
  };

  const finishAudioCapture = () => {
    if (recordedAudioUrlRef.current) {
      return recordedAudioUrlRef.current;
    }

    if (audioChunksRef.current.length === 0) {
      return null;
    }

    const recorder = audioRecorderRef.current;
    const mimeType = recorder?.mimeType || "audio/webm";

    const blob = new Blob(audioChunksRef.current, {
      type: mimeType,
    });

    recordedAudioUrlRef.current = URL.createObjectURL(blob);

    return recordedAudioUrlRef.current;
  };

  const startAudioCapture = async () => {
    if (
      !navigator.mediaDevices?.getUserMedia ||
      !("MediaRecorder" in window)
    ) {
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      audioStreamRef.current = stream;
      audioChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported(
        "audio/webm;codecs=opus",
      )
        ? "audio/webm;codecs=opus"
        : "";

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        finishAudioCapture();
      };

      audioRecorderRef.current = recorder;
      recorder.start();

      return true;
    } catch {
      setFeedback("Replay audio could not access the microphone.");
      return false;
    }
  };

  const resetRecorder = (clearAudio = true) => {
    if (audioRecorderRef.current) {
      try {
        if (audioRecorderRef.current.state !== "inactive") {
          audioRecorderRef.current.stop();
        }
      } catch {
        // Ignore recorder shutdown errors.
      }
    }

    audioRecorderRef.current = null;

    audioStreamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    audioStreamRef.current = null;
    audioChunksRef.current = [];

    if (clearAudio && recordedAudioUrlRef.current) {
      URL.revokeObjectURL(recordedAudioUrlRef.current);
      recordedAudioUrlRef.current = null;
    }

    setRecording(false);
    setPaused(false);
    setRecordingStopped(false);
    setElapsedSeconds(0);
  };

  const handleStartRecording = async () => {
    await startAudioCapture();

    setRecording(true);
    setPaused(false);
    setRecordingStopped(false);
    setElapsedSeconds(0);
  };

  const handleStopRecording = () => {
    setRecording(false);
    setPaused(false);
    setRecordingStopped(true);

    if (audioRecorderRef.current?.state === "recording") {
      audioRecorderRef.current.stop();
    }
  };

  const handleContinueRecording = () => {
    if (audioRecorderRef.current?.state === "paused") {
      audioRecorderRef.current.resume();
    }

    setPaused(false);
    setRecording(true);
    setRecordingStopped(false);
  };

  const handlePauseRecording = () => {
    setRecording(false);
    setPaused(true);
    setRecordingStopped(false);

    if (audioRecorderRef.current?.state === "recording") {
      audioRecorderRef.current.pause();
    }
  };

  const handleSave = (asNote = false) => {
    const duration = formatElapsedTime(elapsedSeconds);
    const audioUrl = finishAudioCapture();

    const newRecording: PreviousRecording = {
      id: `${subject.toLowerCase()}-${Date.now()}`,
      title: `${subject} Recording`,
      duration,
      date: formatDate(),
      audioUrl: audioUrl ?? undefined,
    };

    setRecordings((current) => [newRecording, ...current]);

    addXP(25);

    setFeedback(
      asNote
        ? "Recording saved as a note • +25 XP"
        : "Recording saved • +25 XP",
    );

    recordedAudioUrlRef.current = null;
    resetRecorder(false);
  };

  const handleDiscard = () => {
    setFeedback("Recording discarded");
    resetRecorder(true);
  };

  const handleReplay = (recordingItem: PreviousRecording) => {
    if (!recordingItem.audioUrl) {
      return;
    }

    const isSameRecording =
      activePlaybackId === recordingItem.id;

    if (isSameRecording && isPlaybackPlaying) {
      audioRef.current?.pause();
      setIsPlaybackPlaying(false);
      return;
    }

    audioRef.current?.pause();

    const audio = new Audio();
    audio.preload = "auto";
    audio.src = recordingItem.audioUrl;
    audioRef.current = audio;

    setActivePlaybackId(recordingItem.id);
    setPlaybackCurrentSeconds(0);
    setPlaybackTotalSeconds(
      parseDuration(recordingItem.duration),
    );

    audio.onloadedmetadata = () => {
      if (Number.isFinite(audio.duration)) {
        setPlaybackTotalSeconds(audio.duration);
      }
    };

    audio.ontimeupdate = () => {
      setPlaybackCurrentSeconds(
        Number.isFinite(audio.currentTime)
          ? audio.currentTime
          : 0,
      );
    };

    audio.onplay = () => {
      setIsPlaybackPlaying(true);
    };

    audio.onpause = () => {
      setIsPlaybackPlaying(false);
    };

    audio.onended = () => {
      setIsPlaybackPlaying(false);
      setPlaybackCurrentSeconds(0);
    };

    audio.onerror = (event) => {
      console.error("Replay audio failed:", event);
      setIsPlaybackPlaying(false);
    };

    void audio.play().catch((error) => {
      console.error("Replay playback failed:", error);
      setIsPlaybackPlaying(false);
    });
  };

  const handleDeleteRecording = (id: string) => {
    setRecordings((current) => {
      const target = current.find(
        (recordingItem) => recordingItem.id === id,
      );

      if (target?.audioUrl) {
        URL.revokeObjectURL(target.audioUrl);
      }

      return current.filter(
        (recordingItem) => recordingItem.id !== id,
      );
    });

    if (activePlaybackId === id) {
      audioRef.current?.pause();
      audioRef.current = null;
      setActivePlaybackId(null);
      setIsPlaybackPlaying(false);
      setPlaybackCurrentSeconds(0);
      setPlaybackTotalSeconds(0);
    }
  };

  const playbackProgress =
    playbackTotalSeconds > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (playbackCurrentSeconds / playbackTotalSeconds) * 100,
          ),
        )
      : 0;

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });

      if (recordedAudioUrlRef.current) {
        URL.revokeObjectURL(recordedAudioUrlRef.current);
      }
    };
  }, []);

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

                {recordingItem.audioUrl && (
                  <div className="kelly-listen-replay-wrap">
                    <button
                      type="button"
                      className="kelly-listen-replay-button"
                      onClick={() => handleReplay(recordingItem)}
                      aria-label={
                        isPlaybackPlaying &&
                        activePlaybackId === recordingItem.id
                          ? `Pause ${recordingItem.title}`
                          : `Replay ${recordingItem.title}`
                      }
                    >
                      {isPlaybackPlaying &&
                      activePlaybackId === recordingItem.id ? (
                        <Pause size={12} strokeWidth={2.2} />
                      ) : (
                        <Play size={12} strokeWidth={2.2} />
                      )}

                      <span>
                        {isPlaybackPlaying &&
                        activePlaybackId === recordingItem.id
                          ? "Pause"
                          : "Replay"}
                      </span>
                    </button>

                    {activePlaybackId === recordingItem.id && (
                      <div className="kelly-listen-replay-player is-open">
                        <span className="kelly-listen-replay-time">
                          {formatElapsedTime(playbackCurrentSeconds)}
                        </span>

                        <div
                          className="kelly-listen-replay-track"
                          aria-hidden="true"
                        >
                          <span
                            className="kelly-listen-replay-fill"
                            style={{
                              width: `${playbackProgress}%`,
                            }}
                          />

                          <span
                            className="kelly-listen-replay-dot"
                            style={{
                              left: `${playbackProgress}%`,
                            }}
                          />
                        </div>

                        <span className="kelly-listen-replay-time">
                          {formatElapsedTime(playbackTotalSeconds || parseDuration(recordingItem.duration))}
                        </span>
                      </div>
                    )}
                  </div>
                )}
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








