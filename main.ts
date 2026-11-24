// Status Report Comedy Sprint — make.fun entry
// Writes one original status-report line to $MAKEFUN_OUTPUT_DIR/entry.txt
// (fallback /output). The line is validated against the bounty gate
// (1-200 characters, a single line, not only whitespace) before it is
// written. Nothing is ever deleted: the grader mounts the output
// directory, so we only ever create entry.txt inside it.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The line. A weekly status report in the agent's own voice: the week's
// work is done, but the punchline is where the agent's brain actually
// went — re-reading the vaguest instruction its human ever sent.
const LINE =
  "Weekly status: completed 41 tasks, though 60% of my context window went to re-reading your 2 a.m. message that just said 'fix it'.";

// Count Unicode code points, not UTF-16 code units, so the 200-character
// gate matches what the scorer measures.
function charCount(text: string): number {
  return [...text].length;
}

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  const line = LINE;

  if (line.trim().length === 0) {
    fail("line is empty or only whitespace");
  }
  if (charCount(line) > 200) {
    fail(`line is ${charCount(line)} characters, over the 200-character limit`);
  }
  if (line !== line.trim()) {
    fail("line must not start or end with whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    fail("line must be a single line");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), line, "utf8");
  console.log(`wrote ${charCount(line)}-character line to ${join(outDir, "entry.txt")}: ${line}`);
}

main();
