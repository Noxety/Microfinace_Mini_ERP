<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LoanSchedule extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'loan_id',
        'installment_no',
        'due_date',
        'principal_due',
        'interest_due',
        'total_due',
        'paid_amount',
        'paid_date',
        'status',
    ];

    public function loan()
    {
        return $this->belongsTo(Loan::class);
    }
}
