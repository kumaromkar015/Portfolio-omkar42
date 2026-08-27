"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Save, CheckCircle, AlertCircle } from "lucide-react";
import MediaPicker from "@/components/media/MediaPicker";

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [profileResumeUrl, setProfileResumeUrl] = useState("");
  const [profileSocialGithub, setProfileSocialGithub] = useState("");
  const [profileSocialLinkedin, setProfileSocialLinkedin] = useState("");
  const [profileSocialTwitter, setProfileSocialTwitter] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const clearAlerts = () => {
    setMessage("");
    setError("");
  };

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
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Short Bio</label>
            <input
              type="text"
              value={profileBio}
              onChange={(e) => setProfileBio(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
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
    </div>
  );
}
