<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\GetDashboardDataAction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController
{
    /**
     * Display the dashboard.
     */
    public function index(Request $request, GetDashboardDataAction $action): Response
    {
        $filters = [
            'page' => $request->input('page', 1),
            'per_page' => $request->input('per_page', 10),
            'sort_field' => $request->input('sort_field', 'created_at'),
            'sort_direction' => $request->input('sort_direction', 'desc'),
            'search' => $request->input('search', ''),
        ];

        $dashboardData = $action->execute($filters);

        return Inertia::render('dashboard', $dashboardData);
    }
}
