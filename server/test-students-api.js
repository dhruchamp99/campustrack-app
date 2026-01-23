// Test script to check if students API is working
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

async function testStudentsAPI() {
    try {
        console.log('Testing Students API...');
        console.log('API URL:', `${API_BASE_URL}/api/admin/students`);
        console.log('');

        // First, login as admin to get token
        console.log('1. Logging in as admin...');
        const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
            email: 'admin@campustrack.com',
            password: 'admin123'
        });

        const token = loginResponse.data.token;
        console.log('✅ Login successful!');
        console.log('Token:', token.substring(0, 20) + '...');
        console.log('');

        // Now fetch students
        console.log('2. Fetching students...');
        const studentsResponse = await axios.get(`${API_BASE_URL}/api/admin/students`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('✅ Students fetched successfully!');
        console.log('Total students:', studentsResponse.data.length);
        console.log('');
        console.log('Sample students (first 5):');
        studentsResponse.data.slice(0, 5).forEach((student, index) => {
            console.log(`  ${index + 1}. ${student.enrollmentNumber} - ${student.name} (${student.department}, Sem ${student.semester})`);
        });
        console.log('');
        console.log('═══════════════════════════════════════');
        console.log('✅ API is working correctly!');
        console.log('═══════════════════════════════════════');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        console.log('');
        console.log('Possible issues:');
        console.log('1. Backend server not running (run: npm run dev in server folder)');
        console.log('2. Wrong API URL (check if server is on port 5000)');
        console.log('3. Admin credentials incorrect');
    }
}

testStudentsAPI();
