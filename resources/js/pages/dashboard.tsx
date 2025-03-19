import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { QuestionnairesTable, type Questionnaire } from '@/components/questionnaires/questionnaires-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { CalendarIcon, UsersIcon, BarChart3Icon } from 'lucide-react';
import React from "react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface PageProps {
    questionnaires: {
        data: Questionnaire[];
        links: {
            first: string;
            last: string;
            prev: string | null;
            next: string | null;
        };
        meta: {
            current_page: number;
            from: number;
            last_page: number;
            links: Array<{
                url: string | null;
                label: string;
                active: boolean;
            }>;
            path: string;
            per_page: number | string;
            to: number;
            total: number;
        };
    };
    stats: {
        totalQuestionnaires: number;
        submissionsThisMonth: number;
        lastUpdatedDate: string | null;
    };
    filters: {
        sort_field: string;
        sort_direction: string;
        per_page: number | string;
        per_page_options: (number | string)[];
        search: string;
    };
}

export default function Dashboard() {
    const { props } = usePage();
    const { questionnaires, stats, filters } = props as unknown as PageProps;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Questionnaires
                            </CardTitle>
                            <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalQuestionnaires}</div>
                            <p className="text-xs text-muted-foreground mt-1">All submissions in the system</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Submissions This Month
                            </CardTitle>
                            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.submissionsThisMonth}</div>
                            <p className="text-xs text-muted-foreground mt-1">Total submissions this month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Last Updated
                            </CardTitle>
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.lastUpdatedDate 
                                    ? format(new Date(stats.lastUpdatedDate), 'PP') 
                                    : 'Never'}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Most recently updated questionnaire</p>
                        </CardContent>
                    </Card>
                </div>
                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle>Questionnaire Submissions</CardTitle>
                        <CardDescription>
                            A list of all questionnaire submissions from applicants
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <QuestionnairesTable 
                            questionnaires={questionnaires} 
                            filters={filters}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
