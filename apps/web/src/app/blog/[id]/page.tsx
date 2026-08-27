import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import BlogArticleClient from "./BlogArticleClient";
import { blogData } from "@/data/blog";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getArticleData(id: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  try {
    const res = await fetch(`${API_URL}/blog/${id}`, { next: { revalidate: 10 } });
    const json = await res.json();
    if (json && json.success && json.data) {
      const data = json.data;
      return {
        id: data.slug,
        title: data.title,
        excerpt: data.excerpt || "",
        content: data.content || "",
        category: (data.tags?.[0] || "Engineering"),
        publishedAt: new Date(data.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        readTime: "5 min read",
        imageUrl: data.coverImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
      };
    }
  } catch (error) {
    console.error("Failed to load database blog article:", error);
  }

  // Fallback to static mock data
  const staticMatch = blogData.find((p) => p.id === id);
  if (staticMatch) {
    return {
      ...staticMatch,
      publishedAt: staticMatch.publishedAt,
    };
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getArticleData(resolvedParams.id);
  if (!article) return {};

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
    // Ignore, use fallback defaults
  }

  const title = `${article.title} | ${siteName}`;
  const description = article.excerpt || "Read this article on my engineering journal.";

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/blog/${article.id}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/blog/${article.id}`,
      siteName,
      images: [{ url: article.imageUrl }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: twitterHandle,
      images: [article.imageUrl],
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const resolvedParams = await params;
  const article = await getArticleData(resolvedParams.id);

  if (!article) {
    notFound();
  }

  return <BlogArticleClient article={article} />;
}
