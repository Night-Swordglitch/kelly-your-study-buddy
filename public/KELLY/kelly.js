(() => {
  "use strict";

  // ─────────────────────────────────────────────
  // KELLY — UI / NAVIGATION CONTROLLER
  // ─────────────────────────────────────────────

  const ROOT_VIEWS = [
    "view-landing",
    "view-login",
    "view-signup",
    "view-onboarding",
    "view-app",
  ];

  const APP_PAGES = [
    "home",
    "notes",
    "subjects",
    "study",
    "quizzes",
    "create-quiz",
    "quiz-taking",
    "quiz-results",
    "flashcards",
    "groups",
    "calendar",
    "progress",
    "profile",
  ];

  // ─────────────────────────────────────────────
  // ROOT VIEW NAVIGATION
  // ─────────────────────────────────────────────

  window.showRoot = function (viewId) {
    ROOT_VIEWS.forEach((id) => {
      const view = document.getElementById(id);

      if (view) {
        view.classList.toggle("active", id === viewId);
      }
    });

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };

  // ─────────────────────────────────────────────
  // APP PAGE NAVIGATION
  // ─────────────────────────────────────────────

  window.showPage = function (pageId) {
    // Tell the parent React router which KELLY page is active.
    try {
      window.parent.postMessage(
        {
          type: "kelly:request-navigation",
          page: pageId,
        },
        window.location.origin,
      );
    } catch (error) {
      console.warn("[KELLY] Could not notify parent router:", error);
    }

    APP_PAGES.forEach((id) => {
      const page = document.getElementById(`page-${id}`);

      if (page) {
        page.classList.toggle("active", id === pageId);
      }
    });

    // Startup decision is complete. Reveal the selected KELLY view.
    document.body.classList.remove("kelly-startup-pending");

    document.querySelectorAll(".side-link").forEach((link) => {
      const target = link.dataset.page;

      link.classList.toggle("active", target === pageId);
    });

    // Persist the current KELLY page so a browser/iframe reload
    // can restore the user to the same place.
    if (APP_PAGES.includes(pageId)) {
      try {
        localStorage.setItem("kelly:last-page", pageId);
      } catch (error) {
        console.warn("[KELLY] Could not save last page:", error);
      }
    }

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };

  // ─────────────────────────────────────────────
  // LANDING PAGE
  // ─────────────────────────────────────────────

  window.goToLogin = function () {
    showRoot("view-login");
  };

  window.goToSignup = function () {
    showRoot("view-signup");
  };

  window.goToLanding = function () {
    showRoot("view-landing");
  };

  // ─────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────

function setAuthButtonLoading(buttonId, isLoading) {
  const btn = document.getElementById(buttonId);

  if (!btn) return;

  const spinner = btn.querySelector(".btn-spinner");

  btn.disabled = isLoading;

  if (spinner) {
    spinner.style.display = isLoading ? "inline-block" : "none";
  }
}

function showAuthError(errorId, message) {
  const el = document.getElementById(errorId);

  if (!el) return;

  if (message) {
    el.textContent = message;
    el.style.display = "block";
  } else {
    el.textContent = "";
    el.style.display = "none";
  }
}

window.handleLogin = async function (event) {
  if (event) {
    event.preventDefault();
  }

  const form = event?.target || document.querySelector("#view-login form");

  if (!form) {
    showToast("Login form not found.");
    return false;
  }

  showAuthError("login-error", "");

  const email =
    form.querySelector('input[type="email"]')?.value?.trim() || "";

  const password =
    form.querySelector('input[type="password"]')?.value || "";

  if (!email || !password) {
    showAuthError("login-error", "Enter your email and password.");
    return false;
  }

  if (!window.parent.KellyAuth) {
    showAuthError("login-error", "Authentication is not available.");
    return false;
  }

  setAuthButtonLoading("login-submit-btn", true);

  const result = await window.parent.KellyAuth.login(email, password);

  if (result.error) {
    setAuthButtonLoading("login-submit-btn", false);
    showAuthError("login-error", result.error);
    return false;
  }

  showToast("Welcome back!");

  setTimeout(() => {
    showRoot("view-app");
    showPage("home");
  }, 400);

  return false;
};


window.handleSignup = async function (event) {
  if (event) {
    event.preventDefault();
  }

  const form = event?.target || document.querySelector("#view-signup form");

  if (!form) {
    showToast("Signup form not found.");
    return false;
  }

  showAuthError("signup-error", "");

  const inputs = [...form.querySelectorAll("input")];

  const name =
    form.querySelector('input[name="name"]')?.value?.trim() ||
    inputs.find((input) => input.type === "text")?.value?.trim() ||
    "";

  const email =
    form.querySelector('input[type="email"]')?.value?.trim() || "";

  const passwordInputs = form.querySelectorAll('input[type="password"]');

  const password = passwordInputs[0]?.value || "";

  if (!name || !email || !password) {
    showAuthError("signup-error", "Fill in all required fields.");
    return false;
  }

  if (!window.parent.KellyAuth) {
    showAuthError("signup-error", "Authentication is not available.");
    return false;
  }

  setAuthButtonLoading("signup-submit-btn", true);

  const result = await window.parent.KellyAuth.signup(
    name,
    email,
    password
  );

  if (result.error) {
    setAuthButtonLoading("signup-submit-btn", false);
    showAuthError("signup-error", result.error);
    return false;
  }

  if (!result.session) {
    setAuthButtonLoading("signup-submit-btn", false);
    showToast("Account created. Check your email to confirm it.");
    return false;
  }

  showToast("Account created!");

  setTimeout(() => {
    startOnboarding();
  }, 500);

  return false;
};
    window.kellyAskPassword = function (message, title) {
    return new Promise((resolve) => {
      const existing = document.getElementById(
        "kelly-password-dialog",
      );

      if (existing) {
        existing.remove();
      }

      const overlay = document.createElement("div");
      overlay.id = "kelly-password-dialog";

      Object.assign(overlay.style, {
        position: "fixed",
        inset: "0",
        zIndex: "99999",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "rgba(0,0,0,.72)",
        backdropFilter: "blur(8px)",
      });

      const card = document.createElement("div");

      Object.assign(card.style, {
        width: "min(420px, 100%)",
        padding: "24px",
        borderRadius: "18px",
        border: "1px solid rgba(139,92,246,.28)",
        background: "#12121a",
        color: "#fff",
        boxShadow: "0 24px 80px rgba(0,0,0,.45)",
      });

      const heading = document.createElement("h2");
      heading.textContent = title || "Password";
      heading.style.margin = "0 0 8px";

      const text = document.createElement("p");
      text.textContent = message;

      Object.assign(text.style, {
        margin: "0 0 18px",
        opacity: "0.76",
        lineHeight: "1.5",
      });

      const form = document.createElement("form");

      const input = document.createElement("input");
      input.type = "password";
      input.autocomplete = "current-password";
      input.placeholder = "Password";
      input.required = true;

      Object.assign(input.style, {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px 14px",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,.14)",
        background: "rgba(255,255,255,.06)",
        color: "#fff",
        outline: "none",
        fontSize: "15px",
      });

      const actions = document.createElement("div");

      Object.assign(actions.style, {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        marginTop: "18px",
      });

      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.textContent = "Cancel";

      Object.assign(cancel.style, {
        padding: "10px 16px",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,.12)",
        background: "transparent",
        color: "#fff",
        cursor: "pointer",
      });

      const submit = document.createElement("button");
      submit.type = "submit";
      submit.textContent = "Continue";

      Object.assign(submit.style, {
        padding: "10px 16px",
        borderRadius: "10px",
        border: "0",
        background: "#8b5cf6",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "600",
      });

      const cleanup = (value) => {
        overlay.remove();
        resolve(value);
      };

      cancel.onclick = () => cleanup(null);

      form.onsubmit = (event) => {
        event.preventDefault();

        if (!input.value) {
          input.focus();
          return;
        }

        cleanup(input.value);
      };

      form.appendChild(input);
      actions.appendChild(cancel);
      actions.appendChild(submit);
      form.appendChild(actions);

      card.appendChild(heading);
      card.appendChild(text);
      card.appendChild(form);

      overlay.appendChild(card);
      document.body.appendChild(overlay);

      requestAnimationFrame(() => {
        input.focus();
      });
    });
  };
window.kellyOfferGoogleLink = function () {
    return new Promise((resolve) => {
      const existing = document.getElementById(
        "kelly-google-link-dialog",
      );

      if (existing) {
        existing.remove();
      }

      const overlay = document.createElement("div");
      overlay.id = "kelly-google-link-dialog";

      Object.assign(overlay.style, {
        position: "fixed",
        inset: "0",
        zIndex: "99999",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "rgba(0,0,0,.72)",
        backdropFilter: "blur(8px)",
      });

      const card = document.createElement("div");

      Object.assign(card.style, {
        width: "min(420px, 100%)",
        padding: "24px",
        borderRadius: "18px",
        border: "1px solid rgba(139,92,246,.28)",
        background: "#12121a",
        color: "#fff",
        boxShadow: "0 24px 80px rgba(0,0,0,.45)",
      });

      const heading = document.createElement("h2");
      heading.textContent = "Connect Google";
      heading.style.margin = "0 0 8px";

      const text = document.createElement("p");
      text.textContent =
        "Connect your Google account to this KELLY account so you can use either sign-in method.";

      Object.assign(text.style, {
        margin: "0",
        opacity: "0.76",
        lineHeight: "1.5",
      });

      const actions = document.createElement("div");

      Object.assign(actions.style, {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        marginTop: "20px",
      });

      const skip = document.createElement("button");
      skip.type = "button";
      skip.textContent = "Skip";

      Object.assign(skip.style, {
        padding: "10px 16px",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,.12)",
        background: "transparent",
        color: "#fff",
        cursor: "pointer",
      });

      const connect = document.createElement("button");
      connect.type = "button";
      connect.textContent = "Connect Google";

      Object.assign(connect.style, {
        padding: "10px 16px",
        borderRadius: "10px",
        border: "0",
        background: "#8b5cf6",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "600",
      });

      const close = (value) => {
        overlay.remove();
        resolve(value);
      };

      skip.onclick = () => close(false);

      connect.onclick = async () => {
        connect.disabled = true;
        skip.disabled = true;
        connect.textContent = "Opening Google...";

        try {
          const result =
            await window.parent.KellyAuth.linkGoogleAccount();

          close(result);
        } catch (error) {
          console.error(
            "[KELLY] Google linking failed:",
            error,
          );

          close({
            error:
              error?.message ||
              "Could not connect Google.",
          });
        }
      };

      actions.appendChild(skip);
      actions.appendChild(connect);

      card.appendChild(heading);
      card.appendChild(text);
      card.appendChild(actions);

      overlay.appendChild(card);
      document.body.appendChild(overlay);

      requestAnimationFrame(() => {
        connect.focus();
      });
    });
  };
