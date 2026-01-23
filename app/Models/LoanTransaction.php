<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LoanTransaction extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'loan_id',
        'customer_id',
        'branch_id',
        'loan_schedule_id',
        'repayment_id',
        'trx_no',
        'trx_type',
        'direction',
        'amount',
        'balance',
        'trx_date',
        'remark',
        'created_by',
    ];

    public function loan()
    {
        return $this->belongsTo(Loan::class);
    }
}
