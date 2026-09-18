// scripts/build-kelly-html.mjs
//
// Deterministic, non-parsing build step: reads public/KELLY/KELLY.shell.html,
// replaces each "<!-- INCLUDE: path -->" marker with the verbatim contents
// of that file, and writes the result to public/KELLY/KELLY.html.
//
// This is plain text substitution on purpose -- no HTML parser/formatter is
// used, so the output is byte-identical to the pre-split file except for
// the trivial fact that content now lives in separate source files.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KELLY_DIR = resolve(__dirname, "..", "public", "KELLY");
const SHELL_PATH = join(KELLY_DIR, "KELLY.shell.html");
const OUTPUT_PATH = join(KELLY_DIR, "KELLY.html");

const INCLUDE_MARKER = /<!-- INCLUDE: (.+?) -->/g;

function fail(message) {
  console.error(`[build-kelly-html] ERROR: ${message}`);
  process.exit(1);
}

if (!existsSync(SHELL_PATH)) {
  fail(`Shell file not found at ${SHELL_PATH}`);
}

// Read as plain utf-8 (not utf-8 "sig") so a leading BOM, if present in the
// shell file, survives as a literal character rather than being stripped.
const shellText = readFileSync(SHELL_PATH, "utf-8");

const seenIncludes = new Set();
let missing = [];

const assembled = shellText.replace(INCLUDE_MARKER, (fullMatch, rawPath) => {
  const relativePath = rawPath.trim();

  if (seenIncludes.has(relativePath)) {
    fail(
      `Include marker for "${relativePath}" appears more than once in the shell. ` +
        `Each split file should be included exactly once.`,
    );
  }
  seenIncludes.add(relativePath);

  const fullPath = join(KELLY_DIR, relativePath);

  if (!existsSync(fullPath)) {
    missing.push(relativePath);
    return fullMatch; // leave marker in place so the failure below is visible
  }

  // Read the fragment verbatim -- no trimming, no reformatting.
  return readFileSync(fullPath, "utf-8");
});

if (missing.length > 0) {
  fail(
    `The following include file(s) were referenced but not found:\n` +
      missing.map((p) => `  - ${p}`).join("\n"),
  );
}

// Fail loudly if any INCLUDE marker survived the substitution pass --
// this would mean the regex didn't match something it should have,
// which should never happen but is cheap to guard against.
const leftoverMarkers = assembled.match(INCLUDE_MARKER);
if (leftoverMarkers) {
  fail(
    `Unresolved INCLUDE marker(s) remain after assembly:\n` +
      leftoverMarkers.map((m) => `  - ${m}`).join("\n"),
  );
}

// Sanity check: every DOM ID that kelly.js depends on must be present in
// the generated output. This does not read kelly.js and infer the list
// dynamically (that would be fragile) -- it checks the fixed set of IDs
// established for this project's root views and app pages.
const REQUIRED_IDS = [
  "view-landing",
  "view-login",
  "view-signup",
  "view-onboarding",
  "view-app",
  "page-home",
  "page-notes",
  "page-subjects",
  "page-subject-detail",
  "page-record",
  "page-study",
  "page-mission",
  "page-quizzes",
  "page-quiz-taking",
  "page-quiz-results",
];

const missingIds = REQUIRED_IDS.filter(
  (id) => !assembled.includes(`id="${id}"`),
);

if (missingIds.length > 0) {
  fail(
    `Generated KELLY.html is missing required element(s):\n` +
      missingIds.map((id) => `  - id="${id}"`).join("\n"),
  );
}

writeFileSync(OUTPUT_PATH, assembled, "utf-8");

console.log(
  `[build-kelly-html] OK: assembled ${seenIncludes.size} include(s) into ${OUTPUT_PATH}`,
);
