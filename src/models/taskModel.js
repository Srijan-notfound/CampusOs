const pool = require("../config/db");

const createTask = async (
    userId,
    title,
    description,
    priority,
    dueDate
) => {
    const result = await pool.query(
        `INSERT INTO tasks
        (user_id, title, description, priority, due_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [userId, title, description, priority, dueDate]
    );

    return result.rows[0];
};

const getTasksByUser = async (userId) => {
    const result = await pool.query(
        `SELECT *
         FROM tasks
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
    );

    return result.rows;
};

const getTaskById = async (taskId, userId) => {
    const result = await pool.query(
        `SELECT *
         FROM tasks
         WHERE id = $1 AND user_id = $2`,
        [taskId, userId]
    );

    return result.rows[0];
};

const updateTask = async (
    taskId,
    userId,
    title,
    description,
    priority,
    status,
    dueDate
) => {
    const result = await pool.query(
        `UPDATE tasks
         SET title = $1,
             description = $2,
             priority = $3,
             status = $4,
             due_date = $5,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $6 AND user_id = $7
         RETURNING *`,
        [
            title,
            description,
            priority,
            status,
            dueDate,
            taskId,
            userId
        ]
    );

    return result.rows[0];
};

const deleteTask = async (taskId, userId) => {
    const result = await pool.query(
        `DELETE FROM tasks
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [taskId, userId]
    );

    return result.rows[0];
};

module.exports = {
    createTask,
    getTasksByUser,
    getTaskById,
    updateTask,
    deleteTask
};