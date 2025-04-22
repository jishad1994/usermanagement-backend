import express from "express";
import  jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../model/userModel.js";
const authRoutes = express.Router();

//register new user
authRoutes.post("/register", async (req, res) => {
    const { username, email, phone, password } = req.body;

    try {
        if (!username) return res.status(400).json({ message: "username is required" });
        if (!email) return res.status(400).json({ message: "email is required" });
        if (!phone) return res.status(400).json({ message: "phone is required" });
        if (!password) return res.status(400).json({ message: "password is required" });

        const existingUser = await User.findOne({
            $or: [{ username }, { email }, { phone }],
        });

        if (existingUser) {
            if (existingUser.username === username) return res.status(400).json({ message: "Username already exists" });
            if (existingUser.email === email) return res.status(400).json({ message: "Email already exists" });
            if (existingUser.phone === phone) return res.status(400).json({ message: "Phone number already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await new User({ username, email, phone, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "registration failed", error: error.message });
    }
});

//login

authRoutes.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username) return res.status(400).json({ message: "username required" });
        if (!password) return res.status(400).json({ message: "password required" });
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
            },
        });
    } catch (error) {
        console.log("error while logging in", error);
        res.status(500).json({ message: "Login failed", error: error.message });
    }
});

export default authRoutes;
