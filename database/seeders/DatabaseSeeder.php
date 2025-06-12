<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

final class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Run test questionnaire seeder to create dummy data for pagination testing
        $this->call([
            TestQuestionnaireSeeder::class,
        ]);

        // For local development testing, we seed the applicants and questionnaires
        // Disable foreign key checks to ensure we can import properly
        Schema::disableForeignKeyConstraints();

        $this->call([
            ApplicantSeeder::class,
            QuestionnaireSeeder::class,
        ]);

        Schema::enableForeignKeyConstraints();
    }
}
