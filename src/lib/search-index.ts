import { CATEGORIES } from "./constants";
import { TOPIC_GUIDES } from "./topic-guides";

export interface SearchEntry {
  href: string;
  title: string;
  description: string;
  type: "section" | "topic" | "page";
  tags: string[];
}

export function getSearchIndex(): SearchEntry[] {
  const sections: SearchEntry[] = CATEGORIES.map((category) => ({
    href: `/${category.slug}`,
    title: category.title,
    description: category.description,
    type: "section",
    tags: [category.title, category.slug, ...category.subcategories.map((item) => item.title)],
  }));

  const topics = Object.entries(TOPIC_GUIDES).flatMap(([category, guides]) =>
    guides.map((guide) => ({
      href: `/${category}/${guide.slug}`,
      title: `${guide.title}`,
      description: `${guide.description} ${guide.summary}`,
      type: "topic" as const,
      tags: [category, guide.title, guide.description, guide.status],
    }))
  );

  return [
    {
      href: "/",
      title: "Home",
      description: "Homepage, key findings, and section entry points.",
      type: "page",
      tags: ["home", "findings", "overview"],
    },
    {
      href: "/justice-policing",
      title: "Justice & Policing",
      description: "Stop and search, crime, and incarceration entry point.",
      type: "section",
      tags: ["justice", "policing", "stop and search", "crime", "prison"],
    },
    {
      href: "/identity-civic-life",
      title: "Identity & Civic Life",
      description: "Politics, religion, and heritage entry point.",
      type: "section",
      tags: ["identity", "civic", "religion", "politics", "migration"],
    },
    {
      href: "/key-findings",
      title: "Key Findings",
      description: "Plain-English headline findings linked to the underlying data pages.",
      type: "page",
      tags: ["findings", "at a glance", "summary"],
    },
    {
      href: "/search",
      title: "Search",
      description: "Search the site by topic, section, or question.",
      type: "page",
      tags: ["search", "find"],
    },
    {
      href: "/about",
      title: "About",
      description: "Why the project exists and how it is built.",
      type: "page",
      tags: ["about", "editorial", "project"],
    },
    {
      href: "/methodology",
      title: "Methodology",
      description: "Source registry, caveats, and build rules.",
      type: "page",
      tags: ["methodology", "sources", "citation"],
    },
    ...sections,
    ...topics,
  ];
}
