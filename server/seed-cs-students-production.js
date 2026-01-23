const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB Atlas connection (PRODUCTION)
const MONGO_URI = 'mongodb+srv://campustrack:dhrutrack123@campustrack.qxnptp5.mongodb.net/campustrack?retryWrites=true&w=majority&appName=campustrack';

// User schema (simplified)
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    enrollmentNumber: String,
    password: String,
    role: String,
    department: String,
    semester: Number
});

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

// Computer Science Students Data
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

async function seedProductionDatabase() {
    try {
        console.log('🌐 Connecting to MongoDB Atlas (PRODUCTION)...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas');
        console.log('');

        let addedCount = 0;
        let updatedCount = 0;

        // Add all CS students
        for (const studentData of csStudents) {
            const existing = await User.findOne({
                enrollmentNumber: studentData.enrollmentNumber
            });

            if (existing) {
                // Update existing student
                existing.name = studentData.name;
                existing.department = 'Computer Science';
                existing.semester = 4;
                existing.password = '123'; // Will be hashed by pre-save hook
                existing.role = 'student';
                await existing.save();
                console.log(`🔄 Updated: ${studentData.enrollmentNumber} - ${studentData.name}`);
                updatedCount++;
            } else {
                // Create new student
                const student = new User({
                    name: studentData.name,
                    enrollmentNumber: studentData.enrollmentNumber,
                    password: '123',
                    role: 'student',
                    department: 'Computer Science',
                    semester: 4
                });
                await student.save();
                console.log(`✅ Added: ${studentData.enrollmentNumber} - ${studentData.name}`);
                addedCount++;
            }
        }

        console.log('');
        console.log('═══════════════════════════════════════');
        console.log('🎉 PRODUCTION DATABASE SEEDING COMPLETED!');
        console.log('═══════════════════════════════════════');
        console.log(`✅ Students Added: ${addedCount}`);
        console.log(`🔄 Students Updated: ${updatedCount}`);
        console.log(`📊 Total Processed: ${csStudents.length}`);
        console.log('');
        console.log('Student Details:');
        console.log('- Department: Computer Science');
        console.log('- Semester: 4');
        console.log('- Password: 123 (for all students)');
        console.log('');
        console.log('🌐 Database: MongoDB Atlas (PRODUCTION)');
        console.log('🚀 Backend: https://campustrack-app-2.onrender.com');
        console.log('🎨 Frontend: https://campustrack-app-4b232.web.app');
        console.log('═══════════════════════════════════════');

        await mongoose.connection.close();
        console.log('');
        console.log('✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

seedProductionDatabase();
