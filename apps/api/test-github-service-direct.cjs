const { githubService } = require("./dist/services/githubService.js");

async function run() {
  console.log("Calling getRepositories directly...");
  try {
    const repos = await githubService.getRepositories();
    console.log(`Successfully fetched ${repos.length} repositories.`);
    if (repos.length > 0) {
      console.log("First repo name:", repos[0].name);
    }
  } catch (err) {
    console.error("Failed to fetch repos:", err);
  }
}

run();
