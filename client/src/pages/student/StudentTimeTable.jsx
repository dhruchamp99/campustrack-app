import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Clock, Calendar, MapPin, Users, BookOpen } from 'lucide-react';

const StudentTimeTable = () => {
    const subjects = [
        { code: 'BE04000101', short: 'ESS & RE', name: 'Environmental Science, Sustainability and Renewable Energy', facultyShort: 'HT, HP', faculty: 'Dr. Hiral Tailor, Dr. Himanshu Patel' },
        { code: 'BE04000221', short: 'OS', name: 'Operating System', facultyShort: 'HD, DP, FP', faculty: 'Dr. Hiral Desai, Prof. Devkishan Patel, Prof. Forum Patel' },
        { code: 'BE04000231', short: 'OOP', name: 'Object Oriented Programming', facultyShort: 'DP, TP', faculty: 'Prof. Devkishan Patel, Prof. Tarul Patel' },
        { code: 'BE04000241', short: 'ADA', name: 'Analysis and Design of Algorithms', facultyShort: 'RP', faculty: 'Prof. Rutika Patel' },
        { code: 'BE04000251', short: 'COA', name: 'Computer Organization & Architecture', facultyShort: 'TP', faculty: 'Prof. Taral Patel' },
        { code: 'BE04000261', short: 'DMGT', name: 'Discrete Mathematics and Graph Theory', facultyShort: 'PS', faculty: 'Prof. Parul Savaliya' },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8 max-w-7xl mx-auto pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-indigo-600 text-white hover:bg-indigo-700 border-none px-3 py-1">2025-26</Badge>
                            <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50">Even Term</Badge>
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">CLASS TIME TABLE</h1>
                        <p className="text-slate-500 font-medium flex items-center gap-2">
                            <Users className="w-4 h-4" /> Computer Engineering Department • Year: 2nd • Sem: 4th
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2 text-slate-600 font-bold bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                            <MapPin className="w-4 h-4 text-indigo-500" />
                            Class Room No: <span className="text-indigo-600">A-108</span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Effective from January 2026</p>
                    </div>
                </div>

                {/* Main Timetable Card */}
                <Card className="overflow-hidden bg-white border-slate-200 shadow-xl rounded-2xl overflow-x-auto">
                    <table className="w-full text-sm border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-slate-800 text-white">
                                <th className="px-4 py-4 border-r border-slate-700 font-bold text-center w-16">Sr.</th>
                                <th className="px-4 py-4 border-r border-slate-700 font-bold text-center w-32">Time</th>
                                <th className="px-4 py-4 border-r border-slate-700 font-bold text-center">MONDAY</th>
                                <th className="px-4 py-4 border-r border-slate-700 font-bold text-center">TUESDAY</th>
                                <th className="px-4 py-4 border-r border-slate-700 font-bold text-center">WEDNESDAY</th>
                                <th className="px-4 py-4 border-r border-slate-700 font-bold text-center">THURSDAY</th>
                                <th className="px-4 py-4 border-r border-slate-700 font-bold text-center">FRIDAY</th>
                                <th className="px-4 py-4 font-bold text-center">SATURDAY</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {/* Slot 1 & 2: Lab Sessions (Merged Rows for Mon-Thu) */}
                            <tr>
                                <td className="px-2 py-4 font-bold text-slate-500 border-r text-center bg-slate-50/50">1</td>
                                <td className="px-2 py-4 font-bold text-slate-700 border-r text-center bg-slate-50/50 whitespace-nowrap">09:15-10:10</td>
                                <td rowSpan="2" className="p-3 border-r bg-indigo-50/30 align-middle">
                                    <div className="space-y-2">
                                        <div className="text-center group"><div className="font-bold text-indigo-900 border-b border-indigo-100 pb-1">OS (A) <span className="text-[10px] text-indigo-500 font-normal">(FP) (L1)</span></div></div>
                                        <div className="text-center group"><div className="font-bold text-indigo-900 border-b border-indigo-100 pb-1 pt-1">OS (B) <span className="text-[10px] text-indigo-500 font-normal">(FP) (L1)</span></div></div>
                                        <div className="text-center group"><div className="font-bold text-indigo-900 pt-1">COA (C) <span className="text-[10px] text-indigo-500 font-normal">(TP) (L2)</span></div></div>
                                    </div>
                                </td>
                                <td rowSpan="2" className="p-3 border-r bg-indigo-50/30 align-middle">
                                    <div className="space-y-2">
                                        <div className="text-center"><div className="font-bold text-indigo-900 border-b border-indigo-100 pb-1">OOP (A) <span className="text-[10px] text-indigo-500 font-normal">(TP) (L1)</span></div></div>
                                        <div className="text-center"><div className="font-bold text-indigo-900 border-b border-indigo-100 pb-1 pt-1">OOP (B) <span className="text-[10px] text-indigo-500 font-normal">(TP) (L1)</span></div></div>
                                        <div className="text-center"><div className="font-bold text-indigo-900 pt-1">ADA (C) <span className="text-[10px] text-indigo-500 font-normal">(RP) (L2)</span></div></div>
                                    </div>
                                </td>
                                <td rowSpan="2" className="p-3 border-r bg-indigo-50/30 align-middle">
                                    <div className="space-y-2">
                                        <div className="text-center"><div className="font-bold text-indigo-900 border-b border-indigo-100 pb-1">ADA (A) <span className="text-[10px] text-indigo-500 font-normal">(RP) (L1)</span></div></div>
                                        <div className="text-center"><div className="font-bold text-indigo-900 border-b border-indigo-100 pb-1 pt-1">ADA (B) <span className="text-[10px] text-indigo-500 font-normal">(RP) (L1)</span></div></div>
                                        <div className="text-center"><div className="font-bold text-indigo-900 pt-1">OOP (C) <span className="text-[10px] text-indigo-500 font-normal">(DP) (L2)</span></div></div>
                                    </div>
                                </td>
                                <td rowSpan="2" className="p-3 border-r bg-indigo-50/30 align-middle">
                                    <div className="space-y-2">
                                        <div className="text-center"><div className="font-bold text-indigo-900 border-b border-indigo-100 pb-1">COA (A) <span className="text-[10px] text-indigo-500 font-normal">(TP) (L1)</span></div></div>
                                        <div className="text-center"><div className="font-bold text-indigo-900 border-b border-indigo-100 pb-1 pt-1">COA (B) <span className="text-[10px] text-indigo-500 font-normal">(TP) (L1)</span></div></div>
                                        <div className="text-center"><div className="font-bold text-indigo-900 pt-1">OS (C) <span className="text-[10px] text-indigo-500 font-normal">(FP) (L2)</span></div></div>
                                    </div>
                                </td>
                                <td className="p-3 border-r text-center align-middle hover:bg-slate-50 transition-colors">
                                    <div className="font-black text-slate-800">OS</div>
                                    <div className="text-[10px] text-slate-500 font-bold">(DP)</div>
                                </td>
                                <td className="p-3 text-center bg-slate-50/30"></td>
                            </tr>
                            <tr>
                                <td className="px-2 py-4 font-bold text-slate-500 border-r text-center bg-slate-50/50">2</td>
                                <td className="px-2 py-4 font-bold text-slate-700 border-r text-center bg-slate-50/50 whitespace-nowrap">10:10-11:05</td>
                                {/* Mon-Thu cells merged above */}
                                <td className="p-3 border-r text-center align-middle hover:bg-slate-50 transition-colors">
                                    <div className="font-black text-slate-800">COA</div>
                                    <div className="text-[10px] text-slate-500 font-bold">(TP)</div>
                                </td>
                                <td className="p-3 text-center bg-slate-50/30"></td>
                            </tr>

                            {/* Slot 3 */}
                            <tr className="border-t-2 border-slate-200">
                                <td className="px-2 py-4 font-bold text-slate-500 border-r text-center bg-slate-50/50">3</td>
                                <td className="px-2 py-4 font-bold text-slate-700 border-r text-center bg-slate-50/50 whitespace-nowrap">11:05-12:00</td>
                                <td className="p-3 border-r text-center align-middle hover:bg-slate-50 transition-colors">
                                    <div className="font-black text-slate-800 leading-tight">ADA</div>
                                    <div className="text-[10px] text-slate-500 font-bold">(RP)</div>
                                </td>
                                <td className="p-3 border-r text-center align-middle hover:bg-slate-50 transition-colors">
                                    <div className="font-black text-slate-800 leading-tight">COA</div>
                                    <div className="text-[10px] text-slate-500 font-bold">(TP)</div>
                                </td>
                                <td className="p-3 border-r text-center align-middle hover:bg-slate-50 transition-colors">
                                    <div className="font-black text-slate-800 leading-tight">ESS & RE</div>
                                    <div className="text-[10px] text-slate-500 font-bold">(HT)</div>
                                </td>
                                <td className="p-3 border-r text-center align-middle hover:bg-slate-50 transition-colors">
                                    <div className="font-black text-slate-800 leading-tight">ESS & RE</div>
                                    <div className="text-[10px] text-slate-500 font-bold">(HT)</div>
                                </td>
                                <td className="p-3 border-r text-center align-middle hover:bg-slate-50 transition-colors">
                                    <div className="font-black text-slate-800 leading-tight">OOP</div>
                                    <div className="text-[10px] text-slate-500 font-bold">(DP)</div>
                                </td>
                                <td className="p-3 text-center bg-slate-50/30"></td>
                            </tr>

                            {/* Lunch Break */}
                            <tr className="bg-amber-50 border-y-2 border-amber-100">
                                <td className="px-2 py-3 font-bold text-amber-900 border-r text-center bg-amber-100/50 italic">LB</td>
                                <td className="px-2 py-3 font-bold text-amber-900 border-r text-center bg-amber-100/50 whitespace-nowrap">12:00-12:40</td>
                                <td colSpan="6" className="p-3 text-center text-amber-700 font-black tracking-[0.2em] uppercase text-xs">
                                    LUNCH BREAK (12:00 PM to 12:40 PM)
                                </td>
                            </tr>

                            {/* Slot 4 */}
                            <tr>
                                <td className="px-2 py-4 font-bold text-slate-500 border-r text-center bg-slate-50/50">4</td>
                                <td className="px-2 py-4 font-bold text-slate-700 border-r text-center bg-slate-50/50 whitespace-nowrap">12:40-01:30</td>
                                <td className="p-3 border-r text-center align-middle hover:bg-slate-50 transition-colors">
                                    <div className="font-black text-slate-800">OOP</div>
                                    <div className="text-[10px] text-slate-500 font-bold">(TP)</div>
                                </td>
                                <td className="p-3 border-r text-center align-middle hover:bg-slate-50 transition-colors">
                                    <div className="font-black text-slate-800">OOP</div>
                                    <div className="text-[10px] text-slate-500 font-bold">(DP)</div>
                                </td>
                                <td className="p-3 border-r text-center align-middle hover:bg-slate-50 transition-colors">
                                    <div className="font-black text-slate-800">OS</div>
                                    <div className="text-[10px] text-slate-500 font-bold">(HD)</div>
                                </td>
                                <td className="p-3 border-r text-center align-middle hover:bg-slate-50 transition-colors">
                                    <div className="font-black text-slate-800">COA</div>
                                    <div className="text-[10px] text-slate-500 font-bold">(TP)</div>
                                </td>
                                <td className="p-3 border-r text-center align-middle hover:bg-slate-50 transition-colors">
                                    <div className="font-black text-slate-800">ADA</div>
                                    <div className="text-[10px] text-slate-500 font-bold">(RP)</div>
                                </td>
                                <td className="p-3 text-center bg-slate-50/30"></td>
                            </tr>

                            {/* Slot 5 */}
                            <tr>
                                <td className="px-2 py-4 font-bold text-slate-500 border-r text-center bg-slate-50/50">5</td>
                                <td className="px-2 py-4 font-bold text-slate-700 border-r text-center bg-slate-50/50 whitespace-nowrap">01:30-02:20</td>
                                <td rowSpan="2" className="p-3 border-r bg-emerald-50/30 align-middle text-center">
                                    <div className="font-black text-emerald-800">ESS & RE Tutorial</div>
                                    <div className="text-[10px] text-emerald-600 font-bold">(HP)</div>
                                </td>
                                <td className="p-3 border-r text-center align-middle hover:bg-slate-50 transition-colors">
                                    <div className="font-black text-slate-800">DMGT</div>
                                    <div className="text-[10px] text-slate-500 font-bold">(PS)</div>
                                </td>
                                <td className="p-3 border-r text-center align-middle hover:bg-slate-50 transition-colors">
                                    <div className="font-black text-slate-800">OS</div>
                                    <div className="text-[10px] text-slate-500 font-bold">(HD)</div>
                                </td>
                                <td rowSpan="2" className="p-3 border-r bg-emerald-50/30 align-middle text-center">
                                    <div className="font-black text-emerald-800">DMGT Tutorial</div>
                                    <div className="text-[10px] text-emerald-600 font-bold">(PS)</div>
                                </td>
                                <td className="p-3 border-r text-center align-middle hover:bg-slate-50 transition-colors">
                                    <div className="font-black text-slate-800">DMGT</div>
                                    <div className="text-[10px] text-slate-500 font-bold">(PS)</div>
                                </td>
                                <td className="p-3 text-center bg-slate-50/30"></td>
                            </tr>

                            {/* Slot 6 */}
                            <tr>
                                <td className="px-2 py-4 font-bold text-slate-500 border-r text-center bg-slate-50/50">6</td>
                                <td className="px-2 py-4 font-bold text-slate-700 border-r text-center bg-slate-50/50 whitespace-nowrap">02:20-03:10</td>
                                {/* Mon Tutorial merged above */}
                                <td className="p-3 border-r text-center align-middle hover:bg-slate-50 transition-colors">
                                    <div className="font-black text-slate-800">ADA</div>
                                    <div className="text-[10px] text-slate-500 font-bold">(RP)</div>
                                </td>
                                <td className="p-3 border-r text-center align-middle hover:bg-slate-50 transition-colors">
                                    <div className="font-black text-slate-800">DMGT</div>
                                    <div className="text-[10px] text-slate-500 font-bold">(PS)</div>
                                </td>
                                {/* Thu Tutorial merged above */}
                                <td className="p-3 border-r text-center align-middle bg-slate-50/50">
                                    <div className="font-black text-slate-400 italic">Sports</div>
                                </td>
                                <td className="p-3 text-center bg-slate-50/30"></td>
                            </tr>
                        </tbody>
                    </table>
                </Card>

                {/* Subject and Faculty Information Section */}
                <div className="grid lg:grid-cols-1 gap-6">
                    <Card className="border-slate-200 shadow-lg rounded-2xl overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b border-slate-100">
                            <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                                <BookOpen className="w-5 h-5 text-indigo-600" />
                                Subject & Faculty List
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 font-bold">
                                        <tr>
                                            <th className="px-6 py-4 border-b">Subject Code</th>
                                            <th className="px-6 py-4 border-b">Short Name</th>
                                            <th className="px-6 py-4 border-b">Subject Name</th>
                                            <th className="px-6 py-4 border-b">Faculty ID</th>
                                            <th className="px-6 py-4 border-b">Faculty Name</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {subjects.map((sub, i) => (
                                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 font-mono text-xs font-bold text-indigo-600">{sub.code}</td>
                                                <td className="px-6 py-4 font-black text-slate-700">{sub.short}</td>
                                                <td className="px-6 py-4 text-slate-600 font-medium">{sub.name}</td>
                                                <td className="px-6 py-4 font-bold text-slate-500">{sub.facultyShort}</td>
                                                <td className="px-6 py-4 text-slate-600 italic">{sub.faculty}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Legend/Footer */}
                <div className="flex flex-wrap gap-4 justify-center py-4 opacity-70">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <div className="w-3 h-3 bg-indigo-50 border border-indigo-100 rounded"></div>
                        Lab / Practical Session
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <div className="w-3 h-3 bg-emerald-50 border border-emerald-100 rounded"></div>
                        Tutorial Session
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <div className="w-3 h-3 bg-amber-50 border border-amber-100 rounded"></div>
                        Lunch Break
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentTimeTable;
