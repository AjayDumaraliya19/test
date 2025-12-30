const { createToken } = require("../middlewares/auth.js");
const User = require("../models/userModel.js");
const { errorRes } = require("../utils/responses.js");

// Create User
exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const checkEmail = await User.findOne({ email });
        if (checkEmail) return res.status(409).json({ success: false, message: `email ${email} already exist` });

        const user = await User.create({ username, email, password });

        return res.status(201).json({ success: false, message: "create data successfully", data: user });
    } catch (error) {
        errorRes(res, 500, error?.message);
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: `can't found data with email '${email}'` });

        const varifyPassword = await user.comparePassword(password);
        if (!varifyPassword) return res.status(400).json({ success: false, message: "Password is wrong" });

        const token = await createToken({ _id: user._id });
        if (!token?.length) return res.status(400).json({ success: false, message: "somethig went wrong" });

        return res.status(200).json({
            success: true,
            message: "login successfully",
            token
        })
    } catch (error) {
        errorRes(res, 500, error?.message);
    }
};

// Get User with authenticated admin only
exports.userlist = async (req, res) => {
    try {
        const user = await User.find();

        return res.status(200).json({ success: false, message: "retriving user", data: user || [] });
    } catch (error) {
        errorRes(res, 500, error?.message);
    }
};