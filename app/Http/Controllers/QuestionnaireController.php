<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\GetQuestionnaireDataAction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class QuestionnaireController
{
    /**
     * Display the questionnaire.
     */
    public function index(Request $request, GetQuestionnaireDataAction $action): Response
    {
        $filters = [
            'page' => $request->input('page', 1),
            'per_page' => $request->input('per_page', 10),
            'sort_field' => $request->input('sort_field', 'created_at'),
            'sort_direction' => $request->input('sort_direction', 'desc'),
            'search' => $request->input('search', ''),
        ];

        $questionnaireData = $action->execute($filters);

        return Inertia::render('questionnaire', $questionnaireData);
    }
}
