#!/usr/bin/env node
// Checks the Filipino t() dictionaries (src/i18n/fil/phrases.ts + src/i18n/fil/phrases/*.ts). They are spread into one
// object (FIL_PHRASES), so when the same English key appears twice the last spread silently wins.
//
// Fails (exit 1) when a key appears with two different values. Warns when a key appears more than once with the same
// value (redundant: keep it once, in the section that uses it most). No dependencies: `node scripts/check-i18n-phrases.mjs`.
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const filDir = join(root, "src", "i18n", "fil");
const files = [
  join(filDir, "phrases.ts"),
  ...readdirSync(join(filDir, "phrases"))
    .filter((f) => f.endsWith(".ts"))
    .sort()
    .map((f) => join(filDir, "phrases", f)),
];

/** Tokens: double/single-quoted strings (decoded) and the punctuation : , { } with their line numbers. */
function tokenize(src) {
  const out = [];
  let line = 1;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c === "\n") line++;
    else if (c === "/" && src[i + 1] === "/") {
      while (i < src.length && src[i] !== "\n") i++;
      i--;
    } else if (c === "/" && src[i + 1] === "*") {
      const end = src.indexOf("*/", i + 2);
      for (const ch of src.slice(i, end)) if (ch === "\n") line++;
      i = end + 1;
    } else if (c === '"' || c === "'") {
      const start = i;
      const startLine = line;
      i++;
      while (i < src.length && src[i] !== c) {
        if (src[i] === "\\") i++;
        i++;
      }
      let raw = src.slice(start + 1, i);
      if (c === "'") raw = raw.replace(/\\'/g, "'").replace(/"/g, '\\"');
      out.push({ type: "str", value: JSON.parse(`"${raw}"`), line: startLine });
    } else if (c === "`") {
      throw new Error(`template literal at line ${line}: not supported in phrase files`);
    } else if (":,{}".includes(c)) out.push({ type: c, line });
  }
  return out;
}

/** key → [{ value, file, line }] */
const seen = new Map();
for (const file of files) {
  const tokens = tokenize(readFileSync(file, "utf8"));
  for (let i = 0; i + 2 < tokens.length; i++) {
    const [k, colon, v] = [tokens[i], tokens[i + 1], tokens[i + 2]];
    if (k.type === "str" && colon.type === ":" && v.type === "str") {
      const list = seen.get(k.value) ?? [];
      list.push({ value: v.value, file: relative(root, file).replace(/\\/g, "/"), line: k.line });
      seen.set(k.value, list);
    }
  }
}

let conflicts = 0;
let redundant = 0;
for (const [key, list] of seen) {
  if (list.length < 2) continue;
  const values = new Set(list.map((e) => e.value));
  const where = list.map((e) => `    ${e.file}:${e.line}  ${JSON.stringify(e.value)}`).join("\n");
  if (values.size > 1) {
    conflicts++;
    console.error(`CONFLICT ${JSON.stringify(key)}\n${where}`);
  } else {
    redundant++;
    console.warn(`duplicate (same value) ${JSON.stringify(key)}\n${where}`);
  }
}

console.log(`${seen.size} phrase keys in ${files.length} files; ${conflicts} conflicting, ${redundant} redundant duplicates.`);
process.exit(conflicts > 0 ? 1 : 0);
