import dns from "dns";
import mongoose from "mongoose";

// Set DNS servers to Google DNS to handle issues resolving MongoDB Atlas SRV records
try {
	dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (error) {
	console.warn("⚠️ Could not set DNS servers:", error.message);
}

const connectDB = async () => {
	try {
		console.log("MongoDB URI", process.env.MONGODB_URI ? `${process.env.MONGODB_URI.substring(0, 20)}...` : "undefined");

		await mongoose.connect(process.env.MONGODB_URI);

		console.log("✅ MongoDB Connected");
	} catch (error) {
		console.error("❌ MongoDB Connection Error:", error.message);
		process.exit(1);
	}
};

export default connectDB;
