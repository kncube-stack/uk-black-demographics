import { notFound } from "next/navigation";
import { TopicGuidePage } from "@/components/topic-guide-page";
import { getTopicGuide, getTopicGuides } from "@/lib/topic-guides";
import { loadTopicSnapshot } from "@/lib/topic-snapshots";

type Props = {
  params: Promise<{ subcategory: string }>;
};

export async function generateStaticParams() {
  return getTopicGuides("health").map((guide) => ({
    subcategory: guide.slug,
  }));
}

export default async function HealthSubcategoryPage({ params }: Props) {
  const { subcategory } = await params;
  const guide = getTopicGuide("health", subcategory);

  if (!guide) {
    notFound();
  }

  const snapshot = await loadTopicSnapshot("health", subcategory);
  return <TopicGuidePage guide={guide} snapshot={snapshot} />;
}
