import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function checkCloudinary() {
  console.log("Checking Cloudinary connection...");
  console.log(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`API Key: ${process.env.CLOUDINARY_API_KEY ? "Configured" : "Missing"}`);
  console.log(`API Secret: ${process.env.CLOUDINARY_API_SECRET ? "Configured" : "Missing"}`);

  try {
    // Ping Cloudinary API to verify credentials
    const result = await cloudinary.api.ping();
    console.log("\n✅ Cloudinary Connection Successful!");
    console.log("Ping response:", result);
  } catch (error: any) {
    console.error("\n❌ Cloudinary Connection Failed!");
    console.error("Error details:", error.message || error);
  }
}

checkCloudinary();
