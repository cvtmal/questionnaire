<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Applicant;
use Illuminate\Database\Seeder;

class ApplicantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 50 random applicants
        Applicant::factory()->count(50)->create();
        
        // Create some specific applicants with known IDs for testing
        Applicant::factory()->createMany([
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'status_id' => '2', // Approved
            ],
            [
                'first_name' => 'Jane',
                'last_name' => 'Smith',
                'status_id' => '2', // Approved
            ],
            [
                'first_name' => 'Alex',
                'last_name' => 'Johnson',
                'status_id' => '1', // Pending
            ],
        ]);
    }
}
