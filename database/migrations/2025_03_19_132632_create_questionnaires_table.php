<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('questionnaires', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('applicant_id');
            $table->text('job_title')->nullable();
            $table->text('workload')->nullable();
            $table->text('region')->nullable();
            $table->text('termination_reason')->nullable();
            $table->text('salary_current')->nullable();
            $table->text('salary_expectation')->nullable();
            $table->text('availability')->nullable();
            $table->timestamps();
        });
    }
};
