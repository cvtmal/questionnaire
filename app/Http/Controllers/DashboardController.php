<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Questionnaire;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(Request $request): Response
    {
        // Get pagination parameters from the request
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 10); // Default to 10 items per page
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $search = $request->input('search', '');

        // Get all questionnaires for stats calculation
        $allQuestionnaires = Questionnaire::all();

        // Calculate total questionnaires
        $totalQuestionnaires = $allQuestionnaires->count();

        // Calculate submissions this month
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        $submissionsThisMonth = $allQuestionnaires->whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();

        // Get the last updated questionnaire
        $lastUpdatedQuestionnaire = null;
        $lastUpdatedDate = null;

        if ($totalQuestionnaires > 0) {
            $lastUpdatedQuestionnaire = $allQuestionnaires->sortByDesc('updated_at')->first();
            if ($lastUpdatedQuestionnaire) {
                $lastUpdatedDate = $lastUpdatedQuestionnaire->updated_at->format('Y-m-d H:i:s');
            }
        }

        // Build the query with search and sorting
        $query = Questionnaire::query();

        // Apply search if provided
        if (! empty($search)) {
            $query->where(function ($q) use ($search): void {
                // Search by ID if the search term is numeric
                if (is_numeric($search)) {
                    $q->where('id', 'like', "%{$search}%");
                }

                // Search by applicant name
                $q->orWhere('applicant_id', 'like', "%{$search}%");
            });
        }

        // Apply sorting
        $query->orderBy($sortField, $sortDirection);

        // Handle "all" option for perPage
        if ($perPage === 'all') {
            // If "all" is selected, we'll get all records but still use pagination for consistent response format
            $questionnaires = $query->paginate($totalQuestionnaires);
        } else {
            // Normal pagination with the selected per_page value
            $questionnaires = $query->paginate((int) $perPage);
        }

        // Debug information
        Log::info('Pagination data:', [
            'total' => $questionnaires->total(),
            'per_page' => $questionnaires->perPage(),
            'current_page' => $questionnaires->currentPage(),
            'last_page' => $questionnaires->lastPage(),
            'has_more_pages' => $questionnaires->hasMorePages(),
            'search' => $search,
        ]);

        // Available per page options
        $perPageOptions = [10, 20, 50, 100, 'all'];

        return Inertia::render('dashboard', [
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
            'stats' => [
                'totalQuestionnaires' => $totalQuestionnaires,
                'submissionsThisMonth' => $submissionsThisMonth,
                'lastUpdatedDate' => $lastUpdatedDate,
            ],
            'filters' => [
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
                'per_page' => $perPage,
                'per_page_options' => $perPageOptions,
                'search' => $search,
            ],
        ]);
    }
}
