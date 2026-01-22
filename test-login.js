const axios = require('axios');

async function testLogin() {
    try {
        console.log('Testing login API...');
        console.log('URL: https://campustrack-app-2.onrender.com/api/auth/login');

        const response = await axios.post('https://campustrack-app-2.onrender.com/api/auth/login', {
            email: 'dhru@campus.com',
            password: 'admin123',
            role: 'admin'
        });

        console.log('✅ Login successful!');
        console.log('Response:', response.data);
    } catch (error) {
        console.log('❌ Login failed!');
        console.log('Status:', error.response?.status);
        console.log('Error:', error.response?.data);
        console.log('Full error:', error.message);
    }
}

testLogin();
