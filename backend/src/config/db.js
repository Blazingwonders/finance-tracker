// src/config/db.js

/*
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
*/

import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the correct path
// Go up from src/config to backend root
const envPath = path.resolve(__dirname, '../../.env');
console.log('Loading .env from:', envPath);

const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('Error loading .env file:', result.error);
    // Try alternative paths
    const alternativePaths = [
        path.resolve(process.cwd(), '.env'),
        path.resolve(__dirname, '../../../.env'),
    ];
    
    let loaded = false;
    for (const altPath of alternativePaths) {
        console.log('Trying alternative path:', altPath);
        const altResult = dotenv.config({ path: altPath });
        if (!altResult.error) {
            console.log('✅ Loaded .env from:', altPath);
            loaded = true;
            break;
        }
    }
    
    if (!loaded) {
        console.error('❌ Could not load .env file from any location');
    }
} else {
    console.log('✅ Successfully loaded .env file');
}

const { Pool } = pkg;

// Debug environment variables after loading
console.log('=== Environment Variables After Loading ===');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD defined:', !!process.env.DB_PASSWORD);
console.log('DB_PASSWORD type:', typeof process.env.DB_PASSWORD);

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    console.error('Please check your .env file');
    process.exit(1);
}

// Create configuration object with proper validation
const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: false,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
};

// Debug the final config (hide password)
console.log('=== Final Database Configuration ===');
console.log('Config object:', {
    ...dbConfig,
    password: dbConfig.password ? dbConfig.password.substring(0, 2) + '***' : 'undefined'
});

const pool = new Pool(dbConfig);

export const connectDB = async () => {
    try {
        console.log('Attempting database connection...');
        const client = await pool.connect();
        console.log('✅ Database connected successfully');
        
        // Test query
        const result = await client.query('SELECT version()');
        console.log('Database version:', result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]);
        
        client.release();
        return pool;
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        console.error('Error code:', error.code);
        throw error;
    }
};

export const testDirectConnection = async () => {
    const { Client } = pkg;
    
    const client = new Client(dbConfig);

    try {
        console.log('Testing direct client connection...');
        await client.connect();
        const result = await client.query('SELECT 1 as test');
        console.log('✅ Direct connection successful, test result:', result.rows[0]);
        await client.end();
        return true;
    } catch (error) {
        console.error('❌ Direct connection failed:', error.message);
        try {
            await client.end();
        } catch (endError) {
            // Ignore errors when ending connection
        }
        return false;
    }
};

export default pool;