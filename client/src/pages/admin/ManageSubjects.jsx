import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import axios from 'axios';
import { Plus, Trash2, Search, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import API_BASE_URL from '../../config/apiConfig';

const ManageSubjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        subjectName: '',
        subjectCode: '',
        teacherId: '',
        department: '',
        semester: ''
    });

    useEffect(() => {
        fetchSubjects();
        fetchTeachers();
    }, []);

    const fetchSubjects = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/subjects`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSubjects(res.data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const fetchTeachers = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/teachers`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTeachers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddSubject = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/api/admin/subjects`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Subject added successfully!');
            setShowAddForm(false);
            setFormData({ subjectName: '', subjectCode: '', teacherId: '', department: '', semester: '' });
            fetchSubjects();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add subject');
        }
    };

    const filteredSubjects = subjects.filter(s =>
        s.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <BookOpen className="w-8 h-8 text-primary" />
                            Manage Subjects
                        </h2>
                        <p className="text-muted-foreground mt-1">Add, view, and manage course subjects</p>
                    </div>
                    <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add New Subject
                    </Button>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by subject name, code, or department..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="border-primary/50 shadow-lg">
                            <CardHeader>
                                <CardTitle>Add New Subject</CardTitle>
                                <CardDescription>Fill in the details to create a new subject</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddSubject} className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="subjectName">Subject Name *</Label>
                                        <Input
                                            id="subjectName"
                                            required
                                            value={formData.subjectName}
                                            onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subjectCode">Subject Code *</Label>
                                        <Input
                                            id="subjectCode"
                                            required
                                            value={formData.subjectCode}
                                            onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="teacher">Assign Teacher *</Label>
                                        <select
                                            id="teacher"
                                            required
                                            value={formData.teacherId}
                                            onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        >
                                            <option value="">-- Select Teacher --</option>
                                            {teachers.map(t => (
                                                <option key={t._id} value={t._id}>{t.name} ({t.email})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="department">Department *</Label>
                                        <Input
                                            id="department"
                                            required
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="semester">Semester *</Label>
                                        <Input
                                            id="semester"
                                            required
                                            value={formData.semester}
                                            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex gap-3 justify-end">
                                        <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit">Add Subject</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>All Subjects ({filteredSubjects.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">Subject Code</th>
                                        <th className="px-4 py-3 text-left font-medium">Subject Name</th>
                                        <th className="px-4 py-3 text-left font-medium">Teacher</th>
                                        <th className="px-4 py-3 text-left font-medium">Department</th>
                                        <th className="px-4 py-3 text-left font-medium">Semester</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {loading ? (
                                        <tr><td colSpan="5" className="p-8 text-center">Loading...</td></tr>
                                    ) : filteredSubjects.length === 0 ? (
                                        <tr><td colSpan="5" className="p-8 text-center text-muted-foreground">No subjects found</td></tr>
                                    ) : (
                                        filteredSubjects.map((subject) => (
                                            <tr key={subject._id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3 font-mono text-xs font-bold">{subject.subjectCode}</td>
                                                <td className="px-4 py-3 font-medium">{subject.subjectName}</td>
                                                <td className="px-4 py-3">{subject.teacherId?.name || 'Not Assigned'}</td>
                                                <td className="px-4 py-3">{subject.department}</td>
                                                <td className="px-4 py-3">{subject.semester}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default ManageSubjects;
