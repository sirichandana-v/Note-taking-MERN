const user = require("../models/userModel");
const jwt = require("jsonwebtoken");


exports.isAuthenticated = async(req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Login first to access this resource"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await user.findById(decoded._id);
        next();
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}