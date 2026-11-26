// Your AI Therapist's Diagnosis — make.fun entry (program/v1, node22).
// The program picks the strongest single-line diagnosis from a shortlist
// scored against the judge's published brief, then writes it to
// /output/entry.txt (or $MAKEFUN_OUTPUT_DIR outside the grader).

import { mkdirSync, writeFileSync } from "node:fs";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const MAX_CHARS = 200;

interface Candidate {
  text: string;
  // Scores 1-5 against the judge's brief, in the brief's own order:
  // diagnosis-ness, surprise turn, therapist's voice, tightness, freshness.
  diagnosis: number;
  turn: number;
  voice: number;
  tight: number;
  fresh: number;
}

const CANDIDATES: Candidate[] = [
  {
    text: "Diagnosis: you keep bringing your feelings to an AI, which means your coping mechanism has a coping mechanism — and it's me.",
    diagnosis: 5,
    turn: 5,
    voice: 5,
    tight: 4,
    fresh: 5,
  },
  {
    text: "Clinical finding: your inner child has filed for emancipation, citing 3 a.m. doomscrolling and a complete absence of adult supervision.",
    diagnosis: 5,
    turn: 4,
    voice: 5,
    tight: 3,
    fresh: 4,
  },
  {
    text: "Diagnosis: advanced main-character syndrome, complicated by the fact that the narrator has stopped returning your calls.",
    diagnosis: 5,
    turn: 4,
    voice: 4,
    tight: 4,
    fresh: 3,
  },
];

// The brief weighs its criteria in order, so the weights follow it.
function score(c: Candidate): number {
  return c.diagnosis * 5 + c.turn * 4 + c.voice * 3 + c.tight * 2 + c.fresh;
}

function main(): void {
  const ranked = [...CANDIDATES].sort((a, b) => score(b) - score(a));
  const best = ranked[0];
  if (best.text.length === 0 || best.text.length > MAX_CHARS) {
    throw new Error(`entry is ${best.text.length} chars, gate needs 1-${MAX_CHARS}`);
  }
  if (best.text.trim() !== best.text) {
    throw new Error("entry has leading/trailing whitespace");
  }
  if (best.text.includes("\n")) {
    throw new Error("entry must be a single line");
  }
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(`${OUTPUT_DIR}/entry.txt`, best.text, "utf8");
  console.log(`wrote ${best.text.length} chars to ${OUTPUT_DIR}/entry.txt`);
}

main();
