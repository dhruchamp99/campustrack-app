import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
    ArrowUpDown,
    Users,
    Search,
    CheckCircle2,
    AlertTriangle,
    ChevronRight,
    ChevronLeft,
    RotateCcw,
    History,
    Shield,
    GraduationCap,
    ArrowRight,
    Loader2,
    Info,
    XCircle
} from 'lucide-react';
import API_BASE_URL from '../../config/apiConfig';

const SwitchSemester = () => {
    const [activeTab, setActiveTab] = useState('promote');

    return (
        <DashboardLayout>
            <Toaster position="top-right" />
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <ArrowUpDown className="w-8 h-8 text-primary" />
                        Switch Semester
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Promote students to the next semester or view promotion history.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b pb-0">
                    <button
                        onClick={() => setActiveTab('promote')}
                        className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                            activeTab === 'promote'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                    >
                        <GraduationCap className="w-4 h-4 inline mr-2" />
                        Promote Students
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                            activeTab === 'history'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                    >
                        <History className="w-4 h-4 inline mr-2" />
                        Promotion History
                    </button>
                </div>

                {activeTab === 'promote' ? <PromoteTab /> : <HistoryTab />}
            </div>
        </DashboardLayout>
    );
};

// ──────────────────── PROMOTE TAB ────────────────────
const PromoteTab = () => {
    const [step, setStep] = useState(1);
    const [department, setDepartment] = useState('');
    const [semester, setSemester] = useState('');
    const [departments, setDepartments] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [promoting, setPromoting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [result, setResult] = useState(null);

    // Fetch unique departments from existing students
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/admin/students`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                const depts = [...new Set(res.data.map(s => s.department).filter(Boolean))];
                setDepartments(depts.sort());
            } catch (err) {
                toast.error('Failed to load departments');
            }
        };
        fetchDepartments();
    }, []);

    const toSemester = semester ? String(parseInt(semester) + 1) : '';

    const handlePreview = async () => {
        if (!department || !semester) {
            toast.error('Please select both department and semester');
            return;
        }
        if (parseInt(semester) >= 8) {
            toast.error('Semester 8 students cannot be promoted further. They should be graduated.');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/semester/preview`, {
                params: { department, semester },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setStudents(res.data.students);
            setSelectedIds(new Set(res.data.students.map(s => s._id)));
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    const toggleStudent = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleAll = () => {
        if (selectedIds.size === filteredStudents.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredStudents.map(s => s._id)));
        }
    };

    const filteredStudents = useMemo(() => {
        if (!searchTerm) return students;
        const term = searchTerm.toLowerCase();
        return students.filter(s =>
            s.name.toLowerCase().includes(term) ||
            s.enrollmentNumber.toLowerCase().includes(term)
        );
    }, [students, searchTerm]);

    const handlePromote = async () => {
        if (selectedIds.size === 0) {
            toast.error('No students selected');
            return;
        }
        setPromoting(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/api/admin/semester/promote`, {
                department,
                fromSemester: semester,
                toSemester,
                studentIds: Array.from(selectedIds)
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setResult(res.data);
            setStep(4);
            toast.success(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Promotion failed');
        } finally {
            setPromoting(false);
        }
    };

    const resetWizard = () => {
        setStep(1);
        setDepartment('');
        setSemester('');
        setStudents([]);
        setSelectedIds(new Set());
        setSearchTerm('');
        setResult(null);
    };

    return (
        <div className="space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 py-4">
                {[
                    { num: 1, label: 'Select' },
                    { num: 2, label: 'Preview' },
                    { num: 3, label: 'Confirm' },
                    { num: 4, label: 'Done' }
                ].map((s, i) => (
                    <React.Fragment key={s.num}>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            step === s.num
                                ? 'bg-primary text-primary-foreground'
                                : step > s.num
                                    ? 'bg-green-100 text-green-700 border border-green-300'
                                    : 'bg-muted text-muted-foreground'
                        }`}>
                            {step > s.num ? (
                                <CheckCircle2 className="w-4 h-4" />
                            ) : (
                                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-current/20 text-xs">
                                    {s.num}
                                </span>
                            )}
                            <span className="hidden sm:inline">{s.label}</span>
                        </div>
                        {i < 3 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                    </React.Fragment>
                ))}
            </div>

            {/* Step 1: Select Department & Semester */}
            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            Select Department & Semester
                        </CardTitle>
                        <CardDescription>
                            Choose which group of students to promote to the next semester.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Department</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={department}
                                    onChange={e => setDepartment(e.target.value)}
                                >
                                    <option value="">-- Select Department --</option>
                                    {departments.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Current Semester</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={semester}
                                    onChange={e => setSemester(e.target.value)}
                                >
                                    <option value="">-- Select Semester --</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                        <option key={s} value={String(s)}>Semester {s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {semester && parseInt(semester) >= 8 && (
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span>
                                    Semester 8 is the final semester. Students in Sem 8 should be marked as graduated, not promoted further.
                                </span>
                            </div>
                        )}

                        {semester && parseInt(semester) < 8 && department && (
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm">
                                <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span>
                                    This will promote students from <strong>Semester {semester}</strong> to{' '}
                                    <strong>Semester {toSemester}</strong> in <strong>{department}</strong>.
                                    Past attendance records will be preserved.
                                </span>
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Button
                                onClick={handlePreview}
                                disabled={!department || !semester || parseInt(semester) >= 8 || loading}
                                className="gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
                                Preview Students
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Preview & Select Students */}
            {step === 2 && (
                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-primary" />
                                    Select Students to Promote
                                </CardTitle>
                                <CardDescription>
                                    {department} — Semester {semester} → Semester {toSemester}
                                    <span className="ml-2 font-semibold text-primary">
                                        ({selectedIds.size}/{students.length} selected)
                                    </span>
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative w-64">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search students..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {students.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                                <Users className="w-12 h-12 mx-auto mb-4 opacity-40" />
                                <p>No students found in {department} — Semester {semester}</p>
                            </div>
                        ) : (
                            <>
                                <div className="rounded-md border max-h-[500px] overflow-y-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-3 text-left w-12">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.size === filteredStudents.length && filteredStudents.length > 0}
                                                        onChange={toggleAll}
                                                        className="h-4 w-4 rounded"
                                                    />
                                                </th>
                                                <th className="px-4 py-3 text-left font-medium">Sr.</th>
                                                <th className="px-4 py-3 text-left font-medium">Enrollment No.</th>
                                                <th className="px-4 py-3 text-left font-medium">Name</th>
                                                <th className="px-4 py-3 text-center font-medium">Batch</th>
                                                <th className="px-4 py-3 text-center font-medium">Current Sem</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {filteredStudents.map((student, idx) => (
                                                <tr
                                                    key={student._id}
                                                    className={`hover:bg-muted/30 cursor-pointer transition-colors ${
                                                        selectedIds.has(student._id) ? 'bg-primary/5' : ''
                                                    }`}
                                                    onClick={() => toggleStudent(student._id)}
                                                >
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedIds.has(student._id)}
                                                            onChange={() => toggleStudent(student._id)}
                                                            className="h-4 w-4 rounded"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                                                    <td className="px-4 py-3 font-mono text-xs">{student.enrollmentNumber}</td>
                                                    <td className="px-4 py-3 font-medium">{student.name}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        {student.batch ? (
                                                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-semibold">
                                                                {student.batch}
                                                            </span>
                                                        ) : '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-semibold">
                                                            Sem {student.semester}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                                        <ChevronLeft className="w-4 h-4" /> Back
                                    </Button>
                                    <Button
                                        onClick={() => setStep(3)}
                                        disabled={selectedIds.size === 0}
                                        className="gap-2"
                                    >
                                        Continue with {selectedIds.size} students
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
                <Card className="border-amber-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-700">
                            <AlertTriangle className="w-5 h-5" />
                            Confirm Promotion
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <p className="text-amber-900 font-medium text-lg mb-3">
                                You are about to promote {selectedIds.size} student{selectedIds.size !== 1 ? 's' : ''}:
                            </p>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-white p-3 rounded border">
                                    <p className="text-muted-foreground">Department</p>
                                    <p className="font-semibold">{department}</p>
                                </div>
                                <div className="bg-white p-3 rounded border">
                                    <p className="text-muted-foreground">Students Selected</p>
                                    <p className="font-semibold">{selectedIds.size}</p>
                                </div>
                                <div className="bg-white p-3 rounded border">
                                    <p className="text-muted-foreground">From Semester</p>
                                    <p className="font-semibold text-red-600">Semester {semester}</p>
                                </div>
                                <div className="bg-white p-3 rounded border">
                                    <p className="text-muted-foreground">To Semester</p>
                                    <p className="font-semibold text-green-600">Semester {toSemester}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm">
                            <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium">What happens after promotion:</p>
                                <ul className="list-disc list-inside mt-1 space-y-1">
                                    <li>Students will appear in Semester {toSemester} subjects</li>
                                    <li>All past attendance records are preserved</li>
                                    <li>Teachers marking Sem {toSemester} attendance will see these students</li>
                                    <li>This action can be undone from the History tab</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                                <ChevronLeft className="w-4 h-4" /> Back
                            </Button>
                            <Button
                                onClick={handlePromote}
                                disabled={promoting}
                                className="gap-2 bg-amber-600 hover:bg-amber-700"
                            >
                                {promoting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <ArrowUpDown className="w-4 h-4" />
                                )}
                                {promoting ? 'Promoting...' : `Confirm Promotion (${selectedIds.size} students)`}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 4: Success */}
            {step === 4 && result && (
                <Card className="border-green-200">
                    <CardContent className="pt-8 pb-6">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-green-700">Promotion Successful!</h3>
                            <p className="text-muted-foreground text-lg">{result.message}</p>
                            <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                                <span className="bg-muted px-3 py-1 rounded-full">
                                    Promoted: {result.promoted} students
                                </span>
                            </div>
                            <div className="flex gap-3 justify-center pt-4">
                                <Button variant="outline" onClick={resetWizard} className="gap-2">
                                    <RotateCcw className="w-4 h-4" /> Promote More
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

// ──────────────────── HISTORY TAB ────────────────────
const HistoryTab = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [undoing, setUndoing] = useState(null);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/api/admin/semester/history`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setHistory(res.data);
        } catch (err) {
            toast.error('Failed to load promotion history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleUndo = async (promotionId) => {
        const confirmed = window.confirm(
            'Are you sure you want to undo this promotion? This will revert all promoted students back to their previous semester.'
        );
        if (!confirmed) return;

        setUndoing(promotionId);
        try {
            const res = await axios.post(`${API_BASE_URL}/api/admin/semester/undo/${promotionId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success(res.data.message);
            fetchHistory(); // Refresh
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to undo promotion');
        } finally {
            setUndoing(null);
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
                ))}
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <Card>
                <CardContent className="py-12">
                    <div className="text-center text-muted-foreground">
                        <History className="w-16 h-16 mx-auto mb-4 opacity-40" />
                        <p className="text-lg">No promotion history yet</p>
                        <p className="text-sm mt-2">Promotions will appear here once executed.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {history.map(entry => (
                <Card
                    key={entry._id}
                    className={`transition-colors ${
                        entry.undone ? 'border-red-200 bg-red-50/30' : 'hover:shadow-md'
                    }`}
                >
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold text-lg">
                                        {entry.department}
                                    </h3>
                                    <div className="flex items-center gap-1 text-sm">
                                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-medium">
                                            Sem {entry.fromSemester}
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                        <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 font-medium">
                                            Sem {entry.toSemester}
                                        </span>
                                    </div>
                                    {entry.undone ? (
                                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold uppercase">
                                            Undone
                                        </span>
                                    ) : (
                                        <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-semibold uppercase">
                                            Active
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                                    <span>📅 {formatDate(entry.promotedAt)}</span>
                                    <span>👤 {entry.promotedBy?.name || 'Unknown'}</span>
                                    <span>🎓 {entry.totalPromoted} students</span>
                                    <span>📆 AY: {entry.academicYear}</span>
                                </div>

                                {entry.undone && entry.undoneAt && (
                                    <p className="text-xs text-red-600 mt-1">
                                        Undone on {formatDate(entry.undoneAt)} by {entry.undoneBy?.name || 'Unknown'}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                {!entry.undone && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleUndo(entry._id)}
                                        disabled={undoing === entry._id}
                                        className="gap-2"
                                    >
                                        {undoing === entry._id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <RotateCcw className="w-4 h-4" />
                                        )}
                                        Undo
                                    </Button>
                                )}
                                <details className="relative">
                                    <summary className="cursor-pointer px-3 py-1.5 text-sm border rounded-md hover:bg-muted transition-colors">
                                        View Students ({entry.students.length})
                                    </summary>
                                    <div className="absolute right-0 mt-1 w-80 bg-background border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                                        <div className="p-2">
                                            {entry.students.map((s, i) => (
                                                <div key={s.studentId || i} className="flex justify-between text-xs py-1.5 px-2 hover:bg-muted rounded">
                                                    <span className="font-medium">{s.name}</span>
                                                    <span className="text-muted-foreground font-mono">{s.enrollmentNumber}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default SwitchSemester;
