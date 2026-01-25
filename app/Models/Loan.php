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
        'disbursed_by',
        'disbursed_amount',
        'status',
        'created_by',
        'approved_by',
        'remark',
    ];

    public function schedules()
    {
        return $this->hasMany(LoanSchedule::class);
    }
    public function disburser()
    {
        return $this->belongsTo(User::class, 'disbursed_by');
    }
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
