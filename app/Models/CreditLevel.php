<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CreditLevel extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'min_amount',
        'max_amount',
        'max_term',
        'interest_rate',
        'is_default',
        'description',
    ];
}
