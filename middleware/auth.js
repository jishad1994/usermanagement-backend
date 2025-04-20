import * as jwt from "jsonwebtoken";
import User from "..userModel.js";

export const verifyToken = async (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        console.log("error occured while verifying the jwt token", error);
        return res.status(404).json({ message: "invalid token" });
    }
};

export const isAdmin = async (req, res, next) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" }); //deny access
    next(); //else continue
};
