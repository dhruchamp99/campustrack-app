import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const StudentAnalytics = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>Performance Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Advanced analytics and grade predictions coming soon.</p>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default StudentAnalytics;
