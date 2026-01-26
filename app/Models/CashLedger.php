<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CashLedger extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'branch_id',
        'type',
        'amount',
        'loan_transaction_id',
        'description',
        'transaction_date',
        'created_by',
    ];

    protected $casts = [
        'transaction_date' => 'date',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function loanTransaction()
    {
        return $this->belongsTo(LoanTransaction::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
