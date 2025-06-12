<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Applicant extends Model
{
    use HasFactory;
    protected $connection = 'myitjobc_test';
    /**
     * append full name to user obj
     *
     * @var array
     */
    protected $appends = ['full_name'];

    protected function casts(): array
    {
        return [
            'public_profile' => 'boolean',
        ];
    }

    /**
     * getting full username
     */
    public function getFullNameAttribute(): string
    {
        return ucfirst($this->first_name).' '.ucfirst($this->last_name);
    }

    public function questionnaire(): HasOne
    {
        return $this->hasOne(\App\Models\Questionnaire::class);
    }

    /**
     * Get all approved applicants (active candidates with status 2).
     */
    #[Scope]
    protected function active(Builder $query): void
    {
        $query->where('status_id', '2');
    }
}
