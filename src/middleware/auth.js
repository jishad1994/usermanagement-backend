const jwt = require("jsonwebtoken");
const multer = require('multer');

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



// Custom multer error handler middleware
function multerErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    return res.status(400).json({ message: err.message });
  } else if (err) {
    // Custom errors like fileFilter failures
    return res.status(400).json({ message: err.message });
  }
  next(); // No errors, go to next middleware/route
}


module.exports = { authenticateToken, isAdmin ,multerErrorHandler};
