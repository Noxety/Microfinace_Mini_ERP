<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\CashLedger;
use App\Models\Loan;
use App\Models\LoanSchedule;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CashDashboardController extends Controller
{

    public function dashboard(Request $request)
    {
        $branchId = $request->branch_id ?? auth()->user()->branch_id;
        $forecast = LoanSchedule::query()
            ->whereHas('loan', function ($q) use ($branchId) {
                $q->where('status', 'disbursed')
                    ->when($branchId, fn($q2) => $q2->where('branch_id', $branchId));
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
        $buckets = LoanSchedule::query()
            ->whereHas('loan', function ($q) use ($branchId) {
                if ($branchId) $q->where('branch_id', $branchId);
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
            ->get();

        $today = now();
        $expected_inflow = LoanSchedule::query()
            ->whereHas('loan', function ($q) use ($branchId) {
                if ($branchId) $q->where('branch_id', $branchId);
            })
            ->whereBetween('due_date', [$today, $today->copy()->addDays(90)])
            ->whereColumn('paid_amount', '<', 'total_due')
            ->sum(DB::raw('total_due - paid_amount'));
        $expected_outflow = Loan::query()
            ->when($branchId, fn($q) => $q->where('branch_id', $branchId))
            ->where('status', 'approved')
            ->sum('principal_amount');

        return Inertia::render('dashboard', [
            'userRole' => auth()->user()->role,
            'branches' => Branch::all(['id', 'name']),
            'selectedBranch' => $branchId,
            'forecast' => $forecast,
            'buckets' => $buckets,
            'expected_inflow' => $expected_inflow,
            'expected_outflow' => $expected_outflow,
        ]);
    }


    public function index(Request $request)
    {
        $query = CashLedger::with(['branch', 'creator']);

        // Filters
        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->branch_id);
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

        // Totals
        $totals = (clone $query)->selectRaw("
            SUM(CASE WHEN type = 'inflow' THEN amount ELSE 0 END) as total_inflow,
            SUM(CASE WHEN type = 'outflow' THEN amount ELSE 0 END) as total_outflow
        ")->first();

        return Inertia::render('Cash/Dashboard', [
            'ledgers' => $ledgers,
            'branches' => Branch::select('id', 'name')->get(),
            'filters' => $request->only([
                'branch_id',
                'type',
                'from_date',
                'to_date',
            ]),
            'totals' => [
                'inflow' => $totals->total_inflow ?? 0,
                'outflow' => $totals->total_outflow ?? 0,
                'balance' => ($totals->total_inflow ?? 0) - ($totals->total_outflow ?? 0),
            ],
        ]);
    }
}
