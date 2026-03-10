import { notFound } from "next/navigation";
import { TopicGuidePage } from "@/components/topic-guide-page";
import { getTopicGuide, getTopicGuides } from "@/lib/topic-guides";
import { loadTopicSnapshot } from "@/lib/topic-snapshots";

type Props = {
  params: Promise<{ subcategory: string }>;
};

export async function generateStaticParams() {
  return getTopicGuides("economics").map((guide) => ({
    subcategory: guide.slug,
  }));
}

export default async function EconomicsSubcategoryPage({ params }: Props) {
  const { subcategory } = await params;
  const guide = getTopicGuide("economics", subcategory);

  if (!guide) {
    notFound();
  }

  const snapshot = await loadTopicSnapshot("economics", subcategory);
  return <TopicGuidePage guide={guide} snapshot={snapshot} />;
}
