const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const authorize_nav = () => {
    return async (req, res, next) => {
        const token = req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer ')
            ? req.headers['authorization'].split(' ')[1]
            : req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId;

            const user = await User.findById(req.userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Set the user role in the request so it can be used in the frontend or other parts of the app
            req.userRole = user.role;

            next();
        } catch (error) {
            res.status(401).json({ message: "Invalid token" });
        }
    };
};

module.exports = authorize_nav;
