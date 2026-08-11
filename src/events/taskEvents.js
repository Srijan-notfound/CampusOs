const eventEmitter = require("./eventEmitter");

eventEmitter.on("task.created", (task) => {
    console.log(
        `🔔 EVENT: Task created → "${task.title}" for user ${task.user_id}`
    );
});

eventEmitter.on("task.completed", (task) => {
    console.log(
        `🎉 EVENT: Task completed → "${task.title}"`
    );
});

module.exports = eventEmitter;