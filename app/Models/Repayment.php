<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Repayment extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'loan_id',
        'loan_schedule_id',
        'customer_id',
        'branch_id',
        'collected_by',
        'amount',
        'payment_method',
        'payment_date',
        'principal_paid',
        'interest_paid',
        'penalty_paid',
        'status',
        'remark',
        'created_by',
    ];

    public function loan()
    {
        return $this->belongsTo(Loan::class);
    }

    public function schedule()
    {
        return $this->belongsTo(LoanSchedule::class, 'loan_schedule_id');
    }
}