window.handleGoogleAuth = async function () {
  if (
    !window.parent.KellyAuth ||
    typeof window.parent.KellyAuth.loginWithGoogle !==
      "function"
  ) {
    showToast(
      "Authentication is not available.",
    );
    return;
  }

  showToast(
    "Opening Google sign-in...",
  );

  const result =
    await window.parent.KellyAuth.loginWithGoogle();

  /*
   * Login is LOGIN only.
   * We never silently link a Google credential here.
   */
  if (result.error === "GOOGLE_NOT_LINKED") {
    showToast(
      "This Google account is not connected to this KELLY account. Log in with your KELLY email and password first, then connect Google from your account.",
    );
    return;
  }

  if (result.error) {
    showToast(result.error);
    return;
  }

  /*
   * New Google-first account.
   * Password setup is required during onboarding.
   */
  if (result.isNewUser) {
    pendingPasswordLink = true;
    pendingGoogleLink = false;
    startOnboarding();
    return;
  }

  /*
   * Existing Google-only account.
   * Offer an email/password credential.
   */
  if (result.needsPassword) {
    const password =
      await window.kellyAskPassword(
        "Create a password now so you can also log in manually with your email.",
        "Create a manual-login password",
      );

    if (!password) {
      showToast(
        "A password is required for manual email login.",
      );
      return;
    }

    const linkResult =
      await window.parent.KellyAuth.linkPassword(
        password,
      );

    if (linkResult.error) {
      showToast(linkResult.error);
      return;
    }

    showToast(
      "Password added! You can now use email login.",
    );
  }

  showToast("Welcome!");
  showRoot("view-app");
  showPage("home");
};
  // ─────────────────────────────────────────────
  // ONBOARDING
  // ─────────────────────────────────────────────

  let onboardingStep = 0;
  let pendingPasswordLink = false;
  let pendingGoogleLink = false;

  const onboardingSteps = [
    "ob-step-1",
    "ob-step-2",
    "ob-step-3",
    "ob-step-4",
    "ob-step-5",
  ];

  function renderOnboardingStep() {
    onboardingSteps.forEach((id, index) => {
      const step = document.getElementById(id);

      if (step) {
        step.classList.toggle("active", index === onboardingStep);
      }
    });

    const progress = document.querySelector(".onboarding-progress");

    if (progress) {
      const dots = progress.querySelectorAll(".ob-dot");

      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === onboardingStep);
        dot.classList.toggle("done", index < onboardingStep);
      });
    }
  }

  window.startOnboarding = function () {
    onboardingStep = 0;
    showRoot("view-onboarding");
    renderOnboardingStep();
  };

  window.obNext = function () {
    if (onboardingStep < onboardingSteps.length - 1) {
      onboardingStep++;
      renderOnboardingStep();
    }
  };

  window.obBack = function () {
    if (onboardingStep > 0) {
      onboardingStep--;
      renderOnboardingStep();
    } else {
      showRoot("view-signup");
    }
  };

    window.skipOnboarding = async function () {
    /*
     * Google-first users cannot skip password creation.
     */
    if (pendingPasswordLink) {
      await finishOnboarding();
      return;
    }

    if (pendingGoogleLink) {
      const result =
        await window.kellyOfferGoogleLink();

      if (result?.error) {
        showToast(result.error);
      } else if (result?.alreadyLinked) {
        showToast(
          "Google is already connected.",
        );
      } else if (result === true) {
        showToast(
          "Google connected! You can now use either login method.",
        );
      }
    }

    pendingGoogleLink = false;

    showRoot("view-app");
    showPage("home");
  };
  window.finishOnboarding = async function () {
    /*
     * Google-first accounts must create a manual-login
     * password before onboarding can finish.
     */
    if (pendingPasswordLink) {
      const password =
        await window.kellyAskPassword(
          "Create a password now so you can also log in manually with your email.",
          "Create a manual-login password",
        );

      if (!password) {
        showToast(
          "A password is required for manual email login.",
        );
        return;
      }

      const linkResult =
        await window.parent.KellyAuth.linkPassword(
          password,
        );

      if (linkResult.error) {
        showToast(linkResult.error);
        return;
      }

      pendingPasswordLink = false;

      showToast(
        "Password added! You can now use email login.",
      );
    }

    /*
     * Email/password-first users get an explicit,
     * optional Google connection.
     */
    if (pendingGoogleLink) {
      const result =
        await window.kellyOfferGoogleLink();

      if (result?.error) {
        showToast(result.error);
      } else if (result?.alreadyLinked) {
        showToast(
          "Google is already connected.",
        );
      } else if (result === true) {
        showToast(
          "Google connected! You can now use either login method.",
        );
      }

      pendingGoogleLink = false;
    }

    showRoot("view-app");
    showPage("home");
  };
  // ─────────────────────────────────────────────
  // CUSTOM SUBJECTS
  // ─────────────────────────────────────────────

  window.obAddCustomSubject = function () {
    const input = document.querySelector(
      "#ob-custom-subject, [name='custom-subject']"
    );

    if (!input) {
      return;
    }

    const value = input.value.trim();

    if (!value) {
      return;
    }

    const grid = document.querySelector(".chip-grid");

    if (!grid) {
      return;
    }

    const button = document.createElement("button");

    button.type = "button";
    button.className = "subject-chip selected";
    button.textContent = value;
    button.dataset.custom = "true";

    grid.appendChild(button);

    input.value = "";
  };

  // ─────────────────────────────────────────────
  // DATES
  // ─────────────────────────────────────────────

  window.obAddDate = function () {
    const dateList = document.querySelector(".date-list");

    if (!dateList) {
      return;
    }

    const item = document.createElement("div");

    item.className = "date-item";
    item.innerHTML = `
      <span>New important date</span>
      <button
        type="button"
        aria-label="Remove date"
        onclick="this.parentElement.remove()"
      >×</button>
    `;

    dateList.appendChild(item);
  };

  // ─────────────────────────────────────────────
  // APP NAVIGATION
  // ─────────────────────────────────────────────

  window.openApp = function () {
    showRoot("view-app");
    showPage("home");
  };

  window.openKellyPanel = function () {
    const panel = document.querySelector(".kelly-panel");
    const overlay = document.querySelector(".kp-overlay");

    if (panel) {
      panel.classList.add("open");
    }

    if (overlay) {
      overlay.classList.add("open");
    }
  };

  window.closeKellyPanel = function () {
    const panel = document.querySelector(".kelly-panel");
    const overlay = document.querySelector(".kp-overlay");

    if (panel) {
      panel.classList.remove("open");
    }

    if (overlay) {
      overlay.classList.remove("open");
    }
  };

  // ─────────────────────────────────────────────
  // GENERIC MODALS
  // ─────────────────────────────────────────────

  window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);

    if (modal) {
      modal.classList.add("open");
    }
  };

  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);

    if (modal) {
      modal.classList.remove("open");
    }
  };

  // ─────────────────────────────────────────────
  // ADD SUBJECT
  // ─────────────────────────────────────────────

  window.openAddSubjectModal = function () {
    const modal =
      document.getElementById("add-subject-modal") ||
      document.querySelector(".modal-overlay");

    if (modal) {
      modal.classList.add("open");
    }
  };

  // ─────────────────────────────────────────────
  // RECORD LECTURE
  // ─────────────────────────────────────────────

  let recording = false;
  let recordingPaused = false;
  let recordingSeconds = 0;
  let recordingInterval = null;

  window.toggleRecording = function () {
    if (!recording) {
      recording = true;
      recordingPaused = false;

      startRecordingTimer();
    } else {
      recordingPaused = !recordingPaused;
    }
  };

  window.pauseRecording = function () {
    if (!recording) {
      return;
    }

    recordingPaused = !recordingPaused;
  };

  window.stopRecording = function () {
    recording = false;
    recordingPaused = false;

    stopRecordingTimer();
  };

  window.resetRecordPage = function () {
    recording = false;
    recordingPaused = false;
    recordingSeconds = 0;

    stopRecordingTimer();
    updateRecordingTimer();
  };

  function startRecordingTimer() {
    stopRecordingTimer();

    recordingInterval = setInterval(() => {
      if (!recordingPaused) {
        recordingSeconds++;
        updateRecordingTimer();
      }
    }, 1000);
  }

  function stopRecordingTimer() {
    if (recordingInterval) {
      clearInterval(recordingInterval);
      recordingInterval = null;
    }
  }

  function updateRecordingTimer() {
    const timer = document.querySelector(".record-timer");

    if (!timer) {
      return;
    }

    const minutes = Math.floor(recordingSeconds / 60);
    const seconds = recordingSeconds % 60;

    timer.textContent =
      `${String(minutes).padStart(2, "0")}:` +
      `${String(seconds).padStart(2, "0")}`;
  }

  // ─────────────────────────────────────────────
  // ─────────────────────────────────────────────
