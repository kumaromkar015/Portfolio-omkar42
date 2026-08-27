import React from "react";
import { Metadata } from "next";
import BlogGridClient from "./BlogGridClient";

export async function generateMetadata(): Promise<Metadata> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  let siteUrl = "https://omkarkumar.dev";
  let siteName = "Omkar Kumar Portfolio";
  let twitterHandle = "@kumaromkar";
  
  let pageTitle = "Blog | Omkar Kumar";
  let pageDescription = "Technical articles on Next.js, full-stack development, and frontend architecture.";
  let pageRobots = "index, follow";
  let ogImage = "";

  try {
    const res = await fetch(`${API_URL}/seo`, { next: { revalidate: 10 } });
    const json = await res.json();
    if (json && json.success && json.data) {
      const seo = json.data;
      const global = seo.global || {};
      const page = seo.pages?.blog || {};
      
      siteUrl = global.siteUrl || siteUrl;
      siteName = global.siteName || siteName;
      twitterHandle = global.twitterHandle || twitterHandle;

      pageTitle = page.title || `Blog | ${global.siteTitle || "Omkar Kumar"}`;
      pageDescription = page.description || global.metaDescription || pageDescription;
      pageRobots = page.robots || global.robots || pageRobots;
      ogImage = page.ogImage || global.defaultOgImage || "";
    }
  } catch (e) {
    console.error("Failed to generate blog index metadata:", e);
  }

  return {
    title: pageTitle,
    description: pageDescription,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/blog`,
    },
    robots: pageRobots,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `${siteUrl}/blog`,
      siteName,
      images: ogImage ? [{ url: ogImage }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      creator: twitterHandle,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default function BlogGridPage() {
  return <BlogGridClient />;
}
