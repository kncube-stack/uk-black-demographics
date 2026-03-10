import { CATEGORIES } from "./constants";
import { loadAllDatasets } from "./data-loader";
import type { FetchMethod, SiteCategory, SourceMetadata } from "./types";

export interface ImplementedSource {
  categories: Array<{
    slug: SiteCategory;
    title: string;
  }>;
  datasetCount: number;
  datasets: Array<{
    id: string;
    siteCategory: SiteCategory;
    siteSubcategory: string;
    title: string;
  }>;
  fetchMethod: FetchMethod;
  id: string;
  metadata: SourceMetadata;
}

const CATEGORY_TITLES = new Map(
  CATEGORIES.map((category) => [category.slug, category.title] as const)
);

export async function loadImplementedSources(): Promise<ImplementedSource[]> {
  const datasets = await loadAllDatasets();
  const grouped = new Map<string, ImplementedSource>();

  for (const dataset of datasets) {
    const existing = grouped.get(dataset.metadata.id);

    if (!existing) {
      grouped.set(dataset.metadata.id, {
        id: dataset.metadata.id,
        metadata: dataset.metadata,
        fetchMethod: dataset.metadata.fetchMethod,
        datasetCount: 1,
        categories: [
          {
            slug: dataset.siteCategory,
            title: CATEGORY_TITLES.get(dataset.siteCategory) ?? dataset.siteCategory,
          },
        ],
        datasets: [
          {
            id: dataset.id,
            siteCategory: dataset.siteCategory,
            siteSubcategory: dataset.siteSubcategory,
            title: dataset.title,
          },
        ],
      });
      continue;
    }

    existing.datasetCount += 1;
    existing.datasets.push({
      id: dataset.id,
      siteCategory: dataset.siteCategory,
      siteSubcategory: dataset.siteSubcategory,
      title: dataset.title,
    });

    if (!existing.categories.some((item) => item.slug === dataset.siteCategory)) {
      existing.categories.push({
        slug: dataset.siteCategory,
        title: CATEGORY_TITLES.get(dataset.siteCategory) ?? dataset.siteCategory,
      });
    }
  }

  return Array.from(grouped.values()).sort((left, right) =>
    left.metadata.publisher.localeCompare(right.metadata.publisher) ||
    left.metadata.name.localeCompare(right.metadata.name)
  );
}
