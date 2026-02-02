<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\CreditLevel;
use App\Models\Customer;
use App\Models\CustomerAddress;
use App\Models\CustomerDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customers = Customer::with(['addresses', 'branch', 'creditLevel'])->latest()->paginate(10);

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
        $request->validate([
            'avatar' => 'nullable|image|max:2048',
            'document_files' => 'nullable|array',
            'document_files.*' => 'file|max:5120',
            'document_types' => 'nullable|array',
            'document_types.*' => 'nullable|string|max:100',
        ]);

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
            $nrc = $request->nrc;
            $lastSixNrc = substr(preg_replace('/\D/', '', $nrc), -6);
            preg_match('/\/([A-Za-z]+)\(/', $nrc, $matches);
            $middleRaw = $matches[1] ?? '';

            $middleNrc = implode('', array_map(
                fn($m) => strtoupper($m[0]),
                preg_split('/(?=[A-Z])/', $middleRaw, -1, PREG_SPLIT_NO_EMPTY)
            ));

            $avatarPath = null;
            if ($request->hasFile('avatar')) {
                $avatarPath = $request->file('avatar')->store('customers/avatars', 'public');
            }

            $customer = Customer::create([
                'branch_id' => $request->branch,
                'credit_level_id' => $request->creditlevel,
                'limit_expired_at' => $request->limit_expired_at,
                'customer_no' => $initials  . '-' . $middleNrc . $lastSixNrc,
                'name' => $request->name,
                'nrc' => $request->nrc,
                'phone' => $request->phone,
                'email' => $request->email,
                'avatar' => $avatarPath,
                'dob' => $request->date_of_birth,
                'gender' => $request->gender,
                'occupation' => $request->occupation,
                'monthly_income' => $request->monthly_income,
                'remark' => $request->remark,
                'status' => "active",
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

            if ($request->hasFile('document_files')) {
                $types = $request->input('document_types', []);
                foreach ($request->file('document_files') as $index => $file) {
                    $path = $file->store('customers/documents', 'public');
                    $customer->documents()->create([
                        'type' => $types[$index] ?? 'attachment',
                        'file_path' => $path,
                        'uploaded_by' => auth()->id(),
                    ]);
                }
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
        $customer = Customer::with([
            'branch.location',
            'creditLevel',
            'documents',
            'loans' => fn($q) => $q->with('branch')->orderByDesc('created_at'),
            'addresses' => fn($q) => $q->latest()->limit(1),
        ])->findOrFail($id);

        return Inertia::render('Customer/Show', [
            'customer' => $customer,
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer)
    {
        return Inertia::render('Customer/Edit', [
            'customer' => $customer->load([
                'branch',
                'creditLevel',
                'documents',
                'addresses' => fn($q) => $q->latest()->limit(1),
            ]),
            'branches' => Branch::with('location')->get(),
            'creditlevel' => CreditLevel::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'avatar' => 'nullable|image|max:2048',
            'document_files' => 'nullable|array',
            'document_files.*' => 'file|max:5120',
            'document_types' => 'nullable|array',
            'document_types.*' => 'nullable|string|max:100',
        ]);

        DB::transaction(function () use ($request, $id) {
            $customer = Customer::findOrFail($id);

            $avatarPath = $customer->avatar;
            if ($request->hasFile('avatar')) {
                if ($customer->avatar && Storage::disk('public')->exists($customer->avatar)) {
                    Storage::disk('public')->delete($customer->avatar);
                }
                $avatarPath = $request->file('avatar')->store('customers/avatars', 'public');
            }

            $customer->update([
                'branch_id' => $request->branch,
                'credit_level_id' => $request->creditlevel,
                'limit_expired_at' => $request->limit_expired_at,
                'name' => $request->name,
                'nrc' => $request->nrc,
                'phone' => $request->phone,
                'email' => $request->email,
                'avatar' => $avatarPath,
                'dob' => $request->date_of_birth,
                'gender' => $request->gender,
                'occupation' => $request->occupation,
                'monthly_income' => $request->monthly_income,
                'remark' => $request->remark,
            ]);

            if ($request->address) {
                $parts = array_map('trim', explode(',', $request->address));

                CustomerAddress::updateOrCreate(
                    [
                        'customer_id' => $customer->id,
                        'type' => 'current',
                    ],
                    [
                        'address_line' => $request->address,
                        'township' => $parts[0] ?? null,
                        'district' => $parts[1] ?? null,
                        'region' => $parts[2] ?? null,
                    ]
                );
            }

            if ($request->hasFile('document_files')) {
                $types = $request->input('document_types', []);
                foreach ($request->file('document_files') as $index => $file) {
                    $path = $file->store('customers/documents', 'public');
                    $customer->documents()->create([
                        'type' => $types[$index] ?? 'attachment',
                        'file_path' => $path,
                        'uploaded_by' => auth()->id(),
                    ]);
                }
            }
        });

        return redirect()
            ->route('customers.index')
            ->with('success', 'Customer updated successfully');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
