<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Loan extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'customer_id',
        'branch_id',
        'credit_level_id',
        'loan_no',
        'principal_amount',
        'interest_rate',
        'term',
        'repayment_type',
        'total_interest',
        'total_payable',
        'start_date',
        'end_date',
        'disbursed_at',
        'status',
        'created_by',
        'approved_by',
        'remark',
    ];

    public function schedules()
    {
        return $this->hasMany(LoanSchedule::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
