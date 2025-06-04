// comprehensive-test.js
import { connectDB, testDirectConnection } from './db.js';

async function runAllTests() {
    console.log('🧪 Starting comprehensive database connection tests...\n');
    
    // Test 1: Direct connection
    console.log('Test 1: Direct Client Connection');
    const directConnectionSuccess = await testDirectConnection();
    
    if (directConnectionSuccess) {
        console.log('✅ Direct connection works - issue might be with Pool configuration\n');
    } else {
        console.log('❌ Direct connection failed - check credentials/server\n');
    }
    
    // Test 2: Pool connection
    console.log('Test 2: Pool Connection');
    try {
        const pool = await connectDB();
        console.log('✅ Pool connection successful\n');
    } catch (error) {
        console.log('❌ Pool connection failed:', error.message, '\n');
    }
    
    console.log('🏁 All tests completed');
    process.exit(0);
}

runAllTests();