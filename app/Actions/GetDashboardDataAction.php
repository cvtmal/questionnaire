<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Applicant;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

final readonly class GetDashboardDataAction
{
    public function execute(): array
    {
        $activeApplicants = Applicant::query()->active()->count();
        $interviews = $this->countInterviews();
        
        return [
            'stats' => [
                'activeApplicants' => $activeApplicants,
                'interviews' => $interviews,
            ],
        ];
    }
    
    private function countInterviews(): ?int
    {
        try {
            return DB::table('applicant_job')
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
}
