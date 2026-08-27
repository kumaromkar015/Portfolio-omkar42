"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { blogData, BlogPost } from "@/data/blog";
import { ArrowLeft, Search, Rss, Clock } from "lucide-react";
import { api } from "@/lib/api";

export default function BlogGridClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Engineering" | "Design" | "Architecture">("All");
  const [blogsList, setBlogsList] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBlogs()
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.map((b: any) => ({
            id: b.slug,
            title: b.title,
            excerpt: b.excerpt || "",
            content: b.content || "",
            category: (b.tags?.[0] || "Engineering") as any,
            publishedAt: new Date(b.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            readTime: "5 min read",
            imageUrl: b.coverImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
            featured: b.published,
          }));
          setBlogsList(mapped);
        } else {
          setBlogsList(blogData);
        }
      })
      .catch(() => {
        setBlogsList(blogData);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categories = ["All", "Engineering", "Design", "Architecture"];

  const filteredPosts = blogsList.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogsList.find((post) => post.featured) || blogsList[0];

  return (
    <main className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-bg-dark text-slate-900 dark:text-white">
      {/* Background gradients */}
      <div className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-lime-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-lime-655 dark:hover:text-lime-400 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <Rss className="text-lime-600 dark:text-lime-400" size={28} />
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">The Engineer's Journal</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-xl">
            Articles on React architecture, database performance optimizations, and design system engineering.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-white dark:bg-card-dark border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl animate-pulse h-64" />
            ))}
          </div>
        ) : (
          <>
            {/* Featured Post Hero */}
            {featuredPost && selectedCategory === "All" && searchQuery === "" && (
              <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-md grid grid-cols-1 lg:grid-cols-12 gap-6 group hover:border-lime-500/40 dark:hover:border-lime-400/40 transition-all duration-305">
                <div className="lg:col-span-7 aspect-video lg:aspect-auto relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredPost.imageUrl}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-500"
                  />
                </div>
                <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-lime-655 dark:text-lime-400 font-bold uppercase tracking-wider bg-lime-50 dark:bg-lime-950/20 px-2.5 py-1 rounded-full border border-lime-100 dark:border-lime-900/30">
                        Featured Article
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-zinc-900 px-2 py-1 rounded border border-slate-205 dark:border-zinc-800/60 font-bold uppercase tracking-wider">
                        {featuredPost.category}
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold leading-tight group-hover:text-lime-655 dark:group-hover:text-lime-400 transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-xs md:text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-xs font-semibold text-slate-400 border-t border-slate-200 dark:border-zinc-800/80 pt-4">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {featuredPost.readTime}
                    </span>
                    <Link
                      href={`/blog/${featuredPost.id}`}
                      className="font-bold text-lime-655 dark:text-lime-400 hover:text-lime-750 dark:hover:text-lime-300 transition-colors hover:underline"
                    >
                      Read Article →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Filters and Search Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-200 dark:border-zinc-900 pt-8">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat as any)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-lime-600 border-lime-650 dark:bg-lime-400 dark:border-lime-350 text-white dark:text-black shadow-md"
                        : "bg-white dark:bg-zinc-900/60 border border-slate-205 dark:border-zinc-800 text-slate-655 dark:text-slate-400 hover:border-lime-500/30 dark:hover:border-lime-400/30"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="w-full md:w-72 relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 text-sm rounded-full bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-655 dark:focus:border-lime-400 transition-colors"
                />
              </div>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-card-dark border border-slate-200 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow hover:shadow-lg hover:border-lime-500/40 dark:hover:border-lime-400/40 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div className="aspect-video relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-550"
                    />
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[9px] text-lime-655 dark:text-lime-400 font-bold uppercase tracking-wider bg-lime-50 dark:bg-lime-950/20 px-2 py-0.5 rounded border border-lime-100 dark:border-lime-900/30 inline-block">
                        {post.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-950 dark:text-white leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-550 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="border-t border-slate-200 dark:border-zinc-800/80 pt-4 flex justify-between items-center text-xs text-slate-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {post.readTime}
                      </span>
                      <Link
                        href={`/blog/${post.id}`}
                        className="font-bold text-lime-655 dark:text-lime-400 hover:text-lime-750 dark:hover:text-lime-300 transition-colors hover:underline"
                      >
                        Read Article →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
