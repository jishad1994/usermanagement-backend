import express from "express";
import upload from "../utils/multer";
import { isAdmin } from "../middleware/auth";
import { verifyToken } from "../middleware/auth";
const userRoutes = express.Router();




userRoutes.get("/profile")

export default userRoutes;
