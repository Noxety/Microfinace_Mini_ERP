<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Guarantor extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'customer_id',
        'name',
        'nrc',
        'uploaded_by',
        'phone',
        'relation',
        'occupation',
        'address',
    ];
}
