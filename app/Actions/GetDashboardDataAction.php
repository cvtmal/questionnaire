<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Applicant;
use App\Models\Job;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

final readonly class GetDashboardDataAction
{
    public function execute(): array
    {
        $activeApplicants = Applicant::query()->active()->count();
        $interviews = $this->countInterviews();
        $activeJobs = $this->countActiveJobs();
        $todayCreatedJobs = $this->todayCreatedJobs();

        return [
            'stats' => [
                'activeApplicants' => $activeApplicants,
                'interviews' => $interviews,
                'activeJobs' => $activeJobs,
                'todayCreatedJobs' => $todayCreatedJobs,
            ],
        ];
    }

    private function countInterviews(): ?int
    {
        try {
            return DB::connection('myitjobc_test')
                ->table('applicant_job')
                ->join('presentations', 'applicant_job.presentation_id', '=', 'presentations.id')
                ->join('applicants', 'applicant_job.applicant_id', '=', 'applicants.id')
                ->whereNotNull('interview_datetime_1') // triggered presentation status change from pendent to interview
                ->where('status_id', '2') // approved applicant
                ->where('presentation_status_id', '!=', '9') // 9 = successful placement
                ->where('presentation_status_id', '!=', '4') // 4 = declined by company
                ->count();
        } catch (QueryException $e) {
            return null;
        }
    }

    private function countActiveJobs(): ?int
    {
        try {
            return Job::activeJobs()->count();
        } catch (Exception $e) {
            return null;
        }
    }

    private function todayCreatedJobs(): ?int
    {
        try {
            return Job::query()
                ->whereDate('created_at', Carbon::today())
                ->count();
        } catch (QueryException $e) {
            return null;
        }
    }
}
