const express = require("express");
const User = require("../models/user");
const { authenticateToken, isAdmin } = require("../middleware/auth");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.get("/users", authenticateToken, isAdmin, async (req, res) => {
    const { search } = req.query;
    try {
        const query = search ? { $or: [{ username: new RegExp(search, "i") }, { email: new RegExp(search, "i") }] } : {};
        const users = await User.find(query).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/users", authenticateToken, isAdmin, async (req, res) => {
    const { username, email, phone, password, role } = req.body;

    try {

      console.log("admin user reg worked")
        // 1. Check if all fields are provided
        if (!username || !email || !phone || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2. Check if username or email contain spaces
        if (/\s/.test(username)) {
            return res.status(400).json({ message: "Username cannot contain spaces" });
        }

        if (/\s/.test(email)) {
            return res.status(400).json({ message: "Email cannot contain spaces" });
        }

        // 3. Check if username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // 4. Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // 5. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 6. Create and save the new user
        const user = new User({
            username,
            email,
            phone,
            password: hashedPassword,
            role,
        });

        await user.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/users/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/users/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
