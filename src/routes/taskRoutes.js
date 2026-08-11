const express = require("express");

const authenticate = require("../middleware/authMiddleware");

const {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

const router = express.Router();

router.use(authenticate);

router.post("/", createTask);

router.get("/", getTasks);

router.get("/:id", getTask);

router.patch("/:id", updateTask);

router.delete("/:id", deleteTask);

module.exports = router;