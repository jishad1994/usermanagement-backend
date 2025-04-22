import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";
import { connectDB } from "./db/db.js";
import fs from "fs";

if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}
dotenv.config();
export const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); //image uploads

//routes

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

//connect db

await connectDB();

//connect server
app.listen(process.env.PORT, () => {
    console.log(`server is running at ${process.env.PORT}`);
});
