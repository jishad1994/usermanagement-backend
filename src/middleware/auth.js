const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log("auth header", req.headers);
    const token = authHeader && authHeader.split(" ")[1];

    console.log("token:", token);

    if (!token) return res.status(401).json({ message: "Access denied" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          console.log(err.message)
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;
        console.log("user set by jwt is :", user);
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
};

module.exports = { authenticateToken, isAdmin };
