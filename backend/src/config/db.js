// src/config/db.js
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

export const connectDB = async () => {
    try {
        await pool.connect();
        console.log('Database connected successfully');
    } catch (err) {
        console.error('Database connection error:', err);
        throw err;
    }
};

export default pool;