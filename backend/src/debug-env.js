// debug-env.js
import dotenv from 'dotenv';

dotenv.config();

console.log('=== Environment Variables Debug ===');
console.log('DB_HOST:', process.env.DB_HOST, '(type:', typeof process.env.DB_HOST, ')');
console.log('DB_PORT:', process.env.DB_PORT, '(type:', typeof process.env.DB_PORT, ')');
console.log('DB_NAME:', process.env.DB_NAME, '(type:', typeof process.env.DB_NAME, ')');
console.log('DB_USER:', process.env.DB_USER, '(type:', typeof process.env.DB_USER, ')');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD, '(type:', typeof process.env.DB_PASSWORD, ')');
console.log('DB_PASSWORD length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 'undefined');
console.log('DB_PASSWORD is undefined:', process.env.DB_PASSWORD === undefined);
console.log('DB_PASSWORD is null:', process.env.DB_PASSWORD === null);
console.log('DB_PASSWORD stringified:', JSON.stringify(process.env.DB_PASSWORD));

// Test the String() conversion
if (process.env.DB_PASSWORD !== undefined) {
    console.log('String(DB_PASSWORD):', String(process.env.DB_PASSWORD));
    console.log('String(DB_PASSWORD) type:', typeof String(process.env.DB_PASSWORD));
}