import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { format, isValid } from 'date-fns';
import { Questionnaire } from './questionnaires-table';

interface DetailItemProps {
    label: string;
    value: string | number | null;
    className?: string;
}

const DetailItem = ({ label, value, className = '' }: DetailItemProps) => (
    <div className={`space-y-0.5 ${className}`}>
        <p className="text-muted-foreground text-xs font-medium">{label}</p>
        <p className="text-sm font-medium">{value || '-'}</p>
    </div>
);

// Safe date formatting helper
const formatDate = (dateString: string | null, formatStr: string = 'PP'): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return isValid(date) ? format(date, formatStr) : '-';
};

export function QuestionnaireDetailView({ questionnaire }: { questionnaire: Questionnaire }) {
    return (
        <Card className="border-none shadow-none">
            <CardHeader className="px-0 py-3">
                <div className="flex items-center">
                    <Badge variant={questionnaire.workload === '100%' ? 'default' : 'secondary'}>{questionnaire.workload || 'No workload'}</Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 px-0">
                {/* Main content in a 3-column layout */}
                <div className="grid grid-cols-3 gap-6">
                    {/* Column 1: Basic details */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold">Basic Info</h3>
                        <div className="space-y-2">
                            <DetailItem label="ID" value={questionnaire.id} />
                            <DetailItem label="Applicant" value={questionnaire.applicant ? questionnaire.applicant.full_name : '-'} />
                            <DetailItem label="Applicant ID" value={questionnaire.applicant_id} className="mt-1 text-xs text-muted-foreground" />
                            <DetailItem label="Job Title" value={questionnaire.job_title} />
                            <DetailItem label="Region" value={questionnaire.region} />
                        </div>
                    </div>

                    {/* Column 2: Salary information */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold">Salary Info</h3>
                        <div className="space-y-2">
                            <DetailItem label="Current Salary" value={questionnaire.salary_current || null} />
                            <DetailItem label="Expected Salary" value={questionnaire.salary_expectation || null} />
                        </div>
                    </div>

                    {/* Column 3: Additional information */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold">Additional Info</h3>
                        <div className="space-y-2">
                            <DetailItem label="Termination Reason" value={questionnaire.termination_reason} />
                            <DetailItem label="Availability" value={questionnaire.availability} />
                            <div className="mt-1 grid grid-cols-2 gap-2">
                                <DetailItem label="Created" value={formatDate(questionnaire.created_at)} />
                                <DetailItem label="Updated" value={formatDate(questionnaire.updated_at)} />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-end px-0 pt-2 pb-0">
                <p className="text-muted-foreground text-xs">Reference ID: {questionnaire.id}</p>
            </CardFooter>
        </Card>
    );
}
