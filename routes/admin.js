import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.js";
import User from "../model/userModel.js";
import userRoutes from "./user.js";
const adminRoutes = express.Router();

//search users
adminRoutes.get("/users", verifyToken, isAdmin, async (req, res) => {
    try {
        const search = req.query.search || "";
        const users = await User.find({ username: { $regex: search, $options: "i" } });

        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "error while searching for users" });
    }
});

//udpdate user with id
adminRoutes.put("users/:id", verifyToken, isAdmin, async (req, res) => {
    const { username, role } = req.body;

    try {
        const user = await User.findByIdAndUpdate(req.params.id, { username, role }, { new: true }).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
});

//delete user

userRoutes.delete("/users/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        await User.findByIdAndDelete(id);
        res.json({ message: "user deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "user deletion failed" });
    }
});

export default adminRoutes;
