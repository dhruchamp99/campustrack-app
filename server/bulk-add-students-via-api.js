const https = require('https');

const API_BASE_URL = 'campustrack-app-2.onrender.com';

// All 78 CS students
const csStudents = [
    { enrollmentNumber: '241120107001', name: 'Abhinav Mishra' },
    { enrollmentNumber: '241120107002', name: 'Upadhyay Adarsh Vishnu' },
    { enrollmentNumber: '241120107003', name: 'Adenwala Akshita Viralkumar' },
    { enrollmentNumber: '241120107004', name: 'Sheta Akshita Jiteshbhai' },
    { enrollmentNumber: '241120107005', name: 'Ansari Asif Aftab' },
    { enrollmentNumber: '241120107006', name: 'Atul Soni' },
    { enrollmentNumber: '241120107007', name: 'Mayur Raju Baidagar' },
    { enrollmentNumber: '241120107008', name: 'Dhanani Muskan Lakhendra' },
    { enrollmentNumber: '241120107009', name: 'Marathe Bhushan Madhav' },
    { enrollmentNumber: '241120107010', name: 'Bhutiya Milan Kachrabhai' },
    { enrollmentNumber: '241120107011', name: 'Bind Kartik Kanhiyalal' },
    { enrollmentNumber: '241120107012', name: 'Desai Krishna Niteshbhai' },
    { enrollmentNumber: '241120107013', name: 'Desai Mansi Vijaybhai' },
    { enrollmentNumber: '241120107014', name: 'Dunarani Rudra Manakbhai' },
    { enrollmentNumber: '241120107015', name: 'Eigeti Dhru Naresh' },
    { enrollmentNumber: '241120107016', name: 'Gajera Dhruvik Rajeshbhai' },
    { enrollmentNumber: '241120107017', name: 'Gupta Dharmesh Kamleshchandra' },
    { enrollmentNumber: '241120107018', name: 'Issa Priyanshu Mansoori' },
    { enrollmentNumber: '241120107019', name: 'Jain Jash Jitendrabhai' },
    { enrollmentNumber: '241120107020', name: 'Jambaliya Vansh Vallabhbhai' },
    { enrollmentNumber: '241120107021', name: 'Patel Jayesh Gulab' },
    { enrollmentNumber: '241120107022', name: 'Jha Gautam Ravindra' },
    { enrollmentNumber: '241120107023', name: 'Kakadiya Jiya' },
    { enrollmentNumber: '241120107024', name: 'Kanajaria Zeel Jayeshbhai' },
    { enrollmentNumber: '241120107025', name: 'Katkar Ishita Pareshbhai' },
    { enrollmentNumber: '241120107026', name: 'Kavaiya Dhry Vipulkumar' },
    { enrollmentNumber: '241120107027', name: 'Khatik Rahul Motilal' },
    { enrollmentNumber: '241120107028', name: 'Kheni Honey Umeshbhai' },
    { enrollmentNumber: '241120107029', name: 'Kotak Mahek Vipulbhai' },
    { enrollmentNumber: '241120107030', name: 'Korat Kishoben Manishbhai' },
    { enrollmentNumber: '241120107031', name: 'Aabori Kishn Nareshbhai' },
    { enrollmentNumber: '241120107032', name: 'Lashiya Het Ashokbhai' },
    { enrollmentNumber: '241120107033', name: 'Mahapatra Arun Prakash' },
    { enrollmentNumber: '241120107034', name: 'Mahto Amit Ajay' },
    { enrollmentNumber: '241120107035', name: 'Maji Harish Mahendrabhai' },
    { enrollmentNumber: '241120107036', name: 'Navadiya Prince Vinodbhai' },
    { enrollmentNumber: '241120107037', name: 'Maniya Nutan Niteshbhai' },
    { enrollmentNumber: '241120107038', name: 'Pandey Ayush Parashumani' },
    { enrollmentNumber: '241120107039', name: 'Pandey Pankaj Vijay' },
    { enrollmentNumber: '241120107040', name: 'Parshottya Yashvibhai Kiritbhai' },
    { enrollmentNumber: '241120107041', name: 'Parthik Vinubhai Tavethiya' },
    { enrollmentNumber: '241120107042', name: 'Patel Parth Jitubhai' },
    { enrollmentNumber: '241120107043', name: 'Patel Fancy Bipeshbhai' },
    { enrollmentNumber: '241120107044', name: 'Patel Krish Kirtikumar' },
    { enrollmentNumber: '241120107045', name: 'Patel Mincokumar Nitinbhai' },
    { enrollmentNumber: '241120107046', name: 'Patel Nila Vaman' },
    { enrollmentNumber: '241120107047', name: 'Pati Yash Haribhai' },
    { enrollmentNumber: '241120107048', name: 'Panvar Dev Rajubhai' },
    { enrollmentNumber: '241120107049', name: 'Pethani Harshil Vipulbhai' },
    { enrollmentNumber: '241120107050', name: 'Pithva Dhara Rajeshbhai' },
    { enrollmentNumber: '241120107051', name: 'Prince Sanjay Gupta' },
    { enrollmentNumber: '241120107052', name: 'Prince Rajput' },
    { enrollmentNumber: '241120107053', name: 'Sailuhadare Priyal Maheshbhai' },
    { enrollmentNumber: '241120107054', name: 'Raghavani Shivamkumar Rajeshbhai' },
    { enrollmentNumber: '241120107055', name: 'Rajpurohit Rajveer Yogendra Kumar Singh' },
    { enrollmentNumber: '241120107056', name: 'Rajput Khushi Rahveersingh' },
    { enrollmentNumber: '241120107057', name: 'Rana Ayush Himeshkumar' },
    { enrollmentNumber: '241120107058', name: 'Hana Isha Hineshkumar' },
    { enrollmentNumber: '241120107059', name: 'Sarasiya Kridha Yogeshbhai' },
    { enrollmentNumber: '241120107060', name: 'Savaliya Jeel Bhaveshbhai' },
    { enrollmentNumber: '241120107061', name: 'Zalavaditya Shrey Nareshbhai' },
    { enrollmentNumber: '241120107062', name: 'Solanki Chetanbhai Lalitbhai' },
    { enrollmentNumber: '241120107063', name: 'Thummar Lakshliben Pareshbhai' },
    { enrollmentNumber: '241120107064', name: 'Varmar Urmi Shaileshbhai' },
    { enrollmentNumber: '241120107065', name: 'Vadodoriya Koen Vijaybhai' },
    { enrollmentNumber: '241120107066', name: 'Vaghasiya Yash Babubhai' },
    { enrollmentNumber: '241120107067', name: 'Yadav Laluprasad Haridraprasad' },
    { enrollmentNumber: '241120107068', name: 'Yash Patel' },
    { enrollmentNumber: '241120107069', name: 'Yogesh Ravindra Sonawane' },
    { enrollmentNumber: '241120107070', name: 'Dharmiliya Vighnahar Sanjaybhai' },
    { enrollmentNumber: '241120107071', name: 'Zalavadiya Pankit Maheshbhai' },
    { enrollmentNumber: '251123107001', name: 'Andabale Harishvardhan Atulbhai' },
    { enrollmentNumber: '251123107002', name: 'Kathiriya Meet Pravinkumar' },
    { enrollmentNumber: '251123107003', name: 'Kotle Pankear Digambar' },
    { enrollmentNumber: '251123107005', name: 'Parmar Maitry Arvindbhai' },
    { enrollmentNumber: '251123107006', name: 'Patil Harshita Gyaneshwar' },
    { enrollmentNumber: '251123107007', name: 'Vartak Swikup' },
    { enrollmentNumber: '251123107008', name: 'Vekariya Maisum Ashokkhai' }
];

function makeRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => { responseData += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: responseData });
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function bulkAddStudents() {
    console.log('🚀 Bulk Adding 78 Students via Admin API...');
    console.log('');

    // Step 1: Login as admin
    console.log('Step 1: Logging in as admin...');
    const loginData = JSON.stringify({
        email: 'admin@campustrack.com',
        password: 'admin123'
    });

    const loginResponse = await makeRequest({
        hostname: API_BASE_URL,
        port: 443,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': loginData.length
        }
    }, loginData);

    if (loginResponse.status !== 200) {
        console.error('❌ Login failed:', loginResponse.data);
        return;
    }

    const token = loginResponse.data.token;
    console.log('✅ Login successful!');
    console.log('');

    // Step 2: Add each student
    console.log('Step 2: Adding students...');
    console.log('');

    let addedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < csStudents.length; i++) {
        const student = csStudents[i];
        const studentData = JSON.stringify({
            name: student.name,
            enrollmentNumber: student.enrollmentNumber,
            password: '123',
            department: 'Computer Science',
            semester: 4
        });

        try {
            const response = await makeRequest({
                hostname: API_BASE_URL,
                port: 443,
                path: '/api/admin/students',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': studentData.length,
                    'Authorization': `Bearer ${token}`
                }
            }, studentData);

            if (response.status === 201) {
                console.log(`✅ ${i + 1}/78: Added ${student.enrollmentNumber} - ${student.name}`);
                addedCount++;
            } else if (response.status === 400 && response.data.message && response.data.message.includes('already exists')) {
                console.log(`⏭️  ${i + 1}/78: Skipped ${student.enrollmentNumber} (already exists)`);
                skippedCount++;
            } else {
                console.log(`❌ ${i + 1}/78: Error adding ${student.enrollmentNumber}: ${response.data.message || response.data}`);
                errorCount++;
            }
        } catch (error) {
            console.log(`❌ ${i + 1}/78: Network error for ${student.enrollmentNumber}: ${error.message}`);
            errorCount++;
        }

        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('🎉 BULK IMPORT COMPLETED!');
    console.log('═══════════════════════════════════════');
    console.log(`✅ Students Added: ${addedCount}`);
    console.log(`⏭️  Students Skipped (already exist): ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📊 Total Processed: ${csStudents.length}`);
    console.log('');
    console.log('🎯 Next Step: Test teacher dashboard!');
    console.log('   1. Login as teacher: d@gmail.com / teacher123');
    console.log('   2. Go to Mark Attendance');
    console.log('   3. Select a subject');
    console.log('   4. Click Fetch Students');
    console.log('   5. Should see all students! 🎉');
    console.log('═══════════════════════════════════════');
}

bulkAddStudents().catch(err => {
    console.error('Fatal error:', err);
});
