const taskModel = require("../models/taskModel");
const redis = require("../config/redis");
const eventEmitter = require("../events/eventEmitter");
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            due_date
        } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        const allowedPriorities = [
            "LOW",
            "MEDIUM",
            "HIGH"
        ];

        const taskPriority = priority || "MEDIUM";

        if (!allowedPriorities.includes(taskPriority)) {
            return res.status(400).json({
                message: "Priority must be LOW, MEDIUM or HIGH"
            });
        }

        const task = await taskModel.createTask(
            req.user.id,
            title,
            description || null,
            taskPriority,
            due_date || null
        );

        // Clear user's task cache
        await redis.del(`tasks:user:${req.user.id}`);
        eventEmitter.emit("task.created", task);
        res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create task"
        });
    }
};


const getTasks = async (req, res) => {
    try {
        const cacheKey = `tasks:user:${req.user.id}`;

        // Check Redis first
        const cachedTasks = await redis.get(cacheKey);

        if (cachedTasks) {
            console.log("Tasks served from Redis");

            const tasks = JSON.parse(cachedTasks);

            return res.json({
                source: "redis",
                count: tasks.length,
                tasks
            });
        }

        // Redis cache miss → PostgreSQL
        console.log("Tasks fetched from PostgreSQL");

        const tasks = await taskModel.getTasksByUser(
            req.user.id
        );

        // Store tasks in Redis for 60 seconds
        await redis.set(
            cacheKey,
            JSON.stringify(tasks),
            "EX",
            60
        );

        res.json({
            source: "postgresql",
            count: tasks.length,
            tasks
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch tasks"
        });
    }
};


const getTask = async (req, res) => {
    try {
        const task = await taskModel.getTaskById(
            req.params.id,
            req.user.id
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json(task);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch task"
        });
    }
};


const updateTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            status,
            due_date
        } = req.body;

        const allowedPriorities = [
            "LOW",
            "MEDIUM",
            "HIGH"
        ];

        const allowedStatuses = [
            "PENDING",
            "IN_PROGRESS",
            "COMPLETED"
        ];

        if (priority && !allowedPriorities.includes(priority)) {
            return res.status(400).json({
                message: "Invalid priority"
            });
        }

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const existingTask = await taskModel.getTaskById(
            req.params.id,
            req.user.id
        );

        if (!existingTask) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const task = await taskModel.updateTask(
            req.params.id,
            req.user.id,
            title || existingTask.title,
            description ?? existingTask.description,
            priority || existingTask.priority,
            status || existingTask.status,
            due_date ?? existingTask.due_date
        );

        // Clear cache after update
        await redis.del(`tasks:user:${req.user.id}`);

        res.json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update task"
        });
    }
};


const deleteTask = async (req, res) => {
    try {
        const task = await taskModel.deleteTask(
            req.params.id,
            req.user.id
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Clear cache after deletion
        await redis.del(`tasks:user:${req.user.id}`);

        res.json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete task"
        });
    }
};


module.exports = {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask
};