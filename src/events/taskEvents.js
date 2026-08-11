const eventEmitter = require("./eventEmitter");
const notificationService = require("../services/notificationService");

eventEmitter.on("task.created", async (task) => {
    try {
        console.log(`🔔 EVENT: Task created → "${task.title}"`);

        await notificationService.createNotification(
            task.user_id,
            `New task created: ${task.title}`,
            "TASK_CREATED"
        );

        console.log("📢 Notification created");
    } catch (error) {
        console.error(
            "Notification event failed:",
            error.message
        );
    }
});

eventEmitter.on("task.completed", async (task) => {
    try {
        await notificationService.createNotification(
            task.user_id,
            `Task completed: ${task.title}`,
            "TASK_COMPLETED"
        );

        console.log("🎉 Completion notification created");
    } catch (error) {
        console.error(
            "Completion notification failed:",
            error.message
        );
    }
});

module.exports = eventEmitter;