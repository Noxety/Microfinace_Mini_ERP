<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'branch_id',
        'credit_level_id',
        'monthly_income',
        'customer_no',
        'name',
        'nrc',
        'phone',
        'email',
        'avatar',
        'dob',
        'gender',
        'monthly_income',
        'occupation',
        'credit_limit',
        'current_loan_balance',
        'risk_grade',
        'limit_expired_at',
        'remark',
        'status',
        'created_by'
    ];
    public function guarantors()
    {
        return $this->hasMany(Guarantor::class);
    }

    public function documents()
    {
        return $this->hasMany(CustomerDocument::class);
    }

    public function addresses()
    {
        return $this->hasMany(CustomerAddress::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
    public function creditLevel()
    {
        return $this->belongsTo(CreditLevel::class);
    }

    public function loans()
    {
        return $this->hasMany(Loan::class);
    }

    public function availableLimit()
    {
        return $this->credit_limit - $this->current_loan_balance;
    }
}
