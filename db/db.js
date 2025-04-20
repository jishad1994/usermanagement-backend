import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const URI = process.env.MONGO_URI;
export const connectDB = async function () {
    try {
        await mongoose.connect(URI);
        console.log("mongoDB connected successfully");
    } catch (err) {
        console.log("erro while connecting DB:", err);
        process.exit(1);
    }
};
