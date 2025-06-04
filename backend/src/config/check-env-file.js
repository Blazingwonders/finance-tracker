// check-env-file.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== Environment File Checker ===');
console.log('Current directory:', process.cwd());
console.log('Script directory:', __dirname);

// Check common .env file locations
const possibleEnvPaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '.env'),
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '../../.env'),
];

console.log('\n=== Checking .env file locations ===');
possibleEnvPaths.forEach((envPath, index) => {
    console.log(`${index + 1}. ${envPath}`);
    if (fs.existsSync(envPath)) {
        console.log('   ✅ EXISTS');
        try {
            const content = fs.readFileSync(envPath, 'utf8');
            const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
            console.log('   📄 Content preview:');
            lines.forEach(line => {
                if (line.includes('PASSWORD')) {
                    const [key, ...rest] = line.split('=');
                    console.log(`      ${key}=***`);
                } else {
                    console.log(`      ${line}`);
                }
            });
        } catch (error) {
            console.log('   ❌ Error reading file:', error.message);
        }
    } else {
        console.log('   ❌ NOT FOUND');
    }
    console.log('');
});

// Check if environment variables are currently loaded
console.log('=== Current Environment Variables ===');
const dbVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
dbVars.forEach(varName => {
    const value = process.env[varName];
    if (varName.includes('PASSWORD')) {
        console.log(`${varName}:`, value ? '***' : 'undefined');
    } else {
        console.log(`${varName}:`, value || 'undefined');
    }
});