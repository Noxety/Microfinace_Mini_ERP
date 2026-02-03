<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\CashLedger;
use App\Models\Loan;
use App\Models\LoanSchedule;
use App\Services\CashBalanceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CashDashboardController extends Controller
{
    /** Admin and manager can view all branches; others see only their branch. */
    protected function canViewAllBranches(): bool
    {
        $user = auth()->user();
        return $user->hasRole('admin') || $user->hasRole('manager');
    }

    public function dashboard(Request $request)
    {
        $user = auth()->user();
        $canViewAllBranches = $this->canViewAllBranches();
        $branchBalance = null;
        if ($canViewAllBranches) {
            $branchId = $request->filled('branch_id') ? (int) $request->branch_id : null;
        } else {
            $branchId = $user->branch_id;
        }
        if ($request->branch_id) {
            $branchBalance = CashBalanceService::branchBalance($branchId);
        }
        $forecast = LoanSchedule::query()
            ->whereHas('loan', function ($q) use ($branchId) {
                $q->where('status', 'disbursed')
                    ->when($branchId !== null, fn($q2) => $q2->where('branch_id', $branchId));
            })
            ->where('status', '!=', 'paid')
            ->selectRaw('
        DATE_FORMAT(due_date, "%Y-%m") as period,
        SUM(total_due - paid_amount) as expected_amount
    ')
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        $today = now()->toDateString();
        $bucketsRaw = LoanSchedule::query()
            ->whereHas('loan', function ($q) use ($branchId) {
                $q->when($branchId !== null, fn($q2) => $q2->where('branch_id', $branchId));
            })
            ->where('due_date', '<', $today)
            ->whereColumn('paid_amount', '<', 'total_due')
            ->selectRaw('
            CASE
                WHEN DATEDIFF(CURDATE(), due_date) <= 30 THEN "1-30"
                WHEN DATEDIFF(CURDATE(), due_date) <= 60 THEN "31-60"
                ELSE "60+"
            END as bucket,
            SUM(total_due - paid_amount) as amount
        ')
            ->groupBy('bucket')
            ->get()
            ->keyBy('bucket');

        $bucketOrder = ['1-30' => '1–30 days', '31-60' => '31–60 days', '60+' => '60+ days'];
        $buckets = collect($bucketOrder)
            ->map(fn($label, $key) => [
                'bucket' => $label,
                'bucket_key' => $key,
                'amount' => $bucketsRaw->get($key) ? (float) $bucketsRaw->get($key)->amount : 0,
            ])
            ->values();

        $todayObj = now();
        $expected_inflow = LoanSchedule::query()
            ->whereHas('loan', function ($q) use ($branchId) {
                $q->when($branchId !== null, fn($q2) => $q2->where('branch_id', $branchId));
            })
            ->whereBetween('due_date', [$todayObj, $todayObj->copy()->addDays(90)])
            ->whereColumn('paid_amount', '<', 'total_due')
            ->sum(DB::raw('total_due - paid_amount'));
        $expected_outflow = Loan::query()
            ->when($branchId !== null, fn($q) => $q->where('branch_id', $branchId))
            ->where('status', 'approved')
            ->sum('principal_amount');

        $activeLoansCount = Loan::query()
            ->when($branchId !== null, fn($q) => $q->where('branch_id', $branchId))
            ->where('status', 'disbursed')
            ->count();
        $approvedPendingCount = Loan::query()
            ->when($branchId !== null, fn($q) => $q->where('branch_id', $branchId))
            ->where('status', 'approved')
            ->count();

        return Inertia::render('dashboard', [
            'userRole' => $user->role ?? null,
            'canViewAllBranches' => $canViewAllBranches,
            'branches' => Branch::all(['id', 'name']),
            'selectedBranch' => $branchId,
            'forecast' => $forecast,
            'buckets' => $buckets,
            'expected_inflow' => $expected_inflow,
            'expected_outflow' => $expected_outflow,
            'active_loans_count' => $activeLoansCount,
            'approved_pending_count' => $approvedPendingCount,
            'branch_balance' => $branchBalance,
        ]);
    }


    public function index(Request $request)
    {
        $canViewAllBranches = $this->canViewAllBranches();
        $user = auth()->user();

        if ($canViewAllBranches) {
            $branchId = $request->filled('branch_id') ? (int) $request->branch_id : null;
        } else {
            $branchId = $user->branch_id;
        }

        $query = CashLedger::with(['branch', 'creator']);

        if ($branchId !== null) {
            $query->where('branch_id', $branchId);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('from_date')) {
            $query->whereDate('transaction_date', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('transaction_date', '<=', $request->to_date);
        }

        $ledgers = $query
            ->orderByDesc('transaction_date')
            ->paginate(15)
            ->withQueryString();

        $totals = (clone $query)->selectRaw("
            SUM(CASE WHEN type = 'inflow' THEN amount ELSE 0 END) as total_inflow,
            SUM(CASE WHEN type = 'outflow' THEN amount ELSE 0 END) as total_outflow
        ")->first();

        $filters = [
            'branch_id' => $canViewAllBranches ? ($request->branch_id ?? null) : (string) $branchId,
            'type' => $request->type,
            'from_date' => $request->from_date,
            'to_date' => $request->to_date,
        ];

        return Inertia::render('Cash/Dashboard', [
            'ledgers' => $ledgers,
            'canViewAllBranches' => $canViewAllBranches,
            'branches' => Branch::select('id', 'name')->get(),
            'filters' => $filters,
            'totals' => [
                'inflow' => $totals->total_inflow ?? 0,
                'outflow' => $totals->total_outflow ?? 0,
                'balance' => ($totals->total_inflow ?? 0) - ($totals->total_outflow ?? 0),
            ],
        ]);
    }
    public function storeIncome(Request $request)
    {
        $data = $request->validate([
            'branch_id'        => ['required', 'exists:branches,id'],
            'amount'           => ['required', 'numeric', 'min:1'],
            'description'      => ['required', 'string'],
            'transaction_date' => ['required', 'date'],
        ]);

        DB::transaction(function () use ($data) {
            $branch = Branch::where('id', $data['branch_id'])
                ->lockForUpdate()
                ->firstOrFail();
            CashLedger::create([
                'branch_id'        => $branch->id,
                'type'             => 'inflow',
                'amount'           => $data['amount'],
                'description'      => $data['description'],
                'transaction_date' => $data['transaction_date'],
                'created_by'       => auth()->id(),
            ]);
        });

        return redirect()
            ->back()
            ->with('success', 'Income recorded successfully.');
    }
    public function storeOutcome(Request $request)
    {
        $data = $request->validate([
            'branch_id'        => ['required', 'exists:branches,id'],
            'amount'           => ['required', 'numeric', 'min:1'],
            'description'      => ['required', 'string'],
            'transaction_date' => ['required', 'date'],
        ]);

        DB::transaction(function () use ($data) {
            $branch = Branch::where('id', $data['branch_id'])
                ->lockForUpdate()
                ->firstOrFail();
            CashLedger::create([
                'branch_id'        => $branch->id,
                'type'             => 'outflow',
                'amount'           => $data['amount'],
                'description'      => $data['description'],
                'transaction_date' => $data['transaction_date'],
                'created_by'       => auth()->id(),
            ]);
        });

        return redirect()
            ->back()
            ->with('success', 'Income recorded successfully.');
    }
}
