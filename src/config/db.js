const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const testConnection = async () => {
    try {
        await pool.query("SELECT NOW()");
        console.log("PostgreSQL connected successfully");
    } catch (error) {
        console.error("PostgreSQL connection failed:", error.message);
    }
};

testConnection();

module.exports = pool;