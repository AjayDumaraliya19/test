const Joi = require("joi");
const { pick } = require("../helpers/pick.js");

const schemaValidator = (schema) => {
    return (req, res, next) => {
        try {
            const validSchema = pick(schema, ["params", "query", "body"]);

            let object = {};
            if (validSchema.query) object.query = req.query;
            if (validSchema.params) object.params = req.params;
            if (validSchema.body) object.body = req.body;

            const { error, value: schemaVal } = Joi.object(validSchema)
                .prefs({ errors: { label: "key" }, abortEarly: false })
                .validate(object);
            if (error) {
                const errorMsg = error?.details?.map(detail => detail?.message || "").join(", ");
                throw new Error(errorMsg);
            }

            // Safe Marge
            if (validSchema.query) Object.assign(req.query, schemaVal.query);
            if (validSchema.params) Object.assign(req.params, schemaVal.params);
            if (validSchema.body) Object.assign(req.body, schemaVal.body);

            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = schemaValidator;