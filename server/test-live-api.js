// Test the live Render API to see what's happening
const https = require('https');

const API_BASE_URL = 'https://campustrack-app-2.onrender.com';

async function testLiveAPI() {
    console.log('🌐 Testing Live Render API...');
    console.log('');

    // Step 1: Login as teacher
    console.log('Step 1: Logging in as teacher...');
    const loginData = JSON.stringify({
        email: 'd@gmail.com',
        password: 'teacher123'
    });

    const loginOptions = {
        hostname: 'campustrack-app-2.onrender.com',
        port: 443,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': loginData.length
        }
    };

    return new Promise((resolve, reject) => {
        const loginReq = https.request(loginOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (res.statusCode === 200) {
                        console.log('✅ Login successful!');
                        console.log('   Teacher:', response.name);
                        console.log('   Email:', response.email);
                        console.log('   Token:', response.token.substring(0, 20) + '...');
                        console.log('');

                        // Step 2: Get teacher's subjects
                        console.log('Step 2: Fetching teacher subjects...');
                        const subjectsOptions = {
                            hostname: 'campustrack-app-2.onrender.com',
                            port: 443,
                            path: '/api/teacher/subjects',
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${response.token}`
                            }
                        };

                        const subjectsReq = https.request(subjectsOptions, (subRes) => {
                            let subData = '';
                            subRes.on('data', (chunk) => { subData += chunk; });
                            subRes.on('end', () => {
                                try {
                                    const subjects = JSON.parse(subData);
                                    console.log(`✅ Found ${subjects.length} subjects assigned to teacher`);
                                    console.log('');

                                    if (subjects.length === 0) {
                                        console.log('❌ PROBLEM: No subjects assigned to this teacher!');
                                        console.log('   Solution: Login as admin and assign subjects to teacher');
                                        resolve();
                                        return;
                                    }

                                    subjects.forEach((sub, index) => {
                                        console.log(`   ${index + 1}. ${sub.subjectName} (${sub.subjectCode})`);
                                        console.log(`      Department: ${sub.department}`);
                                        console.log(`      Semester: ${sub.semester}`);
                                        console.log(`      ID: ${sub._id}`);
                                        console.log('');
                                    });

                                    // Step 3: Fetch students for first subject
                                    const firstSubject = subjects[0];
                                    console.log(`Step 3: Fetching students for "${firstSubject.subjectName}"...`);
                                    console.log('');

                                    const studentsOptions = {
                                        hostname: 'campustrack-app-2.onrender.com',
                                        port: 443,
                                        path: `/api/teacher/students/${firstSubject._id}`,
                                        method: 'GET',
                                        headers: {
                                            'Authorization': `Bearer ${response.token}`
                                        }
                                    };

                                    const studentsReq = https.request(studentsOptions, (stuRes) => {
                                        let stuData = '';
                                        stuRes.on('data', (chunk) => { stuData += chunk; });
                                        stuRes.on('end', () => {
                                            try {
                                                const students = JSON.parse(stuData);
                                                if (stuRes.statusCode === 200) {
                                                    console.log(`✅ SUCCESS! Found ${students.length} students`);
                                                    console.log('');
                                                    console.log('Sample students:');
                                                    students.slice(0, 5).forEach((stu, i) => {
                                                        console.log(`   ${i + 1}. ${stu.enrollmentNumber} - ${stu.name}`);
                                                    });
                                                    console.log('');
                                                    console.log('═══════════════════════════════════════');
                                                    console.log('✅ API IS WORKING CORRECTLY!');
                                                    console.log('═══════════════════════════════════════');
                                                } else {
                                                    console.log(`❌ ERROR: Status ${stuRes.statusCode}`);
                                                    console.log('Response:', stuData);
                                                }
                                                resolve();
                                            } catch (e) {
                                                console.error('❌ Error parsing students response:', e.message);
                                                console.log('Raw response:', stuData);
                                                resolve();
                                            }
                                        });
                                    });

                                    studentsReq.on('error', (e) => {
                                        console.error('❌ Error fetching students:', e.message);
                                        resolve();
                                    });

                                    studentsReq.end();

                                } catch (e) {
                                    console.error('❌ Error parsing subjects response:', e.message);
                                    console.log('Raw response:', subData);
                                    resolve();
                                }
                            });
                        });

                        subjectsReq.on('error', (e) => {
                            console.error('❌ Error fetching subjects:', e.message);
                            resolve();
                        });

                        subjectsReq.end();

                    } else {
                        console.log(`❌ Login failed: Status ${res.statusCode}`);
                        console.log('Response:', data);
                        resolve();
                    }
                } catch (e) {
                    console.error('❌ Error parsing login response:', e.message);
                    console.log('Raw response:', data);
                    resolve();
                }
            });
        });

        loginReq.on('error', (e) => {
            console.error('❌ Error during login:', e.message);
            reject(e);
        });

        loginReq.write(loginData);
        loginReq.end();
    });
}

testLiveAPI().then(() => {
    console.log('');
    console.log('Test complete!');
}).catch(err => {
    console.error('Test failed:', err);
});
