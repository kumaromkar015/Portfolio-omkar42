import { Router, Request, Response } from "express";
import { githubService, githubDebugLogs } from "../services/githubService.js";
import { GithubRepoConfig } from "../models/github.js";
import { authMiddleware } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

// Get Public GitHub activity & repos
router.get(
  "/summary",
  asyncHandler(async (req: Request, res: Response) => {
    githubDebugLogs.length = 0;
    const isAdminView = req.query.all === "true";
    if (req.query.clearCache === "true") {
      githubService.clearCache();
    }

    const errors: string[] = [];
    const username = await githubService.getGithubUsername().catch((err: any) => {
      errors.push(`Username fetch error: ${err.message}`);
      return "kumaromkar015";
    });

    // 1. Fetch raw API data
    const [profile, rawRepos, events] = await Promise.all([
      githubService.getProfileData().catch((err: any) => {
        errors.push(`Profile fetch error: ${err.message}`);
        console.error("Profile API Error:", err);
        return null;
      }),
      githubService.getRepositories().catch((err: any) => {
        errors.push(`Repos fetch error: ${err.message}`);
        console.error("Repos API Error:", err);
        return [];
      }),
      githubService.getRecentEvents().catch((err: any) => {
        errors.push(`Events fetch error: ${err.message}`);
        console.error("Events API Error:", err);
        return [];
      }),
    ]);

    // 2. Fetch admin overrides from MongoDB
    const configs = await GithubRepoConfig.find();
    const configMap = new Map(configs.map((c) => [c.repoName.toLowerCase(), c]));

    // Fetch custom collaborated repositories
    const customConfigs = configs.filter((c) => c.isCustom);
    const customReposFetched = await Promise.all(
      customConfigs.map(async (config) => {
        try {
          const repo = await githubService.getCustomRepository(config.repoName);
          const liveConfig = configMap.get(repo.full_name.toLowerCase()) || config;
          return {
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            htmlUrl: repo.html_url,
            description: repo.description || "",
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language || "TypeScript",
            updatedAt: repo.updated_at,
            isVisible: liveConfig.isVisible,
            isFeatured: liveConfig.isFeatured,
            displayOrder: liveConfig.displayOrder,
            isCustom: true
          };
        } catch (err: any) {
          errors.push(`Custom repo ${config.repoName} fetch error: ${err.message}`);
          console.error(`Custom repo ${config.repoName} fetch error:`, err);
          return null;
        }
      })
    );
    const validCustomRepos = customReposFetched.filter((r) => r !== null) as any[];

    // 3. Merge API data with overrides
    const processedRepos = rawRepos.map((repo: any) => {
      const config = configMap.get(repo.full_name.toLowerCase()) || configMap.get(repo.name.toLowerCase());
      return {
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        htmlUrl: repo.html_url,
        description: repo.description || "",
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || "TypeScript",
        updatedAt: repo.updated_at,
        isVisible: config ? config.isVisible : true,
        isFeatured: config ? config.isFeatured : false,
        displayOrder: config ? config.displayOrder : 0,
        isCustom: false
      };
    });

    // Combine owned and custom collaborated repos
    let repos = [...processedRepos, ...validCustomRepos];
    if (!isAdminView) {
      repos = repos.filter((r: any) => r.isVisible);
    }

    repos.sort((a: any, b: any) => {
      // 1st: Featured items first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;

      // 2nd: displayOrder ascending (smaller numbers first)
      if (a.displayOrder !== b.displayOrder) {
        return a.displayOrder - b.displayOrder;
      }

      // 3rd: stars descending
      if (b.stars !== a.stars) {
        return b.stars - a.stars;
      }

      // 4th: updated date descending
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    res.json({
      success: true,
      data: {
        lastUpdated: new Date().toISOString(),
        resolvedUsername: username,
        errors: errors.length > 0 ? errors : undefined,
        debugLogs: githubDebugLogs,
        profile,
        repos,
        events,
      },
    });
  })
);

// Save / Update Repository config overrides (Protected)
router.post(
  "/config",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { repoName, isVisible, isFeatured, displayOrder } = req.body;

    if (!repoName) {
      res.status(400).json({ success: false, message: "repoName is required" });
      return;
    }

    const isCustom = repoName.includes("/");
    const config = await GithubRepoConfig.findOneAndUpdate(
      { repoName },
      { isVisible, isFeatured, displayOrder, isCustom },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: config });
  })
);

export default router;
