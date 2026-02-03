import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { FileText, Download, PlayCircle, Lock } from 'lucide-react';

const StudentMaterials = () => {
    // Mock data for UI
    const materials = [
        { id: 1, title: 'Operating System Concepts - Chapter 1', type: 'PDF', size: '4.2 MB', date: '2 days ago', rating: 4.8 },
        { id: 2, title: 'Database Normalization - Complete Guide', type: 'PDF', size: '2.8 MB', date: '5 days ago', rating: 4.9 },
        { id: 3, title: 'Binary Tree Implementation in C++', type: 'Code', size: '125 KB', date: '1 week ago', rating: 4.6 },
        { id: 4, title: 'Computer Architecture - Lecture 5', type: 'Video', size: '185 MB', date: '3 days ago', rating: 4.7 },
        { id: 5, title: 'Software Development Life Cycle Notes', type: 'Notes', size: '1.5 MB', date: '1 week ago', rating: 4.5 },
        { id: 6, title: 'SQL Query Practice Problems', type: 'PDF', size: '3.1 MB', date: '4 days ago', rating: 4.9 },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Study Materials</h2>
                        <p className="text-muted-foreground">Access your course resources and notes.</p>
                    </div>
                    <Button variant="outline">View All</Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {materials.map((item) => (
                        <Card key={item.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
                            <CardHeader className="flex-row gap-4 items-start space-y-0 pb-2">
                                <div className={`p-2 rounded-lg ${item.type === 'PDF' ? 'bg-red-100 text-red-600' :
                                        item.type === 'Video' ? 'bg-purple-100 text-purple-600' :
                                            item.type === 'Code' ? 'bg-blue-100 text-blue-600' :
                                                'bg-green-100 text-green-600'
                                    }`}>
                                    {item.type === 'Video' ? <PlayCircle className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-start w-full">
                                        <CardTitle className="text-base line-clamp-2 leading-tight">{item.title}</CardTitle>
                                    </div>
                                    <CardDescription>{item.type}</CardDescription>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded bg-secondary ml-auto`}>
                                    {item.type}
                                </span>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                    <span>{item.date}</span>
                                    <span>{item.size}</span>
                                    <span className="flex items-center gap-1 text-amber-500">
                                        ★ {item.rating}
                                    </span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full gap-2" variant="secondary">
                                    <Download className="w-4 h-4" /> Download
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}

                    {/* Coming Soon / Locked */}
                    <Card className="flex flex-col justify-center items-center bg-muted/30 border-dashed">
                        <CardContent className="flex flex-col items-center py-10 text-center space-y-4">
                            <div className="p-4 rounded-full bg-muted">
                                <Lock className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="font-semibold">More coming soon</h3>
                                <p className="text-sm text-muted-foreground">Teachers are uploading new content.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentMaterials;
