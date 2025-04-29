const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const multer = require("multer");
const router = express.Router();
const { authenticateToken, isAdmin, multerErrorHandler } = require("../middleware/auth");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const isValid = allowedTypes.test(file.mimetype);
    if (isValid) {
        cb(null, true);
    } else {
        cb(new Error("Only jpeg, jpg, png allowed"), false);
    }
};

const upload = multer({ storage, fileFilter });
router.post("/profile/upload", authenticateToken, upload.single("profileImage"), async (req, res) => {
    try {
        console.log("req.user:", req.user);
        console.log("req.file:", req.file.path);
        const user = await User.findById(req.user.id);
        user.profileImage = req.file.path;
        await user.save();
        console.log("usera fter setting image:", user);
        res.json({ message: "Profile image uploaded successfully", user });
    } catch (error) {
        console.log("error while uploading", error.message);
        res.status(500).json({ message: error.message });
    }
});

router.post("/register", async (req, res) => {
    const { username, email, phone, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, phone, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User registered" });
    } catch (error) {
        if (error.code === 11000) {
            console.log("duplicate error worked", error.code);
            console.log("Error keyValue:", error.keyValue);

            const duplicateField = Object.keys(error.keyValue)[0];
            console.log("object keys", duplicateField);
            let message = "";

            if (duplicateField === "username") {
                message = "Username already exists.";
                return res.status(400).json({ message });
            } else if (duplicateField === "email") {
                message = "Email already exists.";
                return res.status(400).json({ message });
            } else {
                message = "Duplicate field value.";
                return res.status(400).json({ message });
            }
        }

        console.log("error is:", error.message);
        res.status(500).json({ message: "Registration failed. Please try again." });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        console.log("username:", username);
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            console.log("pasword doesnt match condition worked");
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log("user:", user);
        // const { password, ...userDetails } = user;
        // console.log("userDetails:", userDetails);
        res.json({ token, role: user.role, user });
    } catch (error) {
        console.log("server error login:", error.message);
        res.status(500).json({ message: error.message });
    }
});

router.get("/getUserData", authenticateToken, async (req, res) => {
    try {
        console.log("req reached in getUsserData");
        console.log("req.user reached get user data:", req.user);
        const user = await User.findById(req.user.id).select("-password");
        console.log(user);
        if (!user) return res.status(404).json({ message: "no user data found" });
        return res.status(200).json(user);
    } catch (error) {
        console.log("error while fetching user data", error.message);
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
