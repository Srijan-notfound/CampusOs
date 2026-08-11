const pool = require("../config/db");

const createNotification = async (userId, message, type = "TASK") => {
    const result = await pool.query(
        `INSERT INTO notifications
        (user_id, message, type)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [userId, message, type]
    );

    return result.rows[0];
};

const getNotifications = async (userId) => {
    const result = await pool.query(
        `SELECT *
         FROM notifications
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
    );

    return result.rows;
};
const markAsRead = async (notificationId, userId) => {
    const result = await pool.query(
        `UPDATE notifications
         SET is_read = TRUE
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [notificationId, userId]
    );

    return result.rows[0];
};const getUnreadCount = async (userId) => {
    const result = await pool.query(
        `SELECT COUNT(*)::int AS count
         FROM notifications
         WHERE user_id = $1 AND is_read = FALSE`,
        [userId]
    );

    return result.rows[0].count;
};
module.exports = {
    createNotification,
    getNotifications,
    markAsRead,
    getUnreadCount
};