import { model } from "mongoose";

// Load Mongoose models dynamically to avoid circular dependencies
const getProfileModel = () => {
  try {
    return model("Profile");
  } catch {
    return null;
  }
};

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache: {
  profile?: CacheEntry<any>;
  repos?: CacheEntry<any[]>;
  events?: CacheEntry<any[]>;
} = {};

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds

export const githubDebugLogs: string[] = [];

const customCache = new Map<string, CacheEntry<any>>();

// Helper to parse username from GitHub URL
async function getGithubUsername(): Promise<string> {
  githubDebugLogs.push("getGithubUsername called");
  try {
    const Profile = getProfileModel();
    if (Profile) {
      const profile = await Profile.findOne();
      githubDebugLogs.push(`Profile document found: ${!!profile}`);
      if (profile?.social?.github) {
        githubDebugLogs.push(`Profile social.github: ${profile.social.github}`);
        const parts = profile.social.github.split("/").filter(Boolean);
        const username = parts[parts.length - 1];
        if (username) {
          githubDebugLogs.push(`Parsed username: ${username}`);
          return username;
        }
      }
    }
  } catch (err: any) {
    githubDebugLogs.push(`DB Query error in getGithubUsername: ${err.message}`);
    console.error("Database query failed in getGithubUsername, falling back to default:", err);
  }
  githubDebugLogs.push("Falling back to default username: kumaromkar015");
  return "kumaromkar015";
}

async function fetchFromGithub(endpoint: string) {
  const token = process.env.GITHUB_TOKEN;
  githubDebugLogs.push(`fetchFromGithub: endpoint=${endpoint}, tokenExist=${!!token}`);
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  if (token) {
    headers.Authorization = `token ${token}`;
  }

  const url = `https://api.github.com${endpoint}`;
  githubDebugLogs.push(`Fetching URL: ${url}`);
  const response = await fetch(url, { headers });
  githubDebugLogs.push(`Response status: ${response.status} ${response.statusText}`);
  
  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    githubDebugLogs.push(`Error response body: ${errText.substring(0, 100)}`);
    throw new Error(`GitHub API Error: ${response.status} ${response.statusText} - ${errText}`);
  }
  
  const json = await response.json();
  githubDebugLogs.push(`Successfully parsed JSON. Data length/keys: ${Array.isArray(json) ? json.length : Object.keys(json).length}`);
  return json;
}

export const githubService = {
  getGithubUsername,
  clearCache: () => {
    githubDebugLogs.length = 0;
    githubDebugLogs.push("Cache cleared");
    cache.profile = undefined;
    cache.repos = undefined;
    cache.events = undefined;
    customCache.clear();
  },
  getCustomRepository: async (repoName: string) => {
    const now = Date.now();
    const cached = customCache.get(repoName.toLowerCase());
    if (cached && now - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    const data = await fetchFromGithub(`/repos/${repoName}`);
    customCache.set(repoName.toLowerCase(), { data, timestamp: now });
    return data;
  },
  getProfileData: async () => {
    const now = Date.now();
    if (cache.profile && now - cache.profile.timestamp < CACHE_TTL) {
      return cache.profile.data;
    }

    const username = await getGithubUsername();
    const data = await fetchFromGithub(`/users/${username}`);
    
    cache.profile = { data, timestamp: now };
    return data;
  },

  getRepositories: async () => {
    const now = Date.now();
    if (cache.repos && now - cache.repos.timestamp < CACHE_TTL) {
      return cache.repos.data;
    }

    const username = await getGithubUsername();
    const data = await fetchFromGithub(`/users/${username}/repos?per_page=100&sort=updated`);
    
    cache.repos = { data, timestamp: now };
    return data;
  },

  getRecentEvents: async () => {
    const now = Date.now();
    if (cache.events && now - cache.events.timestamp < CACHE_TTL) {
      return cache.events.data;
    }

    const username = await getGithubUsername();
    const data = await fetchFromGithub(`/users/${username}/events?per_page=15`);
    
    // Normalize events
    const normalizedEvents = data
      .filter((event: any) => ["PushEvent", "CreateEvent", "PullRequestEvent", "IssuesEvent"].includes(event.type))
      .map((event: any) => {
        let message = "";
        if (event.type === "PushEvent") {
          message = event.payload.commits?.[0]?.message || "Pushed commits";
        } else if (event.type === "CreateEvent") {
          message = `Created ${event.payload.ref_type} ${event.payload.ref || ""}`;
        } else if (event.type === "PullRequestEvent") {
          message = `${event.payload.action} pull request #${event.payload.number}`;
        } else if (event.type === "IssuesEvent") {
          message = `${event.payload.action} issue #${event.payload.issue?.number}`;
        }

        return {
          id: event.id,
          type: event.type,
          repoName: event.repo.name,
          message,
          createdAt: event.created_at,
        };
      });

    cache.events = { data: normalizedEvents, timestamp: now };
    return normalizedEvents;
  },
};
