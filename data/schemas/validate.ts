#!/usr/bin/env tsx
/**
 * Data Validation Script
 *
 * Validates all JSON files in data/fetched/ and data/manual/ against the
 * Dataset Zod schema. Run this:
 *   - As a pre-commit hook (via Husky) when data/ files change
 *   - In GitHub Actions CI on every PR touching data/
 *   - As part of the Next.js prebuild step
 *
 * Usage: npx tsx data/schemas/validate.ts
 */

import fs from "fs";
import path from "path";
import { DatasetSchema } from "./dataset.schema";

const DATA_DIR = path.join(process.cwd(), "data");
const DIRS_TO_VALIDATE = ["fetched", "manual"];

let totalFiles = 0;
let validFiles = 0;
let invalidFiles = 0;
const errors: { file: string; issues: string[] }[] = [];

function findJsonFiles(dir: string): string[] {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findJsonFiles(fullPath));
    } else if (entry.name.endsWith(".json") && !entry.name.startsWith("_")) {
      files.push(fullPath);
    }
  }
  return files;
}

console.log("Validating data files...\n");

for (const subdir of DIRS_TO_VALIDATE) {
  const dir = path.join(DATA_DIR, subdir);
  const jsonFiles = findJsonFiles(dir);

  for (const filePath of jsonFiles) {
    totalFiles++;
    const relativePath = path.relative(DATA_DIR, filePath);

    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      const result = DatasetSchema.safeParse(parsed);

      if (result.success) {
        validFiles++;
        console.log(`  ✓ ${relativePath}`);
      } else {
        invalidFiles++;
        const issues = result.error.issues.map(
          (issue) => `    ${issue.path.join(".")}: ${issue.message}`
        );
        errors.push({ file: relativePath, issues });
        console.log(`  ✗ ${relativePath}`);
        issues.forEach((i) => console.log(i));
      }
    } catch (err) {
      invalidFiles++;
      const message =
        err instanceof Error ? err.message : "Unknown error reading file";
      errors.push({ file: relativePath, issues: [message] });
      console.log(`  ✗ ${relativePath} — ${message}`);
    }
  }
}

console.log(`\n${"─".repeat(50)}`);
console.log(
  `Total: ${totalFiles} | Valid: ${validFiles} | Invalid: ${invalidFiles}`
);

if (totalFiles === 0) {
  console.log("\nNo data files found to validate (this is OK during setup).");
  process.exit(0);
}

if (invalidFiles > 0) {
  console.log("\n❌ Validation failed. Fix the errors above before committing.");
  process.exit(1);
} else {
  console.log("\n✅ All data files are valid.");
  process.exit(0);
}
