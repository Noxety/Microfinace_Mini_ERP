<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Loan;
use App\Models\LoanSchedule;
use App\Services\LoanScheduleService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class LoanController extends Controller
{
    public function preview(Request $request)
    {
        $request->validate([
            'loan_amount' => 'required|numeric|min:1',
            'interest_rate' => 'required|numeric|min:0',
            'tenure' => 'required|integer|min:1',
            'start_date' => 'required|date',
        ]);

        return LoanScheduleService::generate(
            $request->loan_amount,
            $request->interest_rate,
            $request->tenure,
            $request->start_date
        );
    }
    public function index()
    {
        $loans = Loan::with(['customer', 'branch'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Loans/Index', [
            'loans' => $loans,
        ]);
    }
    public function create()
    {
        return Inertia::render('Loans/Create', [
            'customers' => Customer::with('creditLevel')->get(),
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => ['required', 'exists:customers,id'],
            'loan_amount' => ['required', 'numeric', 'min:1'],
            'tenure' => ['required', 'min:1'],
        ]);
        $customer = Customer::with('creditLevel')->findOrFail($request->customer_id);

        if ($request->loan_amount > $customer->creditLevel->max_amount) {
            throw ValidationException::withMessages([
                'loan_amount' => 'Loan amount exceeds credit limit.',
            ]);
        }

        DB::transaction(function () use ($request, $customer) {
            $lastLoanId = Loan::max('id') ?? 0;
            $loanNo = 'LN-' . now()->format('Ymd') . '-' . str_pad($lastLoanId + 1, 4, '0', STR_PAD_LEFT);
            $loan = Loan::create([
                'loan_no' => $loanNo,
                'customer_id' => $customer->id,
                'credit_level_id' => $customer->credit_level_id,
                'amount' => $request->loan_amount,
                'principal_amount' => $request->loan_amount,
                'branch_id' => $customer->branch_id ?? auth()->user()->branch_id,
                'tenure' => $request->tenure,
                'term' => $request->tenure,
                'interest_rate' => $customer->creditLevel->interest_rate,
                'repayment_frequency' => 'monthly',
                'start_date' => $request->start_date,
                'status' => 'pending',
                'created_by' => auth()->id(),
            ]);
            $tenure = (int) $loan->term;
            if ($tenure <= 0) {
                throw ValidationException::withMessages([
                    'tenure' => 'Tenure must be at least 1 month.',
                ]);
            }
            $monthlyPrincipal = $loan->amount / $loan->term;
            $monthlyInterest = ($loan->amount * $loan->interest_rate / 100) / $loan->term;

            for ($i = 1; $i <= $loan->term; $i++) {
                LoanSchedule::create([
                    'loan_id' => $loan->id,
                    'installment_no' => $i,
                    'due_date' => Carbon::parse($loan->start_date)->addMonths($i),
                    'principal_due' => round($monthlyPrincipal, 2),
                    'interest_due' => round($monthlyInterest, 2),
                    'total_due' => round($monthlyPrincipal + $monthlyInterest, 2),
                    'paid_amount' => 0,
                    'status' => 'pending',
                ]);
            }
        });

        return redirect()->route('loans.create')
            ->with('success', 'Loan application submitted');
    }
    public function show(string $id)
    {
        $loan = Loan::with([
            'customer',
            'branch',
            'creator',
            'schedules'
        ])->findOrFail($id);
        return Inertia::render('Loans/Show', [
            'loan' => $loan,
        ]);
    }
}
