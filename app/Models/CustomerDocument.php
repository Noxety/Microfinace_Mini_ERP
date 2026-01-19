<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerDocument extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'customer_id',
        'type',
        'file_path',
        'uploaded_by',
    ];
}
