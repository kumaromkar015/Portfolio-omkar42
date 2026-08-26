"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, Rss, ArrowRight } from "lucide-react";
import { blogData, BlogPost } from "@/data/blog";

interface PageProps {
  params: Promise<{ id: string }>;
}

import { api } from "@/lib/api";

export default function BlogArticlePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [article, setArticle] = React.useState<BlogPost | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api.getBlog(resolvedParams.id)
      .then((data) => {
        if (data) {
          setArticle({
            id: data.slug,
            title: data.title,
            excerpt: data.excerpt || "",
            content: data.content || "",
            category: (data.tags?.[0] || "Engineering") as any,
            publishedAt: new Date(data.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            readTime: "5 min read",
            imageUrl: data.coverImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
          });
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback to static mock list
        const staticMatch = blogData.find((p) => p.id === resolvedParams.id);
        setArticle(staticMatch || null);
        setLoading(false);
      });
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-bg-dark text-slate-900 dark:text-white">
        <div className="w-8 h-8 rounded-full border-4 border-violet-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!article) {
    notFound();
  }

  // Simple parser to split markdown content into readable blocks
  const renderContentBlocks = (text: string) => {
    const lines = text.trim().split("\n");
    let inCodeBlock = false;
    let codeContent: string[] = [];

    return lines.map((line, idx) => {
      // Handle Code block boundaries
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const content = codeContent.join("\n");
          codeContent = [];
          return (
            <pre key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 font-mono text-xs overflow-x-auto my-6">
              <code>{content}</code>
            </pre>
          );
        } else {
          inCodeBlock = true;
          return null;
        }
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return null;
      }

      // Handle Headings
      if (line.startsWith("# ")) {
        return (
          <h1 key={idx} className="text-2xl md:text-3xl font-extrabold tracking-tight mt-8 mb-4">
            {line.replace("# ", "")}
          </h1>
        );
      }

      if (line.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-xl md:text-2xl font-bold tracking-tight mt-6 mb-3">
            {line.replace("## ", "")}
          </h2>
        );
      }

      // Handle List Items
      if (line.trim().startsWith("- ")) {
        return (
          <ul key={idx} className="list-disc pl-6 my-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li>{line.trim().replace("- ", "")}</li>
          </ul>
        );
      }

      // Skip empty lines
      if (line.trim() === "") return null;

      // Handle Normal Paragraphs
      return (
        <p key={idx} className="text-sm md:text-base leading-relaxed text-slate-650 dark:text-slate-350 my-4">
          {line}
        </p>
      );
    });
  };

  // Get recommended articles (exclude current one)
  const recommendations = blogData.filter((post) => post.id !== article.id).slice(0, 2);

  return (
    <main className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-bg-dark text-slate-900 dark:text-white">
      {/* Background gradients */}
      <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10 space-y-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-violet-500 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Journal
        </Link>

        {/* Hero Area */}
        <div className="space-y-4 border-b border-slate-200 dark:border-slate-850 pb-6">
          <span className="text-[10px] text-violet-600 dark:text-violet-400 font-bold uppercase tracking-wider bg-violet-50 dark:bg-violet-950/40 px-2.5 py-1 rounded-full border border-violet-100 dark:border-violet-900/40 inline-block">
            {article.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {article.publishedAt}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {article.readTime}
            </span>
          </div>
        </div>

        {/* Banner Image */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-850 overflow-hidden aspect-video shadow-md">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content body */}
        <article className="prose prose-slate dark:prose-invert max-w-none">
          {renderContentBlocks(article.content)}
        </article>

        {/* Recommendations */}
        <div className="border-t border-slate-200 dark:border-slate-850 pt-12 space-y-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Rss size={20} className="text-violet-500" />
            Continue Reading
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {recommendations.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="block p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 hover:border-violet-500/40 dark:hover:border-violet-500/30 transition-all duration-350 shadow-sm hover:shadow group"
              >
                <div className="space-y-2">
                  <span className="text-[9px] text-violet-650 dark:text-violet-400 font-extrabold uppercase tracking-wider">
                    {post.category}
                  </span>
                  <h4 className="font-bold text-sm md:text-base leading-tight text-slate-950 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {post.title}
                  </h4>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-2">
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {post.readTime}
                    </span>
                    <span className="flex items-center gap-0.5 text-violet-500 group-hover:translate-x-1 transition-transform">
                      Read <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