// QUIZ ENGINE
// ─────────────────────────────────────────────

const KELLY_QUIZ_HISTORY_KEY = "kelly-quiz-history";

const KELLY_QUIZZES = [
  {
    id: "biology-basics",
    title: "Biology Basics",
    subject: "Biology",
    questions: [
      {
        question: "Which organelle is known as the powerhouse of the cell?",
        options: [
          "Nucleus",
          "Mitochondria",
          "Ribosome",
          "Cell membrane"
        ],
        correctIndex: 1
      },
      {
        question: "What process do plants use to convert light energy into chemical energy?",
        options: [
          "Respiration",
          "Digestion",
          "Photosynthesis",
          "Fermentation"
        ],
        correctIndex: 2
      },
      {
        question: "Which molecule carries genetic information in most living organisms?",
        options: [
          "DNA",
          "Glucose",
          "ATP",
          "Water"
        ],
        correctIndex: 0
      },
      {
        question: "Which blood cells help defend the body against infection?",
        options: [
          "Red blood cells",
          "Platelets",
          "White blood cells",
          "Plasma cells"
        ],
        correctIndex: 2
      }
    ]
  },
  {
    id: "algebra-review",
    title: "Algebra Review",
    subject: "Mathematics",
    questions: [
      {
        question: "What is x if 3x + 6 = 21?",
        options: [
          "3",
          "5",
          "7",
          "9"
        ],
        correctIndex: 1
      },
      {
        question: "Simplify: 4x + 3x - 2.",
        options: [
          "7x - 2",
          "x + 1",
          "7x + 2",
          "12x - 2"
        ],
        correctIndex: 0
      },
      {
        question: "If y = 2x + 1, what is y when x = 4?",
        options: [
          "7",
          "8",
          "9",
          "10"
        ],
        correctIndex: 2
      }
    ]
  }
];

