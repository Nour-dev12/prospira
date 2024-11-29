const jwt = require('jsonwebtoken');
const AsyncHandler = require('express-async-handler');
const User = require('../models/user'); // Ensure correct User model import

const protect = AsyncHandler(async (req, res, next) => {
    let token;

    // Extract token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else {
        res.status(401).json({ message: "No token provided, authorization denied" });
        return;
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');
        console.log("Decoded Token:", decoded);

        // Fetch user from database using `decoded.user`
        const user = await User.findById(decoded.user).select("-password");
        console.log("User from Database:", user);

        if (!user) {
            res.status(401).json({ message: "User not found for this token" });
            return;
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        res.status(401).json({ message: "Invalid or expired token" });
    }
});

module.exports = protect;
