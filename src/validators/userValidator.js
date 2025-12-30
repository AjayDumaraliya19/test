const Joi = require("joi");

// Create User Validation
exports.createValidation = {
    body: Joi.object({
        username: Joi.string().trim().min(3).max(50).required(),
        email: Joi.string().trim().pattern(/^\S+@\S+\.\S+$/).required(),
        password: Joi.string().trim().required()
    })
};

// Login Validation
exports.loginValidation = {
    body: Joi.object({
        email: Joi.string().trim().pattern(/^\S+@\S+\.\S+$/).required(),
        password: Joi.string().trim().required()
    })
};