import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import axios from 'axios';
import { Plus, Trash2, Search, Users, X, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import API_BASE_URL from '../../config/apiConfig';

const ManageTeachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        department: ''
    });

    useEffect(() => {
        fetchTeachers();
        fetchSubjects();
    }, []);

    const fetchTeachers = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/teachers`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTeachers(res.data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const fetchSubjects = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/subjects`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSubjects(res.data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const handleAddTeacher = async (e) => {
        e.preventDefault();
        try {
            // First create the teacher
            const teacherRes = await axios.post(`${API_BASE_URL}/api/admin/teachers`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            const teacherId = teacherRes.data._id;

            // Then assign subjects to the teacher
            if (selectedSubjects.length > 0) {
                await Promise.all(selectedSubjects.map(subjectId =>
                    axios.put(`${API_BASE_URL}/api/admin/subjects/${subjectId}`,
                        { teacherId },
                        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                    )
                ));
            }

            toast.success(`Teacher ${formData.name} added successfully!`);
            setShowAddForm(false);
            setFormData({ name: '', email: '', password: '', department: '' });
            setSelectedSubjects([]);
            fetchTeachers();
            fetchSubjects();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add teacher');
        }
    };

    const handleDelete = async (teacher) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <div>
                    <p className="font-semibold">Delete Teacher?</p>
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete {teacher.name}?
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
                                await axios.delete(`${API_BASE_URL}/api/admin/users/${teacher._id}`, {
                                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                                });
                                toast.success(`${teacher.name} deleted successfully!`);
                                fetchTeachers();
                            } catch (error) {
                                toast.error('Failed to delete teacher');
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



    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Update teacher info (only if password is provided and changed)
            const updateData = { ...formData };
            if (!updateData.password || updateData.password === '********') {
                delete updateData.password;
            }

            await axios.put(
                `${API_BASE_URL}/api/admin/users/${editingTeacher._id}`,
                updateData,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            // Get current teacher subjects
            const currentSubjects = subjects.filter(s => s.teacherId?._id === editingTeacher._id);
            const currentSubjectIds = currentSubjects.map(s => s._id);

            // Unassign removed subjects
            const removedSubjects = currentSubjectIds.filter(id => !selectedSubjects.includes(id));
            await Promise.all(removedSubjects.map(subjectId =>
                axios.put(`${API_BASE_URL}/api/admin/subjects/${subjectId}`,
                    { teacherId: null },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                )
            ));

            // Assign new subjects
            const newSubjects = selectedSubjects.filter(id => !currentSubjectIds.includes(id));
            await Promise.all(newSubjects.map(subjectId =>
                axios.put(`${API_BASE_URL}/api/admin/subjects/${subjectId}`,
                    { teacherId: editingTeacher._id },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                )
            ));

            toast.success(`Teacher ${formData.name} updated successfully!`);
            setShowAddForm(false);
            setEditingTeacher(null);
            setFormData({ name: '', email: '', password: '', department: '' });
            setSelectedSubjects([]);
            fetchTeachers();
            fetchSubjects();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update teacher');
        }
    };

    const handleCancelEdit = () => {
        setShowAddForm(false);
        setEditingTeacher(null);
        setFormData({ name: '', email: '', password: '', department: '' });
        setSelectedSubjects([]);
    };

    const getTeacherSubjects = (teacherId) => {
        return subjects.filter(s => s.teacherId?._id === teacherId);
    };

    // Moved handleEdit closer for context but keep reference intact
    const handleEdit = (teacher) => {
        setEditingTeacher(teacher);
        setFormData({
            name: teacher.name,
            email: teacher.email,
            password: '********', // Show dummy password
            department: teacher.department
        });
        // Get subjects assigned to this teacher
        const teacherSubjectIds = subjects
            .filter(s => s.teacherId?._id === teacher._id)
            .map(s => s._id);
        setSelectedSubjects(teacherSubjectIds);
        setShowAddForm(true);
    };

    const toggleSubject = (subjectId) => {
        setSelectedSubjects(prev =>
            prev.includes(subjectId)
                ? prev.filter(id => id !== subjectId)
                : [...prev, subjectId]
        );
    };

    const filteredTeachers = teachers.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.department.toLowerCase().includes(searchTerm.toLowerCase())
    );



    return (
        <DashboardLayout>
            <Toaster position="top-right" />
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Users className="w-8 h-8 text-primary" />
                            Manage Teachers
                        </h2>
                        <p className="text-muted-foreground mt-1">Add, view, and manage teacher accounts</p>
                    </div>
                    <Button onClick={() => {
                        setEditingTeacher(null);
                        setFormData({ name: '', email: '', password: '', department: '' });
                        setSelectedSubjects([]);
                        setShowAddForm(!showAddForm);
                    }} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add New Teacher
                    </Button>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, or department..."
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
                                <CardTitle>{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</CardTitle>
                                <CardDescription>
                                    {editingTeacher ? 'Update teacher information and reassign subjects' : 'Fill in the details and assign subjects'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={editingTeacher ? handleUpdate : handleAddTeacher} className="space-y-6">
                                    <div className="grid gap-4 md:grid-cols-2">
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
                                            <Label htmlFor="email">Email *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">
                                                Password {editingTeacher ? '(leave blank to keep current)' : '*'}
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                required={!editingTeacher}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                placeholder={editingTeacher ? 'Leave blank to keep current password' : ''}
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
                                    </div>

                                    {/* Subject Selection */}
                                    <div className="space-y-3">
                                        <Label>Assign Subjects (Optional)</Label>
                                        <div className="border rounded-lg p-4 max-h-60 overflow-y-auto bg-muted/30">
                                            {subjects.length === 0 ? (
                                                <p className="text-sm text-muted-foreground text-center py-4">
                                                    No subjects available. Create subjects first.
                                                </p>
                                            ) : (
                                                <div className="grid gap-2">
                                                    {subjects.map(subject => (
                                                        <label
                                                            key={subject._id}
                                                            className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${selectedSubjects.includes(subject._id)
                                                                ? 'bg-primary/10 border-2 border-primary'
                                                                : 'bg-background border-2 border-transparent hover:bg-muted'
                                                                }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedSubjects.includes(subject._id)}
                                                                onChange={() => toggleSubject(subject._id)}
                                                                className="w-4 h-4"
                                                            />
                                                            <div className="flex-1">
                                                                <p className="font-medium text-sm">
                                                                    {subject.subjectName} {subject.subjectType === 'Lab' && '(Lab)'}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {subject.subjectCode} • {subject.departments?.length > 1 ? 'Mix Depts' : subject.department} • Sem {subject.semesters?.length > 1 ? 'Mix' : subject.semester}
                                                                </p>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {selectedSubjects.length > 0 && (
                                            <p className="text-sm text-muted-foreground">
                                                {selectedSubjects.length} subject(s) selected
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-3 justify-end">
                                        <Button type="button" variant="outline" onClick={handleCancelEdit}>
                                            Cancel
                                        </Button>
                                        <Button type="submit">
                                            {editingTeacher ? 'Update Teacher' : 'Add Teacher'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>All Teachers ({filteredTeachers.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-x-auto">
                            <table className="w-full text-sm min-w-[700px]">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">Name</th>
                                        <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Email</th>
                                        <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Department</th>
                                        <th className="px-4 py-3 text-left font-medium">Subjects</th>
                                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {loading ? (
                                        <tr><td colSpan="5" className="p-8 text-center">Loading...</td></tr>
                                    ) : filteredTeachers.length === 0 ? (
                                        <tr><td colSpan="5" className="p-8 text-center text-muted-foreground">No teachers found</td></tr>
                                    ) : (
                                        filteredTeachers.map((teacher) => {
                                            const teacherSubjects = getTeacherSubjects(teacher._id);
                                            return (
                                                <tr key={teacher._id} className="hover:bg-muted/30 transition-colors">
                                                    <td className="px-4 py-3 font-medium">
                                                        {teacher.name}
                                                        <div className="text-xs text-muted-foreground md:hidden">{teacher.email}</div>
                                                        <div className="text-xs text-muted-foreground sm:hidden">{teacher.department}</div>
                                                    </td>
                                                    <td className="px-4 py-3 hidden md:table-cell">{teacher.email}</td>
                                                    <td className="px-4 py-3 hidden sm:table-cell">{teacher.department}</td>
                                                    <td className="px-4 py-3">
                                                        {teacherSubjects.length === 0 ? (
                                                            <span className="text-muted-foreground text-xs">No subjects</span>
                                                        ) : (
                                                            <div className="flex flex-wrap gap-1">
                                                                {teacherSubjects.map(sub => (
                                                                    <span key={sub._id} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">
                                                                        {sub.subjectCode}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex gap-2 justify-end">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-primary hover:text-primary hover:bg-primary/10"
                                                                onClick={() => handleEdit(teacher)}
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                onClick={() => handleDelete(teacher)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout >
    );
};

export default ManageTeachers;
