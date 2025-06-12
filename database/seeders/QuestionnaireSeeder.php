<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Applicant;
use App\Models\Questionnaire;
use Faker\Factory;
use Illuminate\Database\Seeder;

final class QuestionnaireSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create faker instance
        $faker = Factory::create();

        // Create some questionnaires linked to random applicants
        Questionnaire::factory()
            ->count(30)
            ->create();

        // Create questionnaires for the specific test applicants we created
        $specificApplicants = Applicant::where('first_name', 'John')
            ->orWhere('first_name', 'Jane')
            ->orWhere('first_name', 'Alex')
            ->get();

        // Create a questionnaire for each specific applicant
        foreach ($specificApplicants as $applicant) {
            Questionnaire::factory()
                ->create([
                    'applicant_id' => $applicant->id,
                    // Force specific data for these test cases
                    'job_title' => 'Senior '.$faker->jobTitle(),
                    'workload' => '100%',
                    'region' => 'Remote',
                ]);
        }
    }
}
