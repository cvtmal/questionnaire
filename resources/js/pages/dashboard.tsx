import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { BarChart3Icon, CalendarIcon, UsersIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface PageProps {
    stats: {
        activeApplicants: number;
        interviews: number | null;
        activeJobs: number | null;
        newApplicantsToday: number | null;
        todayCreatedJobs: number | null;
    };
}

export default function Dashboard() {
    const { props } = usePage();
    const { stats } = props as unknown as PageProps;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Applicants</CardTitle>
                            <UsersIcon className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeApplicants}</div>
                            <p className="text-muted-foreground mt-1 text-xs">Approved applicants in the system</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Interviews</CardTitle>
                            <BarChart3Icon className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.interviews !== null ? stats.interviews : 'N/A'}</div>
                            <p className="text-muted-foreground mt-1 text-xs">Ongoing interviews with companies</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                            <CalendarIcon className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeJobs !== null ? stats.activeJobs : 'N/A'}</div>
                            <p className="text-muted-foreground mt-1 text-xs">Currently active job postings</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Applicants Today</CardTitle>
                            <CalendarIcon className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.newApplicantsToday !== null ? stats.newApplicantsToday : 'N/A'}</div>
                            <p className="text-muted-foreground mt-1 text-xs">New applicants registered today</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Jobs Today</CardTitle>
                            <CalendarIcon className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.todayCreatedJobs !== null ? stats.todayCreatedJobs : 'N/A'}</div>
                            <p className="text-muted-foreground mt-1 text-xs">New jobs created today</p>
                        </CardContent>
                    </Card>
                </div>
                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle>System Overview</CardTitle>
                        <CardDescription>Dashboard metrics will be implemented here later</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="py-6 text-center text-muted-foreground">
                            Dashboard metrics will be implemented in the future.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
