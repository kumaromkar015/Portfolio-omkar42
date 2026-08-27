import { MetadataRoute } from "next";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  
  let baseUrl = "https://omkarkumar.dev";
  let rules: MetadataRoute.Robots["rules"] = {
    userAgent: "*",
    allow: "/",
    disallow: ["/admin/", "/api/"],
  };

  try {
    const seoRes = await fetch(`${API_URL}/seo`);
    const seoJson = await seoRes.json();
    if (seoJson?.success && seoJson?.data) {
      const global = seoJson.data.global || {};
      baseUrl = global.siteUrl || baseUrl;
      if (global.robots && global.robots.includes("noindex")) {
        rules = {
          userAgent: "*",
          disallow: "/",
        };
      }
    }
  } catch (e) {
    // Ignore, use standard configuration
  }

  return {
    rules,
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
