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
        $dashboardData = $action->execute();

        return Inertia::render('dashboard', $dashboardData);
    }
}
