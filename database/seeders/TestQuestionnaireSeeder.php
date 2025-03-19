<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Questionnaire;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

final class TestQuestionnaireSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        // Create 20 test questionnaires to ensure pagination is visible
        for ($i = 0; $i < 20; $i++) {
            Questionnaire::create([
                'applicant_id' => $faker->numberBetween(1000, 9999),
                'job_title' => $faker->jobTitle,
                'workload' => $faker->randomElement(['Full-time', 'Part-time', 'Contract']),
                'region' => $faker->state,
                'termination_reason' => $faker->optional(0.7)->sentence,
                'salary_current' => $faker->numberBetween(30000, 120000),
                'salary_expectation' => $faker->numberBetween(35000, 150000),
                'availability' => $faker->date('Y-m-d', '+30 days'),
                'created_at' => $faker->dateTimeBetween('-3 months', 'now'),
                'updated_at' => $faker->dateTimeBetween('-1 month', 'now'),
            ]);
        }
    }
}
