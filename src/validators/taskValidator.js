const { ObjectId } = require("mongoose").Types;
const Joi = require("joi");

// ObjectId validator
const objectIdValidator = (value, helpers) => {
    if (!ObjectId.isValid(value)) {
        return helpers.message("Invalid taks ID");
    }
    return value;
};

// Create task Validation
exports.createValidate = {
    body: Joi.object().keys({
        title: Joi.string().trim().min(3).max(100).required(),
        description: Joi.string().trim().allow("", null).optional(),
        status: Joi.string().trim().valid("pending", "completed").required(),
        priority: Joi.number().integer().valid(1, 2, 3, 4, 5).required(),
        due_date: Joi.date().iso().greater("now").required()
    }).required()
};

// Pagination task list validation
exports.paginationValidation = {
    query: Joi.object({
        page: Joi.number().integer().min(1).required(),
        limit: Joi.number().integer().min(10).max(100).required(),
        search: Joi.string().trim().allow("").optional(),
    })
};

// Data by ID Validation
exports.byIdValidation = {
    params: Joi.object({
        _id: Joi.string().trim().required().custom(objectIdValidator, "ObjectId Validation")
    })
};

// Update Task validation
exports.updateValidate = {
    params: Joi.object({
        _id: Joi.string().trim().required().custom(objectIdValidator, "ObjectId Validation")
    }).required(),
    body: Joi.object({
        title: Joi.string().trim().min(3).max(100).optional(),
        description: Joi.string().trim().allow("", null).optional(),
        status: Joi.string().trim().valid("pending", "completed").optional(),
        priority: Joi.number().integer().valid(1, 2, 3, 4, 5).optional(),
        due_date: Joi.date().iso().greater("now").optional()
    })
};

// Update Task Many Validation
exports.updateManyValidation = {
    body: Joi.object({
        taskids: Joi.array().items(Joi.string().trim().required().custom(objectIdValidator, "ObjectId Validation")).min(1).required(),
        updateData: Joi.object({
            status: Joi.string().trim().valid("pending", "completed").optional(),
            priority: Joi.number().integer().valid(1, 2, 3, 4, 5).optional(),
            due_date: Joi.date().iso().greater("now").optional()
        }).min(1).required()
    })
};

// Delete Task By Id
exports.deleteValidation = {
    params: Joi.object({
        _id: Joi.string().trim().required().custom(objectIdValidator, "ObjectId Validation")
    }).required()
};

// Delete Many Task By Id
exports.deleteManyValidation = {
    body: Joi.object({
        taskids: Joi.array().items(Joi.string().trim().required().custom(objectIdValidator, "ObjectId Validation")).required()
    }).required()
}