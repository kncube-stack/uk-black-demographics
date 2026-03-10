import fs from "fs/promises";
import path from "path";
import type { Dataset, SiteCategory, CategoryOverview, HeadlineStat } from "./types";

// =============================================================================
// Data Loader — Reads JSON data files at build time (Next.js SSG)
// =============================================================================
// All functions here run server-side during `next build` or in Server Components.
// They read from the data/ directory and return typed data for page rendering.
// =============================================================================

const DATA_DIR = path.join(process.cwd(), "data");

/** Read and parse a single JSON file from the data directory */
async function readJsonFile<T>(relativePath: string): Promise<T> {
  const filePath = path.join(DATA_DIR, relativePath);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

/** Load a single dataset by its relative path within data/ */
export async function loadDataset(relativePath: string): Promise<Dataset> {
  return readJsonFile<Dataset>(relativePath);
}

/** Load a derived data file (from data/derived/) */
export async function loadDerived<T>(filename: string): Promise<T> {
  return readJsonFile<T>(`derived/${filename}`);
}

/** Load headline statistics for the homepage */
export async function loadHeadlineStats(): Promise<HeadlineStat[]> {
  return readJsonFile<HeadlineStat[]>("derived/headline-stats.json");
}

/** Load category overview for a specific category */
export async function loadCategoryOverview(
  category: SiteCategory
): Promise<CategoryOverview> {
  return readJsonFile<CategoryOverview>(
    `derived/category-overviews/${category}.json`
  );
}

/** Load all category overviews (for homepage navigation) */
export async function loadAllCategoryOverviews(): Promise<CategoryOverview[]> {
  const categories: SiteCategory[] = [
    "population",
    "households",
    "economics",
    "education",
    "health",
    "culture-geography",
  ];
  return Promise.all(categories.map(loadCategoryOverview));
}

/** Load every fetched/manual dataset in the repository */
export async function loadAllDatasets(): Promise<Dataset[]> {
  const datasets: Dataset[] = [];
  const dirs = ["fetched", "manual"];

  for (const dir of dirs) {
    const basePath = path.join(DATA_DIR, dir);
    const files = await findJsonFilesRecursive(basePath);

    for (const file of files) {
      try {
        datasets.push(
          await readJsonFile<Dataset>(path.relative(DATA_DIR, file))
        );
      } catch {
        continue;
      }
    }
  }

  return datasets;
}

/**
 * Find all dataset files matching a site category.
 * Searches both data/fetched/ and data/manual/ directories.
 */
export async function loadDatasetsForCategory(
  category: SiteCategory
): Promise<Dataset[]> {
  const datasets: Dataset[] = [];
  const dirs = ["fetched", "manual"];

  for (const dir of dirs) {
    const basePath = path.join(DATA_DIR, dir);
    const files = await findJsonFilesRecursive(basePath);

    for (const file of files) {
      try {
        const dataset = await readJsonFile<Dataset>(
          path.relative(DATA_DIR, file)
        );
        if (dataset.siteCategory === category) {
          datasets.push(dataset);
        }
      } catch {
        // Skip files that aren't valid datasets (e.g. _meta.json, _template.json)
        continue;
      }
    }
  }

  return datasets;
}

/**
 * Load datasets matching a specific category and subcategory.
 */
export async function loadDatasetsForSubcategory(
  category: SiteCategory,
  subcategory: string
): Promise<Dataset[]> {
  const allForCategory = await loadDatasetsForCategory(category);
  return allForCategory.filter((d) => d.siteSubcategory === subcategory);
}

// -- Helpers ------------------------------------------------------------------

async function findJsonFilesRecursive(dir: string): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await findJsonFilesRecursive(fullPath)));
      } else if (entry.name.endsWith(".json") && !entry.name.startsWith("_")) {
        files.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist yet — fine during initial setup
  }

  return files;
}
