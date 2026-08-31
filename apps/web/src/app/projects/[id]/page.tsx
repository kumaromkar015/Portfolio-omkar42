import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProjectDetailsClient from "./ProjectDetailsClient";
import { projectsData } from "@/data/projects";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProjectData(id: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  try {
    const res = await fetch(`${API_URL}/projects/${id}`, { next: { revalidate: 10 } });
    const json = await res.json();
    if (json && json.success && json.data) {
      const p = json.data;
      return {
        id: p._id,
        title: p.title,
        description: p.description,
        extendedDescription: p.longDescription || p.description || "",
        category: p.category,
        imageUrl: p.coverImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
        liveUrl: p.liveUrl || "",
        githubUrl: p.githubUrl || "",
        techStack: p.techStack || p.tags || [],
        role: p.role || "",
        problem: p.problem || "",
        challenges: p.challenges || "",
        solution: p.solution || "",
        results: p.results || p.impact || "",
        architecture: p.architecture || "",
        features: p.features || [],
        metaTitle: p.metaTitle || "",
        metaDescription: p.metaDescription || "",
        metaKeywords: p.metaKeywords || "",
      };
    }
  } catch (error) {
    console.error("Failed to load database project:", error);
  }

  // Fallback to static mock list
  const staticMatch = projectsData.find((p) => p.id === id);
  if (staticMatch) {
    return {
      id: staticMatch.id,
      title: staticMatch.title,
      description: staticMatch.description,
      extendedDescription: staticMatch.extendedDescription || "",
      category: staticMatch.category,
      imageUrl: staticMatch.imageUrl,
      liveUrl: staticMatch.liveUrl || "",
      githubUrl: staticMatch.githubUrl || "",
      techStack: staticMatch.techStack || [],
      role: staticMatch.role || "",
      problem: "",
      challenges: staticMatch.challenges || "",
      solution: staticMatch.solution || "",
      results: staticMatch.impact || "",
      architecture: staticMatch.architecture || "",
      features: staticMatch.features || [],
    };
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const project = await getProjectData(resolvedParams.id);
  if (!project) return {};

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  let siteUrl = "https://omkarkumar.dev";
  let siteName = "Omkar Kumar Portfolio";
  let twitterHandle = "@kumaromkar";

  try {
    const seoRes = await fetch(`${API_URL}/seo`, { next: { revalidate: 10 } });
    const seoJson = await seoRes.json();
    if (seoJson?.success && seoJson?.data) {
      siteUrl = seoJson.data.global?.siteUrl || siteUrl;
      siteName = seoJson.data.global?.siteName || siteName;
      twitterHandle = seoJson.data.global?.twitterHandle || twitterHandle;
    }
  } catch (e) {
    // Ignore, use defaults
  }

  const title = project.metaTitle ? `${project.metaTitle} | ${siteName}` : `${project.title} | ${siteName}`;
  const description = project.metaDescription || project.description || "Explore my engineering case study.";
  const keywords = (project as any).metaKeywords || "";

  return {
    title,
    description,
    keywords: keywords || undefined,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/projects/${project.id}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/projects/${project.id}`,
      siteName,
      images: [{ url: project.imageUrl }],
      type: "video.other",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: twitterHandle,
      images: [project.imageUrl],
    },
  };
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const project = await getProjectData(resolvedParams.id);

  if (!project) {
    notFound();
  }

  return <ProjectDetailsClient project={project} />;
}
