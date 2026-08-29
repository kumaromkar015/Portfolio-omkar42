const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getHeaders(isFormData = false) {
  const headers: HeadersInit = {};
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  const isFormData = options.body instanceof FormData;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(isFormData),
      ...options.headers,
    },
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(json.message || `Request failed with status ${response.status}`);
    (error as any).errors = json.errors;
    (error as any).status = response.status;

    // Handle token expiry globally (401 Unauthorized or 403 Forbidden)
    if ((response.status === 401 || response.status === 403) && typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      if (window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login?error=expired";
      }
    }

    throw error;
  }

  // Backend now returns { success, data, message } — unwrap data when present
  return json.data !== undefined ? json.data : json;
}

export const api = {
  // Auth
  login: (credentials: any) => request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  setupAdmin: (credentials: any) => request("/auth/setup", { method: "POST", body: JSON.stringify(credentials) }),

  // Profile
  getProfile: () => request("/profile"),
  updateProfile: (data: any) => request("/profile", { method: "PUT", body: JSON.stringify(data) }),

  // Projects
  getProjects: () => request("/projects"),
  getProject: (id: string) => request(`/projects/${id}`),
  createProject: (data: any) => request("/projects", { method: "POST", body: JSON.stringify(data) }),
  updateProject: (id: string, data: any) => request(`/projects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProject: (id: string) => request(`/projects/${id}`, { method: "DELETE" }),

  // Blog
  getBlogs: (all = false) => request(`/blog?all=${all}`),
  getBlog: (slug: string) => request(`/blog/${slug}`),
  createBlog: (data: any) => request("/blog", { method: "POST", body: JSON.stringify(data) }),
  updateBlog: (id: string, data: any) => request(`/blog/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteBlog: (id: string) => request(`/blog/${id}`, { method: "DELETE" }),

  // Experience
  getExperiences: () => request("/experience"),
  createExperience: (data: any) => request("/experience", { method: "POST", body: JSON.stringify(data) }),
  updateExperience: (id: string, data: any) => request(`/experience/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteExperience: (id: string) => request(`/experience/${id}`, { method: "DELETE" }),

  // Education
  getEducation: () => request("/education"),
  createEducation: (data: any) => request("/education", { method: "POST", body: JSON.stringify(data) }),
  updateEducation: (id: string, data: any) => request(`/education/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteEducation: (id: string) => request(`/education/${id}`, { method: "DELETE" }),

  // Achievement
  getAchievements: () => request("/achievement"),
  createAchievement: (data: any) => request("/achievement", { method: "POST", body: JSON.stringify(data) }),
  updateAchievement: (id: string, data: any) => request(`/achievement/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteAchievement: (id: string) => request(`/achievement/${id}`, { method: "DELETE" }),

  // Contact
  submitContact: (data: any) => request("/contact", { method: "POST", body: JSON.stringify(data) }),
  getMessages: () => request("/contact"),
  markMessageRead: (id: string) => request(`/contact/${id}`, { method: "PATCH" }),
  deleteMessage: (id: string) => request(`/contact/${id}`, { method: "DELETE" }),

  // Skills CRUD
  getSkills: () => request("/skills"),
  createSkill: (data: any) => request("/skills", { method: "POST", body: JSON.stringify(data) }),
  updateSkill: (id: string, data: any) => request(`/skills/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSkill: (id: string) => request(`/skills/${id}`, { method: "DELETE" }),

  // SEO Management Singleton
  getSeo: () => request("/seo"),
  updateSeo: (data: any) => request("/seo", { method: "PUT", body: JSON.stringify(data) }),

  // Upload
  uploadImage: (image: string, folder?: string) =>
    request("/upload", { method: "POST", body: JSON.stringify({ image, folder }) }),
  deleteImage: (publicId: string) =>
    request("/upload", { method: "DELETE", body: JSON.stringify({ publicId }) }),

  // Media Management (New Unified System)
  getMedia: (params: { page?: number; limit?: number; type?: string; folder?: string; search?: string; source?: string }) => {
    const query = new URLSearchParams();
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));
    if (params.type) query.append("type", params.type);
    if (params.folder) query.append("folder", params.folder);
    if (params.search) query.append("search", params.search);
    if (params.source) query.append("source", params.source);
    return request(`/media?${query.toString()}`);
  },
  uploadMedia: (file: File, folder?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) {
      formData.append("folder", folder);
    }
    return request("/media/upload", {
      method: "POST",
      body: formData,
    });
  },
  addMediaUrl: (payload: { url: string; resourceType: string; mimeType: string; altText?: string; caption?: string }) => {
    return request("/media/url", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  deleteMedia: (id: string) => request(`/media/${id}`, { method: "DELETE" }),
  getMediaReferences: (id: string) => request(`/media/${id}/references`),

  // Gallery CRUD
  getGalleryItems: (params?: { category?: string; all?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append("category", params.category);
    if (params?.all) query.append("all", String(params.all));
    return request(`/gallery?${query.toString()}`);
  },
  createGalleryItem: (data: any) => request("/gallery", { method: "POST", body: JSON.stringify(data) }),
  updateGalleryItem: (id: string, data: any) => request(`/gallery/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteGalleryItem: (id: string) => request(`/gallery/${id}`, { method: "DELETE" }),
};
