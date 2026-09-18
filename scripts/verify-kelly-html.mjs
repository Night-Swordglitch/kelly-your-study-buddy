// scripts/verify-kelly-html.mjs
//
// Compares the freshly generated public/KELLY/KELLY.html against the
// pre-split snapshot (public/KELLY/KELLY.before-split.html) to confirm
// the refactor didn't change anything structurally.

import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KELLY_DIR = resolve(__dirname, "..", "public", "KELLY");
const GENERATED_PATH = join(KELLY_DIR, "KELLY.html");
const SNAPSHOT_PATH = join(KELLY_DIR, "KELLY.before-split.html");

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

function fail(message) {
  console.error(`[verify-kelly-html] FAIL: ${message}`);
  process.exitCode = 1;
}

for (const path of [GENERATED_PATH, SNAPSHOT_PATH]) {
  if (!existsSync(path)) {
    console.error(`[verify-kelly-html] Cannot find ${path}`);
    process.exit(1);
  }
}

const generatedRaw = readFileSync(GENERATED_PATH); // Buffer, for byte compare
const snapshotRaw = readFileSync(SNAPSHOT_PATH); // Buffer, for byte compare

const generated = generatedRaw.toString("utf-8");
const snapshot = snapshotRaw.toString("utf-8");

console.log("=== Byte-for-byte comparison ===");
const byteIdentical = generatedRaw.equals(snapshotRaw);
if (byteIdentical) {
  console.log("PASS: generated file is byte-for-byte identical to the snapshot.");
} else {
  console.log(
    "DIFFERENT: generated file is not byte-for-byte identical. Reporting where:",
  );
  const minLen = Math.min(generatedRaw.length, snapshotRaw.length);
  let firstDiff = -1;
  for (let i = 0; i < minLen; i++) {
    if (generatedRaw[i] !== snapshotRaw[i]) {
      firstDiff = i;
      break;
    }
  }
  if (firstDiff === -1 && generatedRaw.length !== snapshotRaw.length) {
    console.log(
      `  Files match up to the shorter length, but lengths differ: ` +
        `generated=${generatedRaw.length} bytes, snapshot=${snapshotRaw.length} bytes.`,
    );
  } else if (firstDiff !== -1) {
    const context = 40;
    const genSnippet = generated.slice(
      Math.max(0, firstDiff - context),
      firstDiff + context,
    );
    const snapSnippet = snapshot.slice(
      Math.max(0, firstDiff - context),
      firstDiff + context,
    );
    console.log(`  First differing byte at offset ${firstDiff}`);
    console.log(`  snapshot context:  ...${JSON.stringify(snapSnippet)}...`);
    console.log(`  generated context: ...${JSON.stringify(genSnippet)}...`);
  }
}

console.log("\n=== Required ID presence ===");
let idsOk = true;
for (const id of REQUIRED_IDS) {
  const needle = `id="${id}"`;
  const inSnapshot = snapshot.includes(needle);
  const inGenerated = generated.includes(needle);

  if (!inSnapshot) {
    console.log(`  WARN: "${id}" was not even present in the snapshot (unexpected).`);
  }
  if (inSnapshot && !inGenerated) {
    fail(`"${id}" was present in the snapshot but is MISSING from the generated file.`);
    idsOk = false;
  }
  if (inSnapshot && inGenerated) {
    console.log(`  OK: ${id}`);
  }
}
if (idsOk) {
  console.log("PASS: all required IDs present in generated output.");
}

console.log("\n=== Duplicate check ===");
let dupesOk = true;
for (const id of REQUIRED_IDS) {
  const needle = `id="${id}"`;
  const countIn = (str) => str.split(needle).length - 1;
  const genCount = countIn(generated);
  const snapCount = countIn(snapshot);
  if (genCount !== snapCount) {
    fail(
      `"${id}" appears ${snapCount} time(s) in the snapshot but ${genCount} time(s) in the generated file.`,
    );
    dupesOk = false;
  }
}
if (dupesOk) {
  console.log("PASS: no duplicate or missing occurrences of any required ID.");
}

console.log("\n=== Line count ===");
const genLines = generated.split(/\r\n|\n/).length;
const snapLines = snapshot.split(/\r\n|\n/).length;
console.log(`  snapshot:  ${snapLines} lines`);
console.log(`  generated: ${genLines} lines`);
if (genLines !== snapLines) {
  fail(`Line count differs: snapshot=${snapLines}, generated=${genLines}`);
} else {
  console.log("PASS: line counts match.");
}

if (process.exitCode === 1) {
  console.error("\n[verify-kelly-html] One or more checks FAILED. See above.");
} else {
  console.log("\n[verify-kelly-html] All checks passed.");
}
