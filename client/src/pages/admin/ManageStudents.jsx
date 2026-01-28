import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import axios from 'axios';
import { Plus, Trash2, Search, GraduationCap, Upload, FileSpreadsheet, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import API_BASE_URL from '../../config/apiConfig';
import * as XLSX from 'xlsx';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [showImportModal, setShowImportModal] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        enrollmentNumber: '',
        password: '',
        department: '',
        semester: ''
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/students`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setStudents(res.data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        console.log('Submitting student data:', formData);

        try {
            const response = await axios.post(`${API_BASE_URL}/api/admin/students`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            console.log('Student created:', response.data);
            toast.success(`✅ Student ${formData.name} added successfully!`);
            setShowAddForm(false);
            setFormData({ name: '', email: '', enrollmentNumber: '', password: '', department: '', semester: '' });
            fetchStudents();
        } catch (error) {
            console.error('Error creating student:', error);
            console.error('Error response:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to add student');
        }
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setFormData({
            name: student.name,
            email: student.email || '',
            enrollmentNumber: student.enrollmentNumber,
            password: '', // Don't show existing password
            department: student.department,
            semester: student.semester
        });
        setShowAddForm(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        console.log('Updating student:', editingStudent._id, formData);

        try {
            // Only send password if it was changed
            const updateData = { ...formData };
            if (!updateData.password) {
                delete updateData.password;
            }

            const response = await axios.put(
                `${API_BASE_URL}/api/admin/users/${editingStudent._id}`,
                updateData,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            console.log('Student updated:', response.data);
            toast.success(`✅ Student ${formData.name} updated successfully!`);
            setShowAddForm(false);
            setEditingStudent(null);
            setFormData({ name: '', email: '', enrollmentNumber: '', password: '', department: '', semester: '' });
            fetchStudents();
        } catch (error) {
            console.error('Error updating student:', error);
            toast.error(error.response?.data?.message || 'Failed to update student');
        }
    };

    const handleCancelEdit = () => {
        setShowAddForm(false);
        setEditingStudent(null);
        setFormData({ name: '', email: '', enrollmentNumber: '', password: '', department: '', semester: '' });
    };

    const handleDelete = async (student) => {
        // Show confirmation toast
        toast((t) => (
            <div className="flex flex-col gap-3">
                <div>
                    <p className="font-semibold">Delete Student?</p>
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete {student.name}? This action cannot be undone.
                    </p>
                </div>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await axios.delete(`${API_BASE_URL}/api/admin/users/${student._id}`, {
                                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                                });
                                toast.success(`${student.name} deleted successfully!`);
                                fetchStudents();
                            } catch (error) {
                                toast.error('Failed to delete student');
                            }
                        }}
                        className="px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), {
            duration: 10000,
            position: 'top-center',
        });
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
                toast.error('Please select a valid Excel file (.xlsx or .xls)');
                return;
            }
            setImportFile(file);
        }
    };

    const handleImportExcel = async () => {
        if (!importFile) {
            toast.error('Please select a file first');
            return;
        }

        setImporting(true);
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                if (jsonData.length === 0) {
                    toast.error('The Excel file is empty');
                    setImporting(false);
                    return;
                }

                // Map Excel columns to our format
                const students = jsonData.map(row => ({
                    name: row.Name || row.name || '',
                    enrollmentNumber: String(row['Enrollment Number'] || row.enrollmentNumber || row.enrollment || ''),
                    email: row.Email || row.email || '',
                    department: row.Department || row.department || row.Branch || row.branch || '',
                    semester: String(row.Semester || row.semester || row.Sem || row.sem || ''),
                    password: row.Password || row.password || ''
                }));

                console.log('Parsed students:', students);

                // Send to backend
                const response = await axios.post(
                    `${API_BASE_URL}/api/admin/students/import`,
                    { students },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );

                const { summary, results } = response.data;

                // Show detailed results
                if (summary.success > 0) {
                    toast.success(
                        `✅ Successfully imported ${summary.success} student(s)!`,
                        { duration: 5000 }
                    );
                }

                if (summary.skipped > 0) {
                    toast(
                        `⚠️ Skipped ${summary.skipped} student(s) (already exist)`,
                        { duration: 5000, icon: '⚠️' }
                    );
                }

                if (summary.failed > 0) {
                    toast.error(
                        `❌ Failed to import ${summary.failed} student(s). Check console for details.`,
                        { duration: 5000 }
                    );
                    console.error('Failed imports:', results.failed);
                }

                // Close modal and refresh
                setShowImportModal(false);
                setImportFile(null);
                fetchStudents();
            } catch (error) {
                console.error('Import error:', error);
                toast.error(error.response?.data?.message || 'Failed to import students');
            } finally {
                setImporting(false);
            }
        };

        reader.readAsArrayBuffer(importFile);
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.enrollmentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <Toaster position="top-right" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <GraduationCap className="w-8 h-8 text-primary" />
                            Manage Students
                        </h2>
                        <p className="text-muted-foreground mt-1">Add, view, and manage student records</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            onClick={() => setShowImportModal(true)}
                            variant="outline"
                            className="gap-2"
                        >
                            <Upload className="w-4 h-4" />
                            Import Students
                        </Button>
                        <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add New Student
                        </Button>
                    </div>
                </div>

                {/* Search Bar */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, enrollment number, or department..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Add Student Form */}
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="border-primary/50 shadow-lg">
                            <CardHeader>
                                <CardTitle>{editingStudent ? 'Edit Student' : 'Add New Student'}</CardTitle>
                                <CardDescription>
                                    {editingStudent ? 'Update student information' : 'Fill in the details to create a new student account'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={editingStudent ? handleUpdate : handleAddStudent} className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="enrollment">Enrollment Number *</Label>
                                        <Input
                                            id="enrollment"
                                            required
                                            value={formData.enrollmentNumber}
                                            onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">
                                            Password {editingStudent ? '(leave blank to keep current)' : '*'}
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required={!editingStudent}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder={editingStudent ? 'Leave blank to keep current password' : ''}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="department">Department *</Label>
                                        <select
                                            id="department"
                                            required
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        >
                                            <option value="">-- Select Department --</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Information Technology">Information Technology</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Mechanical">Mechanical</option>
                                            <option value="Civil">Civil</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="semester">Semester *</Label>
                                        <select
                                            id="semester"
                                            required
                                            value={formData.semester}
                                            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        >
                                            <option value="">-- Select Semester --</option>
                                            <option value="1">Semester 1</option>
                                            <option value="2">Semester 2</option>
                                            <option value="3">Semester 3</option>
                                            <option value="4">Semester 4</option>
                                            <option value="5">Semester 5</option>
                                            <option value="6">Semester 6</option>
                                            <option value="7">Semester 7</option>
                                            <option value="8">Semester 8</option>
                                        </select>
                                        <p className="text-xs text-muted-foreground">
                                            💡 Tip: For GTU Sem 4 subjects, select "Computer Science" and "Semester 4"
                                        </p>
                                    </div>
                                    <div className="md:col-span-2 flex gap-3 justify-end">
                                        <Button type="button" variant="outline" onClick={handleCancelEdit}>
                                            Cancel
                                        </Button>
                                        <Button type="submit">
                                            {editingStudent ? 'Update Student' : 'Add Student'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Import Students Modal */}
                {showImportModal && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => !importing && setShowImportModal(false)}
                    >
                        <Card
                            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileSpreadsheet className="w-6 h-6 text-primary" />
                                        <CardTitle>Import Students from Excel</CardTitle>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowImportModal(false)}
                                        disabled={importing}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                                <CardDescription>
                                    Upload an Excel file (.xlsx or .xls) with student information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Instructions */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-900 mb-2">📋 Excel Format Requirements:</h4>
                                    <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
                                        <li><strong>Name</strong> - Student's full name (Required)</li>
                                        <li><strong>Enrollment Number</strong> - Unique enrollment number (Required)</li>
                                        <li><strong>Department</strong> or <strong>Branch</strong> - e.g., Computer Science (Required)</li>
                                        <li><strong>Semester</strong> or <strong>Sem</strong> - e.g., 1, 2, 3... (Required)</li>
                                        <li><strong>Email</strong> - Student email (Optional)</li>
                                        <li><strong>Password</strong> - If not provided, default password "123" will be used (Optional)</li>
                                    </ul>
                                </div>

                                {/* Sample Template */}
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">📝 Sample Excel Template:</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs border-collapse">
                                            <thead>
                                                <tr className="bg-gray-200">
                                                    <th className="border border-gray-300 px-2 py-1">Name</th>
                                                    <th className="border border-gray-300 px-2 py-1">Enrollment Number</th>
                                                    <th className="border border-gray-300 px-2 py-1">Department</th>
                                                    <th className="border border-gray-300 px-2 py-1">Semester</th>
                                                    <th className="border border-gray-300 px-2 py-1">Email</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="border border-gray-300 px-2 py-1">John Doe</td>
                                                    <td className="border border-gray-300 px-2 py-1">2024001</td>
                                                    <td className="border border-gray-300 px-2 py-1">Computer Science</td>
                                                    <td className="border border-gray-300 px-2 py-1">4</td>
                                                    <td className="border border-gray-300 px-2 py-1">john@example.com</td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-gray-300 px-2 py-1">Jane Smith</td>
                                                    <td className="border border-gray-300 px-2 py-1">2024002</td>
                                                    <td className="border border-gray-300 px-2 py-1">Information Technology</td>
                                                    <td className="border border-gray-300 px-2 py-1">4</td>
                                                    <td className="border border-gray-300 px-2 py-1">jane@example.com</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* File Upload */}
                                <div className="space-y-2">
                                    <Label htmlFor="excel-file">Select Excel File</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="excel-file"
                                            type="file"
                                            accept=".xlsx,.xls"
                                            onChange={handleFileSelect}
                                            disabled={importing}
                                            className="flex-1"
                                        />
                                    </div>
                                    {importFile && (
                                        <p className="text-sm text-green-600 flex items-center gap-1">
                                            ✓ Selected: {importFile.name}
                                        </p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 justify-end pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowImportModal(false);
                                            setImportFile(null);
                                        }}
                                        disabled={importing}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleImportExcel}
                                        disabled={!importFile || importing}
                                        className="gap-2"
                                    >
                                        {importing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Importing...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4" />
                                                Import Students
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Students Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Students ({filteredStudents.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-x-auto">
                            <table className="w-full text-sm min-w-[600px]">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">Name</th>
                                        <th className="px-4 py-3 text-left font-medium">Enrollment</th>
                                        <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Department</th>
                                        <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Sem</th>
                                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {loading ? (
                                        <tr><td colSpan="5" className="p-8 text-center">Loading...</td></tr>
                                    ) : filteredStudents.length === 0 ? (
                                        <tr><td colSpan="5" className="p-8 text-center text-muted-foreground">No students found</td></tr>
                                    ) : (
                                        filteredStudents.map((student) => (
                                            <tr key={student._id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3 font-medium">
                                                    {student.name}
                                                    <div className="text-xs text-muted-foreground md:hidden">{student.department}</div>
                                                </td>
                                                <td className="px-4 py-3 font-mono text-xs">{student.enrollmentNumber}</td>
                                                <td className="px-4 py-3 hidden md:table-cell">{student.department}</td>
                                                <td className="px-4 py-3 hidden sm:table-cell">{student.semester}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex gap-2 justify-end">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            onClick={() => handleEdit(student)}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                            </svg>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDelete(student)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table >
                        </div >
                    </CardContent >
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default ManageStudents;
