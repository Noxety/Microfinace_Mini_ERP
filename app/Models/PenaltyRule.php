<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PenaltyRule extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'credit_level_id',
        'penalty_type',
        'rate',
        'grace_days',
        'is_active',
        'description,'
    ];
    public function creditLevel()
    {
        return $this->belongsTo(CreditLevel::class);
    }
}
