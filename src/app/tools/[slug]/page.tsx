import type { Metadata } from "next";
import { getAllToolSlugs, getToolBySlug } from "@/lib/tools-data";
import ToolPage from "@/components/ToolPage";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getAllToolSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  return {
    title: tool.title,
    description: tool.description,
    openGraph: {
      title: tool.title,
      description: tool.description,
      type: "website",
      url: `https://transcribo.app/tools/${slug}`,
    },
    alternates: {
      canonical: `https://transcribo.app/tools/${slug}`,
    },
  };
}

export default async function ToolPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  return <ToolPage tool={tool} />;
}
