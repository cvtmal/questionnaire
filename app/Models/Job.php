<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

final class Job extends Model
{
    protected $connection = 'myitjobc_test';

    /**
     * Get all active jobs.
     */
    #[Scope]
    protected function activeJobs(Builder $query): void
    {
        $query->where('job_status_id', '1');
    }
}
