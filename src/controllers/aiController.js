const aiService = require("../services/aiService");
const taskModel = require("../models/taskModel");

const chat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                message: "Message is required"
            });
        }

        // Get the logged-in user's tasks
        const tasks = await taskModel.getTasksByUser(req.user.id);

        // Send the user's question + tasks to AI
        const response = await aiService.generateResponse(
            message,
            tasks
        );

        res.status(200).json({
            message: "AI response generated successfully",
            response
        });

    } catch (error) {
        console.error("AI error:", error.message);

        res.status(500).json({
            message: "Failed to generate AI response"
        });
    }
};

module.exports = {
    chat
};