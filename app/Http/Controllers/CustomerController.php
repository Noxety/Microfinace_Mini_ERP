<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\CreditLevel;
use App\Models\Customer;
use App\Models\CustomerAddress;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use League\OAuth1\Client\Credentials\Credentials;
use Spatie\Permission\Models\Role;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customers = Customer::with(['addresses'])->latest()->paginate(10);

        return Inertia::render('Customer/Index', [
            'customers' => $customers,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $branches = Branch::with('location')->get();
        $creditlevel = CreditLevel::all();
        return Inertia::render('Customer/Create', [
            'branches' => $branches,
            'creditlevel' => $creditlevel,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        DB::transaction(function () use ($request) {
            $name = trim($request->name);
            if (str_contains($name, ' ')) {
                $parts = preg_split('/\s+/', $name);
                $firstInitial = strtoupper(substr($parts[0], 0, 1));
                $lastInitial  = strtoupper(substr(end($parts), 0, 1));
            } else {
                preg_match_all('/[A-Z]/', $name, $matches);

                if (count($matches[0]) >= 2) {
                    $firstInitial = strtoupper($matches[0][0]);
                    $lastInitial  = strtoupper($matches[0][1]);
                } else {
                    $firstInitial = strtoupper(substr($name, 0, 1));
                    $lastInitial  = '';
                }
            }

            $initials = $lastInitial ? $firstInitial . $lastInitial : $firstInitial;

            $lastSixNrc = substr(preg_replace('/\D/', '', $request->nrc), -6);
            $customer = Customer::create([
                'branch_id' => $request->branch,
                'credit_level_id' => $request->creditlevel,
                'limit_expired_at' => $request->limit_expired_at,
                'customer_no' => $initials  . '-' . $lastSixNrc,
                'name' => $request->name,
                'nrc' => $request->nrc,
                'phone' => $request->phone,
                'email' => $request->email,
                'dob' => $request->date_of_birth,
                'gender' => $request->gender,
                'occupation' => $request->occupation,
                'monthly_income' => $request->monthly_income,
                'remark' => $request->remark,
                'created_by' => auth()->id(),
            ]);
            if ($request->address) {
                $parts = array_map('trim', explode(',', $request->address));

                CustomerAddress::create([
                    'customer_id' => $customer->id,
                    'type' => 'current',
                    'address_line' => $request->address,
                    'township' => $parts[0] ?? null,
                    'district' => $parts[1] ?? null,
                    'region' => $parts[2] ?? null,
                ]);
            }
        });

        return redirect()
            ->route('customers.index')
            ->with('success', 'Customer created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $user)
    {
        $user->load(['addresses']);

        return Inertia::render('Customer/Edit', [
            'user' => $user,
            'roles' => Role::all(),
            'departments' => Department::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
