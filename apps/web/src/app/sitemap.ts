import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  
  let baseUrl = "https://omkarkumar.dev";
  try {
    const seoRes = await fetch(`${API_URL}/seo`);
    const seoJson = await seoRes.json();
    if (seoJson?.success && seoJson?.data) {
      baseUrl = seoJson.data.global?.siteUrl || baseUrl;
    }
  } catch (e) {
    // Fallback to default domain
  }

  // Base Pages
  const routes = ["", "/blog"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Fetch Projects for sitemap
  let projectRoutes: any[] = [];
  try {
    const res = await fetch(`${API_URL}/projects`);
    const json = await res.json();
    if (json && json.success && Array.isArray(json.data)) {
      projectRoutes = json.data.map((proj: any) => ({
        url: `${baseUrl}/projects/${proj._id}`,
        lastModified: new Date(proj.updatedAt || proj.createdAt).toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Sitemap projects fetch err:", error);
  }

  // Fetch Blogs for sitemap
  let blogRoutes: any[] = [];
  try {
    const res = await fetch(`${API_URL}/blog?all=false`);
    const json = await res.json();
    if (json && json.success && Array.isArray(json.data)) {
      blogRoutes = json.data.map((blog: any) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: new Date(blog.updatedAt || blog.createdAt).toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error("Sitemap blogs fetch err:", error);
  }

  return [...routes, ...projectRoutes, ...blogRoutes];
}
