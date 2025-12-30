const router = require("express").Router();
const taskRoutes = require("./taksRoutes.js");
const userRoutes = require("./userRoutes.js");

router.use("/task", taskRoutes);
router.use("/user", userRoutes);

module.exports = router;