let activeQuiz = null;
let activeQuizIndex = 0;
let activeQuizAnswers = [];

function getQuizHistory() {
  const seedHistory = [
    {
      title: "Biology Basics",
      date: "2026-09-12",
      score: 3,
      total: 4,
      xp: 60,
    },
    {
      title: "Algebra Review",
      date: "2026-09-10",
      score: 2,
      total: 3,
      xp: 40,
    },
  ];

  try {
    const raw = localStorage.getItem(KELLY_QUIZ_HISTORY_KEY);

    if (!raw) {
      localStorage.setItem(
        KELLY_QUIZ_HISTORY_KEY,
        JSON.stringify(seedHistory)
      );
      return seedHistory;
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      localStorage.setItem(
        KELLY_QUIZ_HISTORY_KEY,
        JSON.stringify(seedHistory)
      );
      return seedHistory;
    }

    return parsed;
  } catch (error) {
    console.warn("[KELLY] Could not read quiz history:", error);
    return seedHistory;
  }
}

function saveQuizHistory(history) {
  try {
    localStorage.setItem(
      KELLY_QUIZ_HISTORY_KEY,
      JSON.stringify(history)
    );
  } catch (error) {
    console.warn("[KELLY] Could not save quiz history:", error);
  }
}

function getQuizById(id) {
  return KELLY_QUIZZES.find((quiz) => quiz.id === id) || null;
}

function formatQuizDate(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function escapeQuizHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderQuizList() {
  const list = document.getElementById("qz-quiz-list");
  const history = document.getElementById("qz-history");

  if (!list || !history) {
    return;
  }

  list.innerHTML = KELLY_QUIZZES.map((quiz) => `
    <div class="qz-quiz-card">
      <button
        type="button"
        class="qz-quiz-delete"
        aria-label="Delete ${escapeQuizHtml(quiz.title)}"
        title="Delete quiz"
        onclick="deleteQuiz('${quiz.id}')"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round" aria-hidden="true">
          <path d="M3 6h18"></path>
          <path d="M8 6V4h8v2"></path>
          <path d="M19 6l-1 14H6L5 6"></path>
          <path d="M10 11v5"></path>
          <path d="M14 11v5"></path>
        </svg>
      </button>

      <div class="qz-quiz-content">
        <h3 class="qz-quiz-title">
          ${escapeQuizHtml(quiz.title)}
        </h3>

        <p class="qz-quiz-meta">
          ${escapeQuizHtml(quiz.subject)} · ${quiz.questions.length} questions
        </p>

        <button
          type="button"
          class="qz-quiz-start"
          onclick="startQuiz('${quiz.id}')"
        >
          <span aria-hidden="true">▷</span>
          Start Quiz
        </button>
      </div>
    </div>
  `).join("");

  const quizHistory = getQuizHistory();

  if (!quizHistory.length) {
    history.innerHTML = `
      <div class="muted" style="padding:4px 0;">
        No quizzes attempted yet.
      </div>
    `;
    return;
  }

  history.innerHTML = quizHistory.map((result, index) => {
    const ratio = result.total > 0
      ? result.score / result.total
      : 0;

    const scoreClass =
      ratio >= 0.75
        ? "qz-history-score-strong"
        : "qz-history-score-mid";

    return `
      <button
        type="button"
        class="qz-history-row"
        onclick="reviewQuizHistory(${index})"
      >
        <span class="qz-history-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M9.5 3a3.5 3.5 0 0 0-3.4 4.3A3.5 3.5 0 0 0 5 13.8a3.5 3.5 0 0 0 3.5 5.2h1v2h5v-2h1a3.5 3.5 0 0 0 3.5-5.2 3.5 3.5 0 0 0-1.1-6.5A3.5 3.5 0 0 0 14.5 3a3.5 3.5 0 0 0-5 0Z"></path>
            <path d="M9 10h.01"></path>
            <path d="M15 10h.01"></path>
            <path d="M9 14c1.5 1 4.5 1 6 0"></path>
          </svg>
        </span>

        <span class="qz-history-copy">
          <strong class="qz-history-name">
            ${escapeQuizHtml(result.title)}
          </strong>
          <span class="qz-history-date">
            ${escapeQuizHtml(String(result.date))}
          </span>
        </span>

        <span class="qz-history-result">
          <strong class="qz-history-score ${scoreClass}">
            ${result.score}/${result.total}
          </strong>
          <span class="qz-history-xp">
            +${result.xp} XP
          </span>
        </span>

        <span class="qz-history-arrow" aria-hidden="true">›</span>
      </button>
    `;
  }).join("");
}
window.createQuizComingSoon = function () {
  showPage("create-quiz");
};
window.generateQuizFromCreatePage = function () {
  showToast("Quiz generation coming soon");
};

window.deleteQuiz = function (id) {
  const quiz = getQuizById(id);

  if (!quiz) {
    return;
  }

  showToast(`${quiz.title} is a built-in quiz and cannot be deleted yet.`);
};

window.startQuiz = function (id) {
  const quiz = getQuizById(id);

  if (!quiz) {
    showToast("Quiz not found.");
    return;
  }

  activeQuiz = quiz;
  activeQuizIndex = 0;
  activeQuizAnswers = new Array(quiz.questions.length).fill(null);

  showPage("quiz-taking");
  renderCurrentQuizQuestion();
};

function renderCurrentQuizQuestion() {
  if (!activeQuiz) {
    return;
  }

  const label = document.getElementById("qt-progress-label");
  const fill = document.getElementById("qt-progress-fill");
  const card = document.getElementById("qt-question-card");
  const nextButton = document.getElementById("qt-next-btn");

  if (!label || !fill || !card || !nextButton) {
    return;
  }

  const question = activeQuiz.questions[activeQuizIndex];
  const total = activeQuiz.questions.length;
  const questionNumber = activeQuizIndex + 1;

  label.textContent = `Question ${questionNumber} of ${total}`;
  fill.style.width = `${(questionNumber / total) * 100}%`;

  card.innerHTML = `
    <h3>${escapeQuizHtml(question.question)}</h3>

    <div style="display:flex;flex-direction:column;gap:10px;">
      ${question.options.map((option, optionIndex) => {
        const selected =
          activeQuizAnswers[activeQuizIndex] === optionIndex;

        const letter = String.fromCharCode(65 + optionIndex);

        return `
          <button
            type="button"
            class="quiz-answer-option"
            data-option-index="${optionIndex}"
            style="
              width:100%;
              display:flex;
              align-items:center;
              gap:12px;
              padding:13px 14px;
              border:1px solid ${selected ? "var(--violet)" : "var(--line)"};
              border-radius:12px;
              background:${selected ? "var(--violet-soft)" : "#fff"};
              color:var(--ink);
              text-align:left;
              cursor:pointer;
              font:inherit;
            "
          >
            <span style="
              width:28px;
              height:28px;
              flex:0 0 28px;
              display:flex;
              align-items:center;
              justify-content:center;
              border-radius:8px;
              background:${selected ? "var(--violet)" : "var(--violet-soft)"};
              color:${selected ? "#fff" : "var(--violet)"};
              font-weight:800;
              font-size:13px;
            ">${letter}</span>

            <span style="font-size:14px;">
              ${escapeQuizHtml(option)}
            </span>
          </button>
        `;
      }).join("")}
    </div>
  `;

  card.querySelectorAll(".quiz-answer-option").forEach((button) => {
    button.addEventListener("click", () => {
      const selectedIndex = Number(button.dataset.optionIndex);

      if (!Number.isInteger(selectedIndex)) {
        return;
      }

      activeQuizAnswers[activeQuizIndex] = selectedIndex;
      renderCurrentQuizQuestion();
    });
  });

  nextButton.disabled =
    activeQuizAnswers[activeQuizIndex] === null;

  nextButton.textContent =
    questionNumber === total
      ? "Finish Quiz"
      : "Next Question";
}

window.nextQuizQuestion = function () {
  if (!activeQuiz) {
    return;
  }

  if (activeQuizAnswers[activeQuizIndex] === null) {
    return;
  }

  const isLastQuestion =
    activeQuizIndex === activeQuiz.questions.length - 1;

  if (!isLastQuestion) {
    activeQuizIndex += 1;
    renderCurrentQuizQuestion();
    return;
  }

  finishQuiz();
};

function finishQuiz() {
  if (!activeQuiz) {
    return;
  }

  let score = 0;

  activeQuiz.questions.forEach((question, index) => {
    if (activeQuizAnswers[index] === question.correctIndex) {
      score += 1;
    }
  });

  const xp = score * 20;

  const result = {
    quizId: activeQuiz.id,
    title: activeQuiz.title,
    score,
    total: activeQuiz.questions.length,
    xp,
    date: new Date().toISOString()
  };

  const history = getQuizHistory();
  history.unshift(result);
  saveQuizHistory(history);

  showToast(`Quiz complete! +${xp} XP`);
  activeQuiz = null;
  activeQuizIndex = 0;
  activeQuizAnswers = [];

  showPage("quizzes");
  renderQuizList();
}

window.exitQuiz = function () {
  if (!activeQuiz) {
    showPage("quizzes");
    return;
  }

  const confirmed = window.confirm(
    "Exit this quiz? Your current answers will be lost."
  );

  if (!confirmed) {
    return;
  }

  activeQuiz = null;
  activeQuizIndex = 0;
  activeQuizAnswers = [];

  showPage("quizzes");
  renderQuizList();
};

window.reviewQuizHistory = function (index) {
  const history = getQuizHistory();
  const result = history[index];

  if (!result) {
    return;
  }

  showToast(
    `${result.title}: ${result.score}/${result.total} · +${result.xp} XP`
  );
};

window.renderQuizzesPage = function () {
  renderQuizList();
};

// Render the list whenever the Quizzes page is shown.
const originalShowPageForQuiz = window.showPage;

if (typeof originalShowPageForQuiz === "function") {
  window.showPage = function (pageId) {
    originalShowPageForQuiz(pageId);

    if (pageId === "quizzes") {
      renderQuizList();
    }
  };
}

// ─────────────────────────────────────────────
// FLASHCARDS
// ─────────────────────────────────────────────

  // ─────────────────────────────────────────────

  window.flipFlashcard = function (card) {
    if (card) {
      card.classList.toggle("flipped");
    } else {
      const flashcard = document.querySelector(".flashcard");

      if (flashcard) {
        flashcard.classList.toggle("flipped");
      }
    }
  };

  // ─────────────────────────────────────────────
  // TOASTS
  // ─────────────────────────────────────────────

  window.showToast = function (message) {
    let stack = document.querySelector(".toast-stack");

    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      document.body.appendChild(stack);
    }

    const toast = document.createElement("div");

    toast.className = "toast";
    toast.textContent = message;

    stack.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3500);
  };

  // ─────────────────────────────────────────────
  // INITIAL STATE
  // ─────────────────────────────────────────────

  document.addEventListener("DOMContentLoaded", async () => {
    // KELLY runs inside the React iframe. The parent creates
    // window.KellyAuth from React's useEffect, so on a full browser
    // refresh the iframe can sometimes load slightly before the
    // bridge exists. Wait briefly for the bridge before deciding
    // that the user is logged out.
    let session = null;
    let authBridge = null;

    for (let attempt = 0; attempt < 50; attempt++) {
      try {
        if (
          window.parent &&
          window.parent.KellyAuth &&
          typeof window.parent.KellyAuth.getSession === "function"
        ) {
          authBridge = window.parent.KellyAuth;
          break;
        }
      } catch (error) {
        // Parent bridge is not ready yet.
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (authBridge) {
      try {
        const result = await authBridge.getSession();
        session = result?.session || null;
      } catch (error) {
        console.warn("[KELLY] Session restore check failed:", error);
      }
    } else {
      console.warn("[KELLY] Authentication bridge did not become ready.");
    }

    let parentPath = "/";

    try {
      parentPath = window.parent?.location?.pathname || "/";
    } catch (error) {
      console.warn("[KELLY] Could not read parent URL:", error);
    }

const cleanParentPath = parentPath.replace(/^\/+/, "").split("/")[0];

    if (parentPath === "/") {
      showRoot("view-landing");
    } else if (cleanParentPath === "login") {
      showRoot("view-login");
    } else if (cleanParentPath === "signup") {
      showRoot("view-signup");
    } else if (session) {
      let lastPage = "home";

      if (APP_PAGES.includes(cleanParentPath)) {
        lastPage = cleanParentPath;
      } else {
        try {
          const savedPage = localStorage.getItem("kelly:last-page");

          if (savedPage && APP_PAGES.includes(savedPage)) {
            lastPage = savedPage;
          }
        } catch (error) {
          console.warn("[KELLY] Could not read last page:", error);
        }
      }

      showRoot("view-app");
      showPage(lastPage);
    } else {
      showRoot("view-landing");
    }

    // Startup decision is complete. Reveal the selected KELLY view.
    document.body.classList.remove("kelly-startup-pending");

    document.querySelectorAll(".side-link").forEach((link) => {
      link.addEventListener("click", (event) => {
        const page = link.dataset.page;

        if (page) {
          event.preventDefault();
          showPage(page);
        }
      });
    });

    document.querySelectorAll(".subject-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        chip.classList.toggle("selected");
      });
    });
  });

})();

