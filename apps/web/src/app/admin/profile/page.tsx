"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Save, CheckCircle, AlertCircle, Plus, Edit2, Trash2, X, Eye, EyeOff, Loader2, Calendar, Award, Star, Trophy, GraduationCap, Medal, Globe } from "lucide-react";
import MediaPicker from "@/components/media/MediaPicker";
import { parseMediaUrl } from "@/lib/cloudinary";

interface TimelineEntry {
  _id?: string;
  company: string; // Organization
  position: string; // Role/Degree/Title
  duration: string; // Date range
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  type: "work" | "education" | "project" | "goal";
  displayOrder: number;
  isVisible: boolean;
  imageUrl?: string;
  location?: string;
}

interface AchievementEntry {
  _id?: string;
  title: string;
  type: "hackathon" | "cert" | "award" | "milestone" | "course" | "recognition";
  date?: string;
  description?: string;
  issuer?: string; // Organization
  link?: string; // Credential URL
  imageUrl?: string;
  certificateUrl?: string; // Certificate PDF
  featured: boolean;
  displayOrder: number;
  isVisible: boolean;
}

export default function AdminProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "timeline" | "achievements">("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Basic Profile Form State
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [profileResumeUrl, setProfileResumeUrl] = useState("");
  const [profileSocialGithub, setProfileSocialGithub] = useState("");
  const [profileSocialLinkedin, setProfileSocialLinkedin] = useState("");
  const [profileSocialTwitter, setProfileSocialTwitter] = useState("");

  // Timeline Items State
  const [timelineItems, setTimelineItems] = useState<TimelineEntry[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimelineEntry | null>(null);

  // Timeline Form State
  const [org, setOrg] = useState("");
  const [role, setRole] = useState("");
  const [duration, setDuration] = useState("");
  const [responsibilitiesText, setResponsibilitiesText] = useState("");
  const [technologiesText, setTechnologiesText] = useState("");
  const [achievementsText, setAchievementsText] = useState("");
  const [type, setType] = useState<TimelineEntry["type"]>("work");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState("");

  // Achievements State
  const [achievementsList, setAchievementsList] = useState<AchievementEntry[]>([]);
  const [achLoading, setAchLoading] = useState(false);
  const [isAchModalOpen, setIsAchModalOpen] = useState(false);
  const [editingAch, setEditingAch] = useState<AchievementEntry | null>(null);

  // Achievement Form State
  const [achTitle, setAchTitle] = useState("");
  const [achType, setAchType] = useState<AchievementEntry["type"]>("cert");
  const [achDate, setAchDate] = useState("");
  const [achDescription, setAchDescription] = useState("");
  const [achIssuer, setAchIssuer] = useState("");
  const [achLink, setAchLink] = useState("");
  const [achImageUrl, setAchImageUrl] = useState("");
  const [achCertificateUrl, setAchCertificateUrl] = useState("");
  const [achFeatured, setAchFeatured] = useState(false);
  const [achDisplayOrder, setAchDisplayOrder] = useState(0);
  const [achIsVisible, setAchIsVisible] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchTimeline();
    fetchAchievements();
  }, []);

  const clearAlerts = () => {
    setMessage("");
    setError("");
  };

  // ── Profile API handlers ─────────────────────────────────
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

  // ── Timeline API handlers ────────────────────────────────
  const fetchTimeline = async () => {
    setTimelineLoading(true);
    try {
      const data = await api.getExperiences(true);
      setTimelineItems(data || []);
    } catch (err) {
      console.error("Failed to load timeline entries:", err);
    } finally {
      setTimelineLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setOrg("");
    setRole("");
    setDuration("");
    setResponsibilitiesText("");
    setTechnologiesText("");
    setAchievementsText("");
    setType("work");
    setDisplayOrder(timelineItems.length);
    setIsVisible(true);
    setImageUrl("");
    setLocation("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: TimelineEntry) => {
    setEditingItem(item);
    setOrg(item.company);
    setRole(item.position);
    setDuration(item.duration);
    setResponsibilitiesText(item.responsibilities?.join("\n") || "");
    setTechnologiesText(item.technologies?.join(", ") || "");
    setAchievementsText(item.achievements?.join("\n") || "");
    setType(item.type || "work");
    setDisplayOrder(item.displayOrder || 0);
    setIsVisible(item.isVisible !== false);
    setImageUrl(item.imageUrl || "");
    setLocation(item.location || "");
    setIsModalOpen(true);
  };

  const handleTimelineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org || !role || !duration) {
      alert("Organization, Role/Degree, and Date/Duration are required.");
      return;
    }

    const payload = {
      company: org,
      position: role,
      duration,
      responsibilities: responsibilitiesText.split("\n").map(s => s.trim()).filter(Boolean),
      technologies: technologiesText.split(",").map(s => s.trim()).filter(Boolean),
      achievements: achievementsText.split("\n").map(s => s.trim()).filter(Boolean),
      type,
      displayOrder: Number(displayOrder),
      isVisible,
      imageUrl: imageUrl || undefined,
      location: location || undefined,
    };

    try {
      if (editingItem?._id) {
        await api.updateExperience(editingItem._id, payload);
      } else {
        await api.createExperience(payload);
      }
      setIsModalOpen(false);
      fetchTimeline();
    } catch (err: any) {
      alert(err.message || "Failed to save timeline entry");
    }
  };

  const handleDeleteTimeline = async (id: string) => {
    if (confirm("Are you sure you want to delete this career journey timeline entry?")) {
      try {
        await api.deleteExperience(id);
        fetchTimeline();
      } catch (err: any) {
        alert(err.message || "Failed to delete timeline entry");
      }
    }
  };

  // ── Achievements API handlers ─────────────────────────────
  const fetchAchievements = async () => {
    setAchLoading(true);
    try {
      const data = await api.getAchievements(true); // get all including hidden
      setAchievementsList(data || []);
    } catch (err) {
      console.error("Failed to load achievements:", err);
    } finally {
      setAchLoading(false);
    }
  };

  const openAddAchModal = () => {
    setEditingAch(null);
    setAchTitle("");
    setAchType("cert");
    setAchDate("");
    setAchDescription("");
    setAchIssuer("");
    setAchLink("");
    setAchImageUrl("");
    setAchCertificateUrl("");
    setAchFeatured(false);
    setAchDisplayOrder(achievementsList.length);
    setAchIsVisible(true);
    setIsAchModalOpen(true);
  };

  const openEditAchModal = (item: AchievementEntry) => {
    setEditingAch(item);
    setAchTitle(item.title);
    setAchType(item.type || "cert");
    setAchDate(item.date || "");
    setAchDescription(item.description || "");
    setAchIssuer(item.issuer || "");
    setAchLink(item.link || "");
    setAchImageUrl(item.imageUrl || "");
    setAchCertificateUrl(item.certificateUrl || "");
    setAchFeatured(item.featured || false);
    setAchDisplayOrder(item.displayOrder || 0);
    setAchIsVisible(item.isVisible !== false);
    setIsAchModalOpen(true);
  };

  const handleAchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!achTitle) {
      alert("Title is required.");
      return;
    }

    const payload = {
      title: achTitle,
      type: achType,
      date: achDate,
      description: achDescription,
      issuer: achIssuer,
      link: achLink,
      imageUrl: achImageUrl || undefined,
      certificateUrl: achCertificateUrl || undefined,
      featured: achFeatured,
      displayOrder: Number(achDisplayOrder),
      isVisible: achIsVisible,
    };

    try {
      if (editingAch?._id) {
        await api.updateAchievement(editingAch._id, payload);
      } else {
        await api.createAchievement(payload);
      }
      setIsAchModalOpen(false);
      fetchAchievements();
    } catch (err: any) {
      alert(err.message || "Failed to save achievement");
    }
  };

  const handleDeleteAch = async (id: string) => {
    if (confirm("Are you sure you want to delete this achievement?")) {
      try {
        await api.deleteAchievement(id);
        fetchAchievements();
      } catch (err: any) {
        alert(err.message || "Failed to delete achievement");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Tabs */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-zinc-800 pb-px">
        <button
          onClick={() => {
            setActiveTab("profile");
            clearAlerts();
          }}
          className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
            activeTab === "profile"
              ? "border-lime-650 text-lime-650 dark:border-lime-400 dark:text-lime-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Basic Profile Info
        </button>
        <button
          onClick={() => {
            setActiveTab("timeline");
            clearAlerts();
          }}
          className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
            activeTab === "timeline"
              ? "border-lime-650 text-lime-650 dark:border-lime-400 dark:text-lime-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Career Timeline Manager
        </button>
        <button
          onClick={() => {
            setActiveTab("achievements");
            clearAlerts();
          }}
          className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
            activeTab === "achievements"
              ? "border-lime-650 text-lime-650 dark:border-lime-400 dark:text-lime-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Achievements Wall
        </button>
      </div>

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

      {activeTab === "profile" && (
        // ── Tab 1: Profile Details Form ──────────────────────
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
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Short Bio</label>
              <input
                type="text"
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">GitHub URL</label>
              <input
                type="text"
                value={profileSocialGithub}
                onChange={(e) => setProfileSocialGithub(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">LinkedIn URL</label>
              <input
                type="text"
                value={profileSocialLinkedin}
                onChange={(e) => setProfileSocialLinkedin(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Twitter URL</label>
              <input
                type="text"
                value={profileSocialTwitter}
                onChange={(e) => setProfileSocialTwitter(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500"
              />
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <MediaPicker
                label="Profile Photo"
                value={profilePhoto}
                onChange={setProfilePhoto}
                typeFilter="image"
              />
              <div className="space-y-4">
                <MediaPicker
                  label="Resume PDF"
                  value={profileResumeUrl}
                  onChange={setProfileResumeUrl}
                  typeFilter="pdf"
                />
                
                {profileResumeUrl && (
                  <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/40 space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
                      <span>Resume Preview</span>
                      <span className="text-[10px] text-lime-400 font-semibold uppercase tracking-wider bg-lime-500/10 px-2 py-0.5 rounded-full">PDF Document</span>
                    </div>
                    <div className="relative w-full h-[250px] border border-slate-850 rounded-xl overflow-hidden bg-slate-950">
                      <iframe
                        src={`${profileResumeUrl}#toolbar=0&navpanes=0`}
                        className="w-full h-full border-0"
                        title="Resume PDF Preview"
                      />
                    </div>
                    <div className="flex gap-3">
                      <a
                        href={profileResumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center py-2 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-350 hover:text-white font-extrabold text-xs uppercase tracking-wider transition-colors"
                      >
                        Open PDF
                      </a>
                      <a
                        href={parseMediaUrl(profileResumeUrl)?.downloadUrl || profileResumeUrl}
                        download={parseMediaUrl(profileResumeUrl)?.fileName || "Omkar_Resume.pdf"}
                        className="flex-1 text-center py-2 px-4 rounded-xl bg-lime-600 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black font-extrabold text-xs uppercase tracking-wider transition-colors"
                      >
                        Download PDF
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-lime-650 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 transition-colors"
          >
            <Save size={15} /> {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      )}

      {activeTab === "timeline" && (
        // ── Tab 2: Timeline Entries CRUD Manager ─────────────
        <div className="bg-white dark:bg-card-dark border border-slate-205 dark:border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-zinc-900/60">
            <div>
              <h2 className="text-xl font-bold">Interactive Career Timeline</h2>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                Manage your work experience, education milestones, milestones, and future career goals.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-lime-650 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <Plus size={14} /> Add Entry
            </button>
          </div>

          {timelineLoading ? (
            <div className="py-20 flex justify-center items-center">
              <Loader2 className="animate-spin text-lime-500" size={32} />
            </div>
          ) : timelineItems.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl bg-slate-905 dark:bg-bg-dark/10 text-slate-500">
              <h3 className="text-sm font-bold uppercase tracking-wider">No Timeline Entries Found</h3>
              <p className="text-xs text-slate-650 mt-1">Upload your first education or work history entry.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {timelineItems.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-slate-900/10 dark:bg-slate-950/20 border border-slate-200 dark:border-zinc-850 rounded-2xl gap-4"
                >
                  <div className="flex items-start gap-4">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider text-black mt-1 ${
                      item.type === "work" ? "bg-cyan-400" :
                      item.type === "education" ? "bg-violet-400" :
                      item.type === "project" ? "bg-lime-400" : "bg-amber-400"
                    }`}>
                      {item.type}
                    </span>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                        {item.position} <span className="text-slate-400 font-semibold">at {item.company}</span>
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-semibold">
                        <Calendar size={11} /> {item.duration}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4.5 justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-150 dark:border-zinc-850">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                      Order: {item.displayOrder}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 rounded bg-slate-905 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:text-lime-450 cursor-pointer"
                        title="Edit Entry"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteTimeline(item._id!)}
                        className="p-2 rounded bg-rose-955/20 border border-rose-900/40 text-rose-500 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                        title="Delete Entry"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "achievements" && (
        // ── Tab 3: Achievements CRUD Dashboard ─────────────
        <div className="bg-white dark:bg-card-dark border border-slate-205 dark:border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-zinc-900/60">
            <div>
              <h2 className="text-xl font-bold">Achievements & Certifications Wall</h2>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                Manage your credentials, courses, hackathons, and certifications.
              </p>
            </div>
            <button
              onClick={openAddAchModal}
              className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-lime-650 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <Plus size={14} /> Add Achievement
            </button>
          </div>

          {achLoading ? (
            <div className="py-20 flex justify-center items-center">
              <Loader2 className="animate-spin text-lime-500" size={32} />
            </div>
          ) : achievementsList.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl bg-slate-905 dark:bg-bg-dark/10 text-slate-500">
              <h3 className="text-sm font-bold uppercase tracking-wider">No Achievements Found</h3>
              <p className="text-xs text-slate-650 mt-1">Upload your credentials, awards, or cert PDFs to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {achievementsList.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-slate-900/10 dark:bg-slate-950/20 border border-slate-200 dark:border-zinc-850 rounded-2xl gap-4"
                >
                  <div className="flex items-start gap-4">
                    <span className="p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 text-lime-400 flex items-center justify-center">
                      {item.type === "award" ? <Trophy size={18} /> :
                       item.type === "course" ? <GraduationCap size={18} /> :
                       item.type === "hackathon" ? <Medal size={18} /> : <Award size={18} />}
                    </span>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                        {item.title} <span className="text-slate-400 font-semibold">at {item.issuer}</span>
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-semibold">
                        <Calendar size={11} /> {item.date} • <span className="uppercase">{item.type}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4.5 justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-150 dark:border-zinc-850">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                      Order: {item.displayOrder}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditAchModal(item)}
                        className="p-2 rounded bg-slate-905 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:text-lime-450 cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteAch(item._id!)}
                        className="p-2 rounded bg-rose-955/20 border border-rose-900/40 text-rose-500 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Editor Modal for Timeline */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-hidden text-slate-900 dark:text-white">
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-955 border border-slate-200 dark:border-zinc-850 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-900/60 px-6 py-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                {editingItem ? "Edit Timeline Entry" : "Add Timeline Entry"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded bg-slate-100 dark:bg-zinc-900 text-slate-450 hover:text-rose-500 cursor-pointer">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleTimelineSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>Milestone Type*</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="work">Work Experience</option>
                    <option value="education">Education Degree</option>
                    <option value="project">Major Project Milestone</option>
                    <option value="goal">Future Career Goal</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label>Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>Organization / Company / School*</label>
                  <input
                    type="text"
                    required
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="e.g. Google, Stanford University"
                    className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label>Role / Degree / Milestone Title*</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Senior Architect, B.S. Computer Science"
                    className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>Date / Duration range*</label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 2023 - Present, Sept 2018 - June 2022"
                    className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label>Geographic Location (Optional)</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label>Responsibilities & Details (One per line)</label>
                <textarea
                  value={responsibilitiesText}
                  onChange={(e) => setResponsibilitiesText(e.target.value)}
                  placeholder="Enter details or responsibilities, one per line..."
                  rows={3}
                  className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label>Achievements (One per line)</label>
                <textarea
                  value={achievementsText}
                  onChange={(e) => setAchievementsText(e.target.value)}
                  placeholder="Enter custom achievements or highlights, one per line..."
                  rows={2}
                  className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label>Technologies Used (Comma-separated)</label>
                <input
                  type="text"
                  value={technologiesText}
                  onChange={(e) => setTechnologiesText(e.target.value)}
                  placeholder="e.g. React, Next.js"
                  className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <MediaPicker label="Milestone Image (Optional)" value={imageUrl} onChange={setImageUrl} typeFilter="image" />
              </div>

              <div className="flex gap-6 items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} className="w-4.5 h-4.5 accent-lime-500 cursor-pointer" />
                  <span>Visible (Publish)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-900/60 flex justify-end gap-3.5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-250 dark:border-zinc-800 hover:bg-slate-905 hover:text-white transition-colors cursor-pointer text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-lime-650 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black text-xs font-bold shadow-md cursor-pointer">
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Editor Modal for Achievements */}
      {isAchModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-hidden text-slate-900 dark:text-white">
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-955 border border-slate-200 dark:border-zinc-850 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-900/60 px-6 py-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                {editingAch ? "Edit Achievement" : "Add Achievement"}
              </h3>
              <button onClick={() => setIsAchModalOpen(false)} className="p-1.5 rounded bg-slate-100 dark:bg-zinc-900 text-slate-450 hover:text-rose-500 cursor-pointer">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAchSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div className="space-y-1.5">
                <label>Achievement Title*</label>
                <input
                  type="text"
                  required
                  value={achTitle}
                  onChange={(e) => setAchTitle(e.target.value)}
                  placeholder="e.g. AWS Solutions Architect, HackMIT Winner"
                  className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>Type*</label>
                  <select
                    value={achType}
                    onChange={(e) => setAchType(e.target.value as any)}
                    className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="cert">Certification</option>
                    <option value="award">Award / Trophy</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="milestone">Career Milestone</option>
                    <option value="course">Course / Study Completion</option>
                    <option value="recognition">Official Recognition</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label>Display Order</label>
                  <input
                    type="number"
                    value={achDisplayOrder}
                    onChange={(e) => setAchDisplayOrder(Number(e.target.value))}
                    className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>Issuer / Organization</label>
                  <input
                    type="text"
                    value={achIssuer}
                    onChange={(e) => setAchIssuer(e.target.value)}
                    placeholder="e.g. Amazon Web Services, Microsoft"
                    className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label>Date Received</label>
                  <input
                    type="text"
                    value={achDate}
                    onChange={(e) => setAchDate(e.target.value)}
                    placeholder="e.g. Nov 2025, Sept 2024"
                    className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label>Description / Highlights</label>
                <textarea
                  value={achDescription}
                  onChange={(e) => setAchDescription(e.target.value)}
                  placeholder="Summarize the award or certification credentials..."
                  rows={3}
                  className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label>Credential Verification URL (Optional)</label>
                <input
                  type="text"
                  value={achLink}
                  onChange={(e) => setAchLink(e.target.value)}
                  placeholder="e.g. https://credly.com/certs/..."
                  className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MediaPicker label="Achievement Thumbnail (Image)" value={achImageUrl} onChange={setAchImageUrl} typeFilter="image" />
                <MediaPicker label="Certificate Document (PDF)" value={achCertificateUrl} onChange={setAchCertificateUrl} typeFilter="pdf" />
              </div>

              <div className="flex gap-6 items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={achFeatured} onChange={(e) => setAchFeatured(e.target.checked)} className="w-4.5 h-4.5 accent-lime-500 cursor-pointer" />
                  <span>Featured Achievement</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={achIsVisible} onChange={(e) => setAchIsVisible(e.target.checked)} className="w-4.5 h-4.5 accent-lime-500 cursor-pointer" />
                  <span>Visible (Publish)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-900/60 flex justify-end gap-3.5">
                <button type="button" onClick={() => setIsAchModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-250 dark:border-zinc-800 hover:bg-slate-905 hover:text-white transition-colors cursor-pointer text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-lime-650 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black text-xs font-bold shadow-md cursor-pointer">
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
