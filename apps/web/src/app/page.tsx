import React from "react";
import { Metadata } from "next";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Achievements from "@/components/Achievements";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

export async function generateMetadata(): Promise<Metadata> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  let siteUrl = "https://omkarkumar.dev";
  let siteName = "Omkar Kumar Portfolio";
  let twitterHandle = "@kumaromkar";
  
  let pageTitle = "Omkar Kumar | Senior Frontend Architect & Full Stack Engineer";
  let pageDescription = "Senior Software Engineer and Full Stack Architect specializing in premium React and Next.js digital experiences.";
  let pageRobots = "index, follow";
  let ogImage = "";

  try {
    const res = await fetch(`${API_URL}/seo`, { next: { revalidate: 10 } });
    const json = await res.json();
    if (json && json.success && json.data) {
      const seo = json.data;
      const global = seo.global || {};
      const page = seo.pages?.home || {};
      
      siteUrl = global.siteUrl || siteUrl;
      siteName = global.siteName || siteName;
      twitterHandle = global.twitterHandle || twitterHandle;

      pageTitle = page.title || `${global.siteTitle || "Omkar Kumar"}`;
      pageDescription = page.description || global.metaDescription || pageDescription;
      pageRobots = page.robots || global.robots || pageRobots;
      ogImage = page.ogImage || global.defaultOgImage || "";
    }
  } catch (e) {
    console.error("Failed to generate homepage metadata:", e);
  }

  return {
    title: pageTitle,
    description: pageDescription,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: siteUrl,
    },
    robots: pageRobots,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: siteUrl,
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

export default function Home() {
  return (
    <main className="w-full">
      {/* Hero Section with particle gradients & marquee */}
      <Hero />

      {/* About Section */}
      <About />

      {/* Skills Matrix */}
      <Skills />

      {/* Career Timeline */}
      <Experience />

      {/* Case Studies / Projects */}
      <Projects />

      {/* Professional Services */}
      <Services />

      {/* Credentials */}
      <Achievements />

      {/* Feedback / Testimonials Slider */}
      <Testimonials />

      {/* Contact Form with validations */}
      <Contact />
    </main>
  );
}
