require("dotenv").config();
const Joi = require("joi");

const envVarSchema = Joi.object().keys({
    PORT: Joi.number().integer().required(),
    URL: Joi.string().trim().required(),
    JWT_SECRET: Joi.string().trim().required(),
    JWT_EXPIRED: Joi.string().trim().required()
}).unknown();

const { error, value: envVar } = envVarSchema
    .prefs({ errors: { label: "key" } })
    .validate(process.env);
if (error) {
    console.log("Config Error:", error?.message || "");
    throw new Error(`Config Error: ${error?.message || ""}`);
}

module.exports = {
    port: envVar.PORT,
    url: envVar.URL,
    jwt: {
        secret: envVar.JWT_SECRET,
        expired: envVar.JWT_EXPIRED
    }
}