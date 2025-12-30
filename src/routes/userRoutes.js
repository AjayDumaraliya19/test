const router = require("express").Router();
const validation = require("../middlewares/schemaValidator.js");
const userValidator = require("../validators/userValidator.js");
const userController = require("../controllers/userController.js");
const { protected } = require("../middlewares/auth.js");

router.post("/", validation(userValidator.createValidation), userController.createUser);
router.post("/login", validation(userValidator.loginValidation), userController.login);
router.get("/", protected, userController.userlist);

module.exports = router;