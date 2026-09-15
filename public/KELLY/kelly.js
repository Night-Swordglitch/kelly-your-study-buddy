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
    "subjects",
    "study",
    "quizzes",
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
    APP_PAGES.forEach((id) => {
      const page = document.getElementById(`page-${id}`);

      if (page) {
        page.classList.toggle("active", id === pageId);
      }
    });

    document.querySelectorAll(".side-link").forEach((link) => {
      const target = link.dataset.page;

      link.classList.toggle("active", target === pageId);
    });

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

window.handleLogin = async function (event) {
  if (event) {
    event.preventDefault();
  }

  const form = event?.target || document.querySelector("#view-login form");

  if (!form) {
    showToast("Login form not found.");
    return false;
  }

  const email =
    form.querySelector('input[type="email"]')?.value?.trim() || "";

  const password =
    form.querySelector('input[type="password"]')?.value || "";

  if (!email || !password) {
    showToast("Enter your email and password.");
    return false;
  }

  if (!window.parent.KellyAuth) {
    showToast("Authentication is not available.");
    return false;
  }

  showToast("Logging you in...");

  const result = await window.parent.KellyAuth.login(email, password);

  if (result.error) {
    showToast(result.error);
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
    showToast("Fill in all required fields.");
    return false;
  }

  if (!window.parent.KellyAuth) {
    showToast("Authentication is not available.");
    return false;
  }

  showToast("Creating your account...");

  const result = await window.parent.KellyAuth.signup(
    name,
    email,
    password
  );

  if (result.error) {
    showToast(result.error);
    return false;
  }

  if (!result.session) {
    showToast("Account created. Check your email to confirm it.");
    return false;
  }

  showToast("Account created!");

  setTimeout(() => {
    startOnboarding();
  }, 500);

  return false;
};


window.handleGoogleAuth = function () {
  showToast("Google sign-in will be connected next.");
};

  // ─────────────────────────────────────────────
  // ONBOARDING
  // ─────────────────────────────────────────────

  let onboardingStep = 0;

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

  window.skipOnboarding = function () {
    showRoot("view-app");
    showPage("home");
  };

  window.finishOnboarding = function () {
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
  // QUIZ PLACEHOLDERS
  // ─────────────────────────────────────────────

  window.generateQuizFromConfig = function () {
    showToast("Quiz generation will be connected next.");
  };

  window.nextQuizQuestion = function () {
    showToast("Quiz engine will be connected next.");
  };

  window.exitQuiz = function () {
    showPage("quizzes");
  };

  window.reviewWeakAreasWithKelly = function () {
    openKellyPanel();
  };

  // ─────────────────────────────────────────────
  // FLASHCARDS
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

  document.addEventListener("DOMContentLoaded", () => {
    showRoot("view-landing");

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
