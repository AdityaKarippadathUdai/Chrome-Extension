#!/usr/bin/env node
// scripts/fix-extension-paths.mjs
//
// Post-build script: rewrites absolute asset paths in HTML output files
// to relative paths so they work under chrome-extension:// and
// moz-extension:// origins.
//
// Usage:
//   node scripts/fix-extension-paths.mjs <outDir>
//   e.g. node scripts/fix-extension-paths.mjs dist-firefox

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, join } from "path";

const outDir = process.argv[2];

if (!outDir) {
  console.error("Usage: fix-extension-paths.mjs <outDir>");
  process.exit(1);
}

const root = resolve(process.cwd(), outDir);

// Find all HTML files in the output root
const htmlFiles = readdirSync(root)
  .filter((f) => f.endsWith(".html"))
  .map((f) => join(root, f));

let patched = 0;

for (const htmlFile of htmlFiles) {
  const original = readFileSync(htmlFile, "utf8");
  // Rewrite /assets/... → ./assets/... for src and href attributes
  const fixed = original.replace(/(src|href)="\/assets\//g, '$1="./assets/');

  if (fixed !== original) {
    writeFileSync(htmlFile, fixed, "utf8");
    console.log(`  ✓ patched ${htmlFile}`);
    patched++;
  }
}

if (patched === 0) {
  console.log("  No absolute paths found – nothing to patch.");
} else {
  console.log(`  ${patched} file(s) patched.`);
}
