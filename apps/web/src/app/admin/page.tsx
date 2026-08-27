"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  User,
  FolderKanban,
  FileText,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  Save,
  Globe,
  Settings,
  Image as ImageIcon,
} from "lucide-react";
import MediaLibrary from "@/components/media/MediaLibrary";
import MediaPicker from "@/components/media/MediaPicker";

type DashboardTab = "profile" | "projects" | "blog" | "media";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Profile Form State
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [profileResumeUrl, setProfileResumeUrl] = useState("");
  const [profileSocialGithub, setProfileSocialGithub] = useState("");
  const [profileSocialLinkedin, setProfileSocialLinkedin] = useState("");
  const [profileSocialTwitter, setProfileSocialTwitter] = useState("");

  // Projects CRUD state
  const [projects, setProjects] = useState<any[]>([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectTechStack, setProjectTechStack] = useState("");
  const [projectLiveUrl, setProjectLiveUrl] = useState("");
  const [projectGithubUrl, setProjectGithubUrl] = useState("");
  const [projectCoverImage, setProjectCoverImage] = useState("");
  const [projectFeatured, setProjectFeatured] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Blog CRUD state
  const [blogs, setBlogs] = useState<any[]>([]);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSlug, setBlogSlug] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogCoverImage, setBlogCoverImage] = useState("");
  const [blogPublished, setBlogPublished] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  // Fetch all initial data
  useEffect(() => {
    fetchProfile();
    fetchProjects();
    fetchBlogs();
  }, []);

  const clearAlerts = () => {
    setMessage("");
    setError("");
  };

  // --- PROFILE LOGIC ---
  const fetchProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfileName(data.name || "");
      setProfileBio(data.bio || "");
      setProfilePhoto(data.photo || "");
      setProfileResumeUrl(data.resumeUrl || "");
      setProfileSocialGithub(data.social?.github || "");
      setProfileSocialLinkedin(data.social?.linkedin || "");
      setProfileSocialTwitter(data.social?.twitter || "");
    } catch (err: any) {
      console.error("Profile load err:", err);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    setLoading(true);
    try {
      await api.updateProfile({
        name: profileName,
        bio: profileBio,
        photo: profilePhoto,
        resumeUrl: profileResumeUrl,
        social: {
          github: profileSocialGithub,
          linkedin: profileSocialLinkedin,
          twitter: profileSocialTwitter,
        },
      });
      setMessage("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // --- PROJECTS LOGIC ---
  const fetchProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (err: any) {
      console.error("Projects load err:", err);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    setLoading(true);

    const projectPayload = {
      title: projectTitle,
      description: projectDesc,
      techStack: projectTechStack.split(",").map((s) => s.trim()).filter(Boolean),
      liveUrl: projectLiveUrl,
      githubUrl: projectGithubUrl,
      coverImage: projectCoverImage,
      featured: projectFeatured,
    };

    try {
      if (editingProjectId) {
        await api.updateProject(editingProjectId, projectPayload);
        setMessage("Project updated successfully!");
      } else {
        await api.createProject(projectPayload);
        setMessage("Project created successfully!");
      }
      resetProjectForm();
      fetchProjects();
    } catch (err: any) {
      setError(err.message || "Failed to save project.");
    } finally {
      setLoading(false);
    }
  };

  const editProject = (p: any) => {
    setEditingProjectId(p._id);
    setProjectTitle(p.title || "");
    setProjectDesc(p.description || "");
    setProjectTechStack(p.techStack?.join(", ") || "");
    setProjectLiveUrl(p.liveUrl || "");
    setProjectGithubUrl(p.githubUrl || "");
    setProjectCoverImage(p.coverImage || "");
    setProjectFeatured(p.featured || false);
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    clearAlerts();
    try {
      await api.deleteProject(id);
      setMessage("Project deleted successfully!");
      fetchProjects();
    } catch (err: any) {
      setError(err.message || "Failed to delete project.");
    }
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjectTitle("");
    setProjectDesc("");
    setProjectTechStack("");
    setProjectLiveUrl("");
    setProjectGithubUrl("");
    setProjectCoverImage("");
    setProjectFeatured(false);
  };

  // --- BLOG LOGIC ---
  const fetchBlogs = async () => {
    try {
      const data = await api.getBlogs(true);
      setBlogs(data);
    } catch (err: any) {
      console.error("Blogs load err:", err);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    setLoading(true);

    const blogPayload = {
      title: blogTitle,
      slug: blogSlug,
      excerpt: blogExcerpt,
      content: blogContent,
      coverImage: blogCoverImage,
      published: blogPublished,
    };

    try {
      if (editingBlogId) {
        await api.updateBlog(editingBlogId, blogPayload);
        setMessage("Article updated successfully!");
      } else {
        await api.createBlog(blogPayload);
        setMessage("Article published successfully!");
      }
      resetBlogForm();
      fetchBlogs();
    } catch (err: any) {
      setError(err.message || "Failed to save article.");
    } finally {
      setLoading(false);
    }
  };

  const editBlog = (b: any) => {
    setEditingBlogId(b._id);
    setBlogTitle(b.title || "");
    setBlogSlug(b.slug || "");
    setBlogExcerpt(b.excerpt || "");
    setBlogContent(b.content || "");
    setBlogCoverImage(b.coverImage || "");
    setBlogPublished(b.published || false);
  };

  const deleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    clearAlerts();
    try {
      await api.deleteBlog(id);
      setMessage("Article deleted successfully!");
      fetchBlogs();
    } catch (err: any) {
      setError(err.message || "Failed to delete article.");
    }
  };

  const resetBlogForm = () => {
    setEditingBlogId(null);
    setBlogTitle("");
    setBlogSlug("");
    setBlogExcerpt("");
    setBlogContent("");
    setBlogCoverImage("");
    setBlogPublished(false);
  };

  return (
    <div className="space-y-8">
      {/* Notifications */}
      {message && (
        <div className="flex gap-2.5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-250 dark:border-emerald-900/60 text-xs font-bold text-emerald-700 dark:text-emerald-450 items-center">
          <CheckCircle size={16} /> <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="flex gap-2.5 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-250 dark:border-rose-900/60 text-xs font-bold text-rose-600 dark:text-rose-455 items-center">
          <AlertCircle size={16} /> <span>{error}</span>
        </div>
      )}

      {/* Tabs list */}
      <div className="flex border-b border-slate-205 dark:border-zinc-800/80 gap-4 pb-2">
        <button
          onClick={() => {
            setActiveTab("profile");
            clearAlerts();
          }}
          className={`flex items-center gap-1.5 pb-2 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
            activeTab === "profile"
              ? "border-lime-600 text-lime-650 dark:border-lime-400 dark:text-lime-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <User size={16} /> Profile
        </button>
        <button
          onClick={() => {
            setActiveTab("projects");
            clearAlerts();
          }}
          className={`flex items-center gap-1.5 pb-2 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
            activeTab === "projects"
              ? "border-lime-600 text-lime-650 dark:border-lime-400 dark:text-lime-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <FolderKanban size={16} /> Projects
        </button>
        <button
          onClick={() => {
            setActiveTab("blog");
            clearAlerts();
          }}
          className={`flex items-center gap-1.5 pb-2 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
            activeTab === "blog"
              ? "border-lime-600 text-lime-650 dark:border-lime-400 dark:text-lime-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileText size={16} /> Blogs
        </button>
        <button
          onClick={() => {
            setActiveTab("media");
            clearAlerts();
          }}
          className={`flex items-center gap-1.5 pb-2 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
            activeTab === "media"
              ? "border-lime-600 text-lime-650 dark:border-lime-400 dark:text-lime-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <ImageIcon size={16} /> Media
        </button>
      </div>

      {/* --- PROFILE PANEL --- */}
      {activeTab === "profile" && (
        <form onSubmit={handleProfileSubmit} className="bg-white dark:bg-card-dark border border-slate-200 dark:border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold">Edit Profile Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Public Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Short Bio</label>
              <input
                type="text"
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">GitHub URL</label>
              <input
                type="text"
                value={profileSocialGithub}
                onChange={(e) => setProfileSocialGithub(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">LinkedIn URL</label>
              <input
                type="text"
                value={profileSocialLinkedin}
                onChange={(e) => setProfileSocialLinkedin(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Twitter URL</label>
              <input
                type="text"
                value={profileSocialTwitter}
                onChange={(e) => setProfileSocialTwitter(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
              />
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <MediaPicker
                label="Profile Photo"
                value={profilePhoto}
                onChange={setProfilePhoto}
                typeFilter="image"
              />
              <MediaPicker
                label="Resume PDF"
                value={profileResumeUrl}
                onChange={setProfileResumeUrl}
                typeFilter="pdf"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-lime-600 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 transition-colors"
          >
            <Save size={15} /> {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      )}

      {/* --- PROJECTS PANEL --- */}
      {activeTab === "projects" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CRUD Form */}
          <form onSubmit={handleProjectSubmit} className="lg:col-span-7 bg-white dark:bg-card-dark border border-slate-200 dark:border-zinc-800/80 rounded-3xl p-6 space-y-4">
            <h2 className="text-lg font-bold">{editingProjectId ? "Edit Project" : "Create New Project"}</h2>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Project Title</label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description</label>
              <textarea
                rows={3}
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tech Stack (comma separated)</label>
              <input
                type="text"
                placeholder="Next.js, Tailwind, TypeScript"
                value={projectTechStack}
                onChange={(e) => setProjectTechStack(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Live URL</label>
                <input
                  type="text"
                  value={projectLiveUrl}
                  onChange={(e) => setProjectLiveUrl(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">GitHub URL</label>
                <input
                  type="text"
                  value={projectGithubUrl}
                  onChange={(e) => setProjectGithubUrl(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
                />
              </div>
            </div>
            <MediaPicker
              label="Cover Image"
              value={projectCoverImage}
              onChange={setProjectCoverImage}
              typeFilter="image"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="feat"
                checked={projectFeatured}
                onChange={(e) => setProjectFeatured(e.target.checked)}
                className="rounded text-lime-600 focus:ring-lime-500 w-4 h-4 border-slate-300 dark:border-zinc-800/80"
              />
              <label htmlFor="feat" className="text-xs font-semibold text-slate-400">Feature this project at the top</label>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-lime-600 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black text-xs font-bold cursor-pointer disabled:opacity-50 transition-colors"
              >
                <Plus size={14} /> {editingProjectId ? "Save Changes" : "Add Project"}
              </button>
              {editingProjectId && (
                <button
                  type="button"
                  onClick={resetProjectForm}
                  className="px-4.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-800 text-xs font-bold hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* List panel */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-lg font-bold">Existing Projects</h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {projects.map((p) => (
                <div key={p._id} className="p-4 bg-white dark:bg-card-dark border border-slate-200 dark:border-zinc-800/80 rounded-2xl flex justify-between items-center shadow-sm">
                  <div>
                    <h4 className="font-bold text-sm text-slate-955 dark:text-white flex items-center gap-2">
                      {p.title}
                      {p.featured && <span className="text-[8px] bg-amber-500/25 border border-amber-500 text-amber-500 px-1 py-0.2 rounded uppercase font-bold">Featured</span>}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{p.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editProject(p)}
                      className="p-2 text-slate-400 hover:text-lime-605 hover:bg-lime-50 dark:hover:bg-lime-950/20 rounded-lg transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteProject(p._id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- BLOGS PANEL --- */}
      {activeTab === "blog" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CRUD Form */}
          <form onSubmit={handleBlogSubmit} className="lg:col-span-7 bg-white dark:bg-card-dark border border-slate-200 dark:border-zinc-800/80 rounded-3xl p-6 space-y-4">
            <h2 className="text-lg font-bold">{editingBlogId ? "Edit Article" : "Write New Article"}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Title</label>
                <input
                  type="text"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">URL Slug</label>
                <input
                  type="text"
                  placeholder="nextjs-scaling-tips"
                  value={blogSlug}
                  onChange={(e) => setBlogSlug(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Short Summary / Excerpt</label>
              <input
                type="text"
                value={blogExcerpt}
                onChange={(e) => setBlogExcerpt(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Markdown Content</label>
              <textarea
                rows={8}
                value={blogContent}
                onChange={(e) => setBlogContent(e.target.value)}
                placeholder="# Introduction..."
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white font-mono placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors resize-y"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MediaPicker
                label="Cover Image"
                value={blogCoverImage}
                onChange={setBlogCoverImage}
                typeFilter="image"
              />
              <div className="space-y-2 flex flex-col justify-end pb-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pub"
                    checked={blogPublished}
                    onChange={(e) => setBlogPublished(e.target.checked)}
                    className="rounded text-lime-600 focus:ring-lime-500 w-4 h-4 border-slate-300 dark:border-zinc-800/80"
                  />
                  <label htmlFor="pub" className="text-xs font-semibold text-slate-400">Publish this post</label>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-lime-600 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black text-xs font-bold cursor-pointer disabled:opacity-50 transition-colors"
              >
                <Plus size={14} /> {editingBlogId ? "Save Changes" : "Publish Post"}
              </button>
              {editingBlogId && (
                <button
                  type="button"
                  onClick={resetBlogForm}
                  className="px-4.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-800 text-xs font-bold hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* List Panel */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-lg font-bold">Existing Articles</h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {blogs.map((b) => (
                <div key={b._id} className="p-4 bg-white dark:bg-card-dark border border-slate-200 dark:border-zinc-800/80 rounded-2xl flex justify-between items-center shadow-sm">
                  <div>
                    <h4 className="font-bold text-sm text-slate-955 dark:text-white flex items-center gap-2">
                      {b.title}
                      {b.published ? (
                        <span className="text-[8px] bg-emerald-500/25 border border-emerald-500 text-emerald-500 px-1 py-0.2 rounded font-bold uppercase">Published</span>
                      ) : (
                        <span className="text-[8px] bg-slate-550/20 border border-slate-600 text-slate-450 px-1 py-0.2 rounded font-bold uppercase">Draft</span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">slug: {b.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editBlog(b)}
                      className="p-2 text-slate-400 hover:text-lime-605 hover:bg-lime-50 dark:hover:bg-lime-950/20 rounded-lg transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteBlog(b._id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- MEDIA PANEL --- */}
      {activeTab === "media" && (
        <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-zinc-800/80 rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">Manage Media Library</h2>
          <MediaLibrary />
        </div>
      )}
    </div>
  );
}
