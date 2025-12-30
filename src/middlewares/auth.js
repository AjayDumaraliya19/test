const JWT = require("jsonwebtoken");
const config = require("../configs/envConfig.js");
const User = require("../models/userModel.js");

// Create Token
exports.createToken = async (data) => {
    return JWT.sign(
        data,
        config.jwt.secret,
        { expiresIn: config.jwt.expired }
    );
};

// Authorization function
exports.protected = async (req, res, next) => {
    try {
        if (!req?.headers?.authorization?.startsWith("Bearer ")) return res.status(404).json({ success: false, message: "please provided authentication token" });

        const token = req.headers.authorization.split("Bearer ")[1];

        const decoded = JWT.verify(token, config.jwt.secret);
        if (!Object.keys(decoded)?.length) return res.status(422).json({ success: false, message: "unauthorized token" });

        const user = await User.findById(decoded._id);
        if (!Object.keys(user)?.length) return res.status(422).json({ success: false, message: "unauthorized token" });

        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
};