import express from "express";
import upload from "../utils/multer";
import { isAdmin } from "../middleware/auth";
import { verifyToken } from "../middleware/auth";
import User from "../model/userModel";
const userRoutes = express.Router();

//request to view profile
userRoutes.get("/profile", verifyToken, async (req, res) => {
    res.json(req.user);
});

//update profile with image

userRoutes.put("/profile", verifyToken, upload.single("image"), async (req, res) => {
    try {
        const { username } = req.body;

        const profileImage = req.file ? req.file.path : req.user.profileImage;

        const updatedUser = await User.findByIdAndUpdate(req.user._id, { username, profileImage }, { new: true }).select(
            "-password"
        );
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Failed to update profile" });
    }
});
export default userRoutes;