/* KELLY_SVG_ICON_RENDERER */
(function(){
  var icons={
    home:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-7h6v7"/></svg>',
    book:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 4.5v17"/><path d="M8 6h8"/><path d="M8 10h8"/></svg>',
    mic:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="2.5" width="8" height="13" rx="4"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v4"/><path d="M8 22h8"/></svg>',
    brain:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4.5A3.5 3.5 0 0 0 5.5 8c0 .5.1 1 .3 1.4A4 4 0 0 0 6 17a3.5 3.5 0 0 0 3 3.5"/><path d="M15 4.5A3.5 3.5 0 0 1 18.5 8c0 .5-.1 1-.3 1.4A4 4 0 0 1 18 17a3.5 3.5 0 0 1-3 3.5"/><path d="M9 4.5V20.5"/><path d="M15 4.5V20.5"/><path d="M9 9h3"/><path d="M15 14h-3"/></svg>',
    gamepad:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8h11a4.5 4.5 0 0 1 4.3 5.8l-1.2 4A3 3 0 0 1 15 19l-3-2H12l-3 2a3 3 0 0 1-5.6-1.2l-1.2-4A4.5 4.5 0 0 1 6.5 8z"/><path d="M7 11v4"/><path d="M5 13h4"/><path d="M16 12h.01"/><path d="M19 14h.01"/></svg>',
    users:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.5a5 5 0 0 1 6 5.5"/></svg>',
    clock:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/><path d="M9 2h6"/></svg>',
    calendar:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/><path d="M7 14h.01M12 14h.01M17 14h.01M7 18h.01M12 18h.01"/></svg>',
    settings:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"/><path d="m19 13.5 1.5 1-.1 1.8-1.8.9-.3 1.8-1.7.8-1.5-1-1.7.6-.7 1.7h-1.8l-.8-1.7-1.7-.6-1.5 1-1.7-.8-.3-1.8-1.8-.9-.1-1.8 1.5-1-.2-1.8-1.3-1.2.7-1.7 2-.2.8-1.6 1.8.1.9 1.5 1.8-.1 1.1-1.4 1.7.5.3 1.8 1.6.8 1.8-.6 1.3 1.2-.7 1.7.7 1.7z"/></svg>'
  };
  function render(){
    document.querySelectorAll('.sl-icon[data-icon]').forEach(function(el){
      var key=el.getAttribute('data-icon');
      if(icons[key]) el.innerHTML=icons[key];
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render);
  else render();
})();






