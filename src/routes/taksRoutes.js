const router = require("express").Router();
const validation = require("../middlewares/schemaValidator.js");
const taskValidation = require("../validators/taskValidator.js");
const taskControllers = require("../controllers/taskController.js");

router.post("/", validation(taskValidation.createValidate), taskControllers.createTask);
router.get("/", taskControllers.listTaskAll);
router.get("/list", validation(taskValidation.paginationValidation), taskControllers.listOfTasks);
router.get("/:_id", validation(taskValidation.byIdValidation), taskControllers.TaskById);
router.patch("/update", validation(taskValidation.updateManyValidation), taskControllers.updateManyTask);
router.patch("/update/:_id", validation(taskValidation.updateValidate), taskControllers.updateTask);
router.delete("/delete/:_id", validation(taskValidation.deleteValidation), taskControllers.deleteTask);
router.delete("/delete", validation(taskValidation.deleteManyValidation), taskControllers.deleteManyTask);

module.exports = router;