import "dotenv/config";
import express from "express";
import { connectDB } from "./db/connect.js";
import mongoose from "mongoose";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// health check route
app.get("/health", (req, res) => {
	const dbState = mongoose.connection.readyState;
	const states = {
		0: "disconnected",
		1: "connected",
		2: "connecting",
		3: "disconnecting",
	};

	res.json({
		server: "running",
		port: 4000,
		database: states[dbState],
		dbOk: dbState === 1,
	});
});

connectDB().then(() => {
	app.listen(4000, () => {
		console.log("server running on 4000");
	});
});
