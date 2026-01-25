<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Loan;
use App\Models\LoanSchedule;
use App\Models\LoanTransaction;
use App\Models\Repayment;
use App\Services\LoanScheduleService;
use App\Services\PenaltyService;
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
            $monthlyPrincipal = $request->loan_amount / $request->tenure;
            $monthlyInterest = ($request->loan_amount * $customer->creditLevel->interest_rate / 100) / $request->tenure;

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
    public function approve(Request $request, Loan $loan)
    {
        if ($loan->status !== 'pending') {
            throw ValidationException::withMessages([
                'loan' => 'Only pending loans can be approved.',
            ]);
        }

        DB::transaction(function () use ($loan) {
            $loan->update([
                'status' => 'approved',
                'approved_by' => auth()->id(),
                'approved_at' => now(),
            ]);
        });

        return redirect()
            ->route('loans.show', $loan)
            ->with('success', 'Loan approved successfully');
    }
    public function disburse(Request $request, Loan $loan)
    {
        if ($loan->status !== 'approved') {
            throw ValidationException::withMessages([
                'loan' => 'Only approved loans can be disbursed.',
            ]);
        }
        $request->validate([
            'disbursed_amount' => ['required', 'numeric', 'min:1'],
            'disbursed_date' => ['required', 'date'],
        ]);
        if ($request->disbursed_amount > $loan->principal_amount) {
            throw ValidationException::withMessages([
                'disbursed_amount' => 'Disbursed amount cannot exceed loan principal.',
            ]);
        }
        DB::transaction(function () use ($loan, $request) {
            $loan->update([
                'status' => 'disbursed',
                'disbursed_amount' => $request->disbursed_amount,
                'disbursed_at' => $request->disbursed_date,
                'disbursed_by' => auth()->id(),
            ]);
            $loan->schedules()->update([
                'status' => 'pending',
            ]);
        });
        return redirect()
            ->route('loans.show', $loan)
            ->with('success', 'Loan disbursed successfully');
    }
    public function repayments(Request $request, LoanSchedule $loanSchedule)
    {

        $request->validate([
            'amount' => ['required', 'numeric', 'min:1'],
            'paid_date' => ['required', 'date'],
        ]);

        $loan = $loanSchedule->loan;
        if ($loan->status !== 'disbursed') {
            throw ValidationException::withMessages([
                'loan' => 'Loan is not disbursed.',
            ]);
        }
        $remaining = $loanSchedule->total_due - $loanSchedule->paid_amount;

        if ($request->amount > $remaining) {
            throw ValidationException::withMessages([
                'amount' => 'Payment exceeds remaining balance.',
            ]);
        }
        DB::transaction(function () use ($request, $loanSchedule, $loan) {
            $repayment = Repayment::create([
                'loan_id' => $loan->id,
                'loan_schedule_id' => $loanSchedule->id,
                'customer_id' => $loan->customer_id,
                'branch_id' => $loan->branch_id,
                'amount' => $request->amount,
                'payment_date' => $request->paid_date,
                'collected_by' => auth()->id(),
                'payment_method' => 'cash',
                'created_by' => auth()->id(),
            ]);
            $loanSchedule->paid_amount += $request->amount;

            if ($loanSchedule->paid_amount >= $loanSchedule->total_due) {
                $loanSchedule->status = 'paid';
                $loanSchedule->paid_date = $request->paid_date;
            } else {
                $loanSchedule->status = 'partial';
            }
            $penalty = PenaltyService::calculate($loanSchedule);
            $totalDueWithPenalty = ($loanSchedule->total_due - $loanSchedule->paid_amount) + $penalty['amount'];
            $loanSchedule->penalty_amount = $penalty['amount'];
            $loanSchedule->overdue_days = $penalty['days'];

            if ($penalty['amount'] > 0) {
                if ($request->amount > $totalDueWithPenalty) {
                    throw ValidationException::withMessages([
                        'amount' => 'Payment exceeds total due including penalty.',
                    ]);
                }
            }
            $loanSchedule->save();
            LoanTransaction::create([
                'loan_id' => $loan->id,
                'customer_id' => $loan->customer_id,
                'branch_id' => $loan->branch_id,
                'loan_schedule_id' => $loanSchedule->id,
                'trx_no' => 'TRX-' . strtoupper(uniqid()),
                'trx_type' => 'repayment',
                'amount' => $request->amount,
                'balance' => $loanSchedule->total_due - $loanSchedule->paid_amount,
                'repayment_id' => $repayment->id,
                'trx_date' => $request->paid_date,
                'created_by' => auth()->id(),
            ]);
            $unpaid = $loan->schedules()
                ->where('status', '!=', 'paid')
                ->exists();
            if (!$unpaid) {
                $loan->status = 'completed';
                $loan->end_date = now();
                $loan->save();
            }
        });

        return back()->with('success', 'Repayment recorded successfully.');
    }
}
