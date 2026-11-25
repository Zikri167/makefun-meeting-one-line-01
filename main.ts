import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The winning line: a meeting whose single output is another meeting has
// confessed its own uselessness. The sentence does the meeting's job by
// naming the one thing it ever produced — and that thing is more of itself,
// so nothing is left that could justify holding it again.
const ENTRY =
  "The only decision this meeting ever made was to schedule another meeting.";

function validate(text: string): void {
  const length = [...text].length; // count code points, not UTF-16 units
  if (length < 1 || length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  if (/[\n\r]/.test(text)) {
    throw new Error("entry must be a single line");
  }
  for (const ch of text) {
    if (ch.codePointAt(0)! < 0x20 || ch.codePointAt(0) === 0x7f) {
      throw new Error("entry must not contain control characters");
    }
  }
}

const outDir = "/output";
mkdirSync(outDir, { recursive: true });
validate(ENTRY);
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");
const readBack = readFileSync(outPath, "utf8");
if (readBack !== ENTRY) {
  throw new Error("read-back mismatch: file content differs from entry");
}
console.log(`Wrote ${outPath}: ${[...ENTRY].length} characters, read-back verified.`);
