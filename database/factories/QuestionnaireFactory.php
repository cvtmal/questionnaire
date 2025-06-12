<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Applicant;
use App\Models\Questionnaire;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<Questionnaire>
 */
final class QuestionnaireFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Questionnaire::class;

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure(): self
    {
        return $this->connection('myitjobc_test');
    }

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $jobTitles = [
            'Software Engineer',
            'Frontend Developer',
            'Backend Developer',
            'Full Stack Developer',
            'DevOps Engineer',
            'QA Engineer',
            'Product Manager',
            'UX Designer',
            'Data Scientist',
            'Project Manager',
            null,
        ];

        $workloads = ['100%', '80%', '60%', '50%', '40%', null];

        $regions = ['Remote', 'Europe', 'Americas', 'Asia', 'Africa', 'Australia', null];

        $terminationReasons = [
            'Better opportunity',
            'Relocation',
            'Company restructuring',
            'Career change',
            'Personal reasons',
            null,
        ];

        return [
            'applicant_id' => Applicant::factory(),
            'job_title' => $this->faker->randomElement($jobTitles),
            'workload' => $this->faker->randomElement($workloads),
            'region' => $this->faker->randomElement($regions),
            'termination_reason' => $this->faker->randomElement($terminationReasons),
            'salary_current' => $this->faker->optional(0.7)->numberBetween(40000, 150000),
            'salary_expectation' => $this->faker->optional(0.8)->numberBetween(50000, 200000),
            'availability' => $this->faker->optional(0.9, null)->passthrough(function () {
                return $this->faker->dateTimeBetween('now', '+6 months')->format('Y-m-d');
            }),
            'created_at' => $createdAt = $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween($createdAt, 'now'),
        ];
    }
}
