<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Questionnaire;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

final readonly class GetQuestionnaireDataAction
{
    /**
     * Execute the action to get questionnaire data.
     *
     * @param  array<string, mixed>  $filters
     * @return array{
     *     questionnaires: array{
     *         data: array<int, mixed>,
     *         links: array,
     *         meta: array{
     *             current_page: int,
     *             from: int|null,
     *             last_page: int,
     *             links: array,
     *             path: string,
     *             per_page: int|string,
     *             to: int|null,
     *             total: int
     *         }
     *     },
     *     stats: array{
     *         totalQuestionnaires: int,
     *         submissionsThisMonth: int,
     *         lastUpdatedDate: string|null
     *     },
     *     filters: array{
     *         sort_field: string,
     *         sort_direction: string,
     *         per_page: int|string,
     *         per_page_options: array<int|string>,
     *         search: string
     *     }
     * }
     */
    public function execute(array $filters): array
    {
        // Extract filters with defaults
        $page = (int) ($filters['page'] ?? 1);
        $perPage = $filters['per_page'] ?? 10;
        $sortField = $filters['sort_field'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $search = $filters['search'] ?? '';

        // Get all questionnaires for stats calculation
        $allQuestionnaires = Questionnaire::query()->get();

        // Calculate stats
        $stats = $this->calculateStats($allQuestionnaires);

        // Build the query with search and sorting
        $query = Questionnaire::query()->with('applicant');

        // Apply search if provided
        if (! empty($search)) {
            $query->where(function ($q) use ($search): void {
                // Search by ID if the search term is numeric
                if (is_numeric($search)) {
                    $q->where('id', 'like', "%{$search}%");
                }

                // Search by applicant ID
                $q->orWhere('applicant_id', 'like', "%{$search}%");

                // Search by applicant name
                $q->orWhereHas('applicant', function ($subQuery) use ($search): void {
                    $subQuery->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%");
                });
            });
        }

        // Apply sorting
        $query->orderBy($sortField, $sortDirection);

        // Handle pagination
        $questionnaires = $this->paginateQuestionnaires($query, $perPage, $page, $allQuestionnaires->count());

        // Available per page options
        $perPageOptions = [10, 20, 50, 100, 'all'];

        return [
            'questionnaires' => [
                'data' => $questionnaires->items(),
                'links' => $questionnaires->linkCollection()->toArray(),
                'meta' => [
                    'current_page' => $questionnaires->currentPage(),
                    'from' => $questionnaires->firstItem(),
                    'last_page' => $questionnaires->lastPage(),
                    'links' => $questionnaires->linkCollection()->toArray(),
                    'path' => $questionnaires->path(),
                    'per_page' => $perPage,
                    'to' => $questionnaires->lastItem(),
                    'total' => $questionnaires->total(),
                ],
            ],
            'stats' => $stats,
            'filters' => [
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
                'per_page' => $perPage,
                'per_page_options' => $perPageOptions,
                'search' => $search,
            ],
        ];
    }

    /**
     * Calculate statistics for the questionnaire.
     *
     * @param  Collection<int, Questionnaire>  $questionnaires
     * @return array{
     *     totalQuestionnaires: int,
     *     submissionsThisMonth: int,
     *     lastUpdatedDate: string|null
     * }
     */
    private function calculateStats(Collection $questionnaires): array
    {
        // Calculate total questionnaires
        $totalQuestionnaires = $questionnaires->count();

        // Calculate submissions this month
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        $submissionsThisMonth = $questionnaires->whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();

        // Get the last updated questionnaire
        $lastUpdatedDate = null;

        if ($totalQuestionnaires > 0) {
            $lastUpdatedQuestionnaire = $questionnaires->sortByDesc('updated_at')->first();
            if ($lastUpdatedQuestionnaire) {
                $lastUpdatedDate = $lastUpdatedQuestionnaire->updated_at->format('Y-m-d H:i:s');
            }
        }

        return [
            'totalQuestionnaires' => $totalQuestionnaires,
            'submissionsThisMonth' => $submissionsThisMonth,
            'lastUpdatedDate' => $lastUpdatedDate,
        ];
    }

    /**
     * Paginate questionnaires based on request parameters.
     *
     * @param  Builder<Questionnaire>  $query
     * @return LengthAwarePaginator<Questionnaire>
     */
    private function paginateQuestionnaires(Builder $query, int|string $perPage, int $page, int $total): LengthAwarePaginator
    {
        // Handle "all" option for perPage
        if ($perPage === 'all') {
            // If "all" is selected, we'll get all records but still use pagination for consistent response format
            return $query->paginate($total);
        }

        // Normal pagination with the selected per_page value
        return $query->paginate((int) $perPage, ['*'], 'page', $page);
    }
}
