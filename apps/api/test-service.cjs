const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(".env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/portfolio";

async function run() {
  console.log("Connecting to DB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.");

  const { githubService } = require("./dist/services/githubService.js");

  try {
    console.log("Fetching profile data...");
    const profile = await githubService.getProfileData();
    console.log("Profile resolved:", profile ? profile.login : "null");
  } catch (err) {
    console.error("Profile fetch error:", err.message);
  }

  try {
    console.log("Fetching repositories...");
    const repos = await githubService.getRepositories();
    console.log(`Resolved ${repos ? repos.length : 0} repositories.`);
  } catch (err) {
    console.error("Repos fetch error:", err.message);
  }

  await mongoose.disconnect();
}

run().catch(console.error);
