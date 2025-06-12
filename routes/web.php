<?php

declare(strict_types=1);

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\QuestionnaireController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('questionnaire', [QuestionnaireController::class, 'index'])->name('questionnaire');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
