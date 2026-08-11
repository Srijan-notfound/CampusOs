const notificationService = require("../services/notificationService");

const getNotifications = async (req, res) => {
    try {
        const notifications = await notificationService.getNotifications(
            req.user.id
        );

        res.status(200).json({
            count: notifications.length,
            notifications
        });
    } catch (error) {
        console.error("Get notifications error:", error.message);

        res.status(500).json({
            message: "Failed to fetch notifications"
        });
    }
};const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await notificationService.markAsRead(
            req.params.id,
            req.user.id
        );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        res.status(200).json({
            message: "Notification marked as read",
            notification
        });
    } catch (error) {
        console.error("Mark notification error:", error.message);

        res.status(500).json({
            message: "Failed to mark notification as read"
        });
    }
};
const getUnreadCount = async (req, res) => {
    try {
        const count = await notificationService.getUnreadCount(
            req.user.id
        );

        res.status(200).json({ count });
    } catch (error) {
        console.error("Unread count error:", error.message);

        res.status(500).json({
            message: "Failed to get unread notification count"
        });
    }
};
module.exports = {
    getNotifications,
    markNotificationAsRead,
    getUnreadCount
};