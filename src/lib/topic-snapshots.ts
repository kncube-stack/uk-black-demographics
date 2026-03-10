import { formatNumber, formatPercent, formatRate } from "./format";
import { loadCulturePageData } from "./culture-summary";
import { loadEconomicsPageData } from "./economics-summary";
import { loadEducationPageData } from "./education-summary";
import { loadHealthPageData } from "./health-summary";
import { loadHouseholdsPageData } from "./households-summary";
import {
  loadPopulationHomepageData,
  loadPopulationPageData,
} from "./population-summary";
import type { SiteCategory, SourceMetadata } from "./types";

export interface TopicSnapshot {
  liveRoute: string;
  source: SourceMetadata;
  stats: Array<{
    label: string;
    value: string;
    note: string;
  }>;
}

export async function loadTopicSnapshot(
  category: SiteCategory,
  slug: string
): Promise<TopicSnapshot | null> {
  switch (`${category}:${slug}`) {
    case "population:total": {
      const data = await loadPopulationPageData();
      return {
        liveRoute: "/population",
        source: data.source,
        stats: [
          {
            label: "Core Black population",
            value: formatNumber(data.overall.allBlack),
            note: "England and Wales",
          },
          {
            label: "Including mixed White/Black groups",
            value: formatNumber(data.overall.allBlackIncludingMixed),
            note: "England and Wales",
          },
        ],
      };
    }
    case "population:by-region": {
      const data = await loadPopulationHomepageData();
      const top = data.regionalRows[0];
      if (!top) return null;
      return {
        liveRoute: "/population",
        source: data.source,
        stats: [
          {
            label: "Largest regional population",
            value: top.name,
            note: formatNumber(top.allBlack),
          },
          {
            label: "Core Black share",
            value: formatPercent(top.coreShare, 1),
            note: "Within region population",
          },
        ],
      };
    }
    case "population:by-local-authority": {
      const data = await loadPopulationHomepageData();
      const top = data.topLocalAuthorities[0];
      if (!top) return null;
      return {
        liveRoute: "/population",
        source: data.source,
        stats: [
          {
            label: "Largest local authority",
            value: top.name,
            note: formatNumber(top.allBlack),
          },
          {
            label: "Core Black share",
            value: formatPercent(top.coreShare, 1),
            note: "Within authority population",
          },
        ],
      };
    }
    case "population:male":
    case "population:female": {
      const data = await loadPopulationPageData();
      const row = data.sexRows.find((candidate) => candidate.key === "all_black");
      if (!row) return null;
      const isFemale = slug === "female";
      return {
        liveRoute: "/population",
        source: data.source,
        stats: [
          {
            label: isFemale ? "Female count" : "Male count",
            value: formatNumber(isFemale ? row.female : row.male),
            note: "All Black population",
          },
          {
            label: isFemale ? "Female share" : "Male share",
            value: formatPercent(isFemale ? row.femaleShare : row.maleShare, 1),
            note: "Within all Black population",
          },
        ],
      };
    }
    case "population:age-distribution": {
      const data = await loadPopulationPageData();
      const topBand = [...data.ageProfileRows].sort(
        (left, right) => right.coreBlackCount - left.coreBlackCount
      )[0];
      if (!topBand) return null;
      return {
        liveRoute: "/population",
        source: data.source,
        stats: [
          {
            label: "Largest age band",
            value: topBand.label,
            note: formatNumber(topBand.coreBlackCount),
          },
          {
            label: "All Black share",
            value: formatPercent(topBand.coreBlackShare, 1),
            note: "Within all Black population",
          },
        ],
      };
    }
    case "economics:employment": {
      const data = await loadEconomicsPageData();
      return {
        liveRoute: "/economics",
        source: data.source,
        stats: [
          {
            label: "Black employment",
            value: formatPercent(data.headline.blackEmploymentRate, 1),
            note: data.latestLabel,
          },
          {
            label: "Gap to overall",
            value: `${data.headline.employmentGap.toFixed(1)} pts`,
            note: `Overall ${formatPercent(data.headline.allEmploymentRate, 1)}`,
          },
        ],
      };
    }
    case "economics:unemployment": {
      const data = await loadEconomicsPageData();
      return {
        liveRoute: "/economics",
        source: data.source,
        stats: [
          {
            label: "Black unemployment",
            value: formatPercent(data.headline.blackUnemploymentRate, 1),
            note: data.latestLabel,
          },
          {
            label: "Black inactivity",
            value: formatPercent(data.headline.blackInactivityRate, 1),
            note: data.latestLabel,
          },
        ],
      };
    }
    case "education:exclusions": {
      const data = await loadEducationPageData();
      const wbCaribbean = data.metricRows.find(
        (row) => row.key === "mixed_white_black_caribbean"
      );
      const blackCaribbean = data.metricRows.find(
        (row) => row.key === "black_caribbean"
      );
      if (!wbCaribbean || !blackCaribbean) return null;
      return {
        liveRoute: "/education",
        source: data.source,
        stats: [
          {
            label: "White and Black Caribbean",
            value: formatPercent(wbCaribbean.suspensionRate, 2),
            note: data.latestLabel,
          },
          {
            label: "Black Caribbean",
            value: formatPercent(blackCaribbean.suspensionRate, 2),
            note: data.latestLabel,
          },
        ],
      };
    }
    case "households:housing": {
      const data = await loadHouseholdsPageData();
      return {
        liveRoute: "/households",
        source: data.source,
        stats: [
          {
            label: "All Black home ownership",
            value: formatPercent(data.headline.allBlackRate, 1),
            note: data.latestLabel,
          },
          {
            label: "All households",
            value: formatPercent(data.headline.overallRate, 1),
            note: "England baseline",
          },
        ],
      };
    }
    case "health:mental-health": {
      const data = await loadHealthPageData();
      return {
        liveRoute: "/health",
        source: data.source,
        stats: [
          {
            label: "All Black rate",
            value: formatRate(data.headline.allBlackRate, 100_000),
            note: data.latestLabel,
          },
          {
            label: "Black Caribbean",
            value: formatRate(data.headline.blackCaribbeanRate, 100_000),
            note: data.latestLabel,
          },
        ],
      };
    }
    case "culture-geography:stop-search": {
      const data = await loadCulturePageData();
      return {
        liveRoute: "/culture-geography",
        source: data.source,
        stats: [
          {
            label: "All Black rate",
            value: formatRate(data.headline.allBlackRate, 1_000),
            note: data.latestLabel,
          },
          {
            label: "Disproportionality",
            value: `${data.headline.disproportionalityRatio.toFixed(1)}x`,
            note: `Overall ${formatRate(data.headline.overallRate, 1_000)}`,
          },
        ],
      };
    }
    default:
      return null;
  }
}
