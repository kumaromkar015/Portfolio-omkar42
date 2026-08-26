import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testUpload() {
  console.log("Uploading a test image to your Cloudinary storage...");

  // A tiny 1x1 transparent pixel in Base64 format
  const dummyBase64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

  try {
    const response = await cloudinary.uploader.upload(dummyBase64Image, {
      folder: "portfolio_test",
      public_id: "verification_pixel",
    });

    console.log("\n✅ Upload Successful!");
    console.log("----------------------------------------");
    console.log("Public ID:", response.public_id);
    console.log("Asset Format:", response.format);
    console.log("Image URL (Open this in your browser):");
    console.log(response.secure_url);
    console.log("----------------------------------------");
  } catch (error: any) {
    console.error("\n❌ Upload Failed!");
    console.error("Error details:", error.message || error);
  }
}

testUpload();
