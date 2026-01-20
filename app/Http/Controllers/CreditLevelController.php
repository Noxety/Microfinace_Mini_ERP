<?php

namespace App\Http\Controllers;

use App\Models\CreditLevel;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CreditLevelController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    public function index()
    {
        $creditlevel = CreditLevel::latest()->paginate(10);

        return Inertia::render('CreditLevel/Index', [
            'creditlevel' => $creditlevel,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'nullable|string|max:1000',
            'name' => 'required|string|max:255',
            'min_amount' => 'required',
            'max_amount' => 'required',
            'max_term' => 'nullable',
            'interest_rate' => 'nullable',
            'is_default' => 'required',
        ]);

        CreditLevel::create($validated);

        return redirect()->route('creditlevels.index')->with('success', 'Credit Level created successfully.');
    }

    public function update(Request $request, CreditLevel $creditlevel)
    {
        $validated = $request->validate([
            'description' => 'nullable',
            'name' => 'nullable|string|max:255',
            'min_amount' => 'nullable',
            'max_amount' => 'nullable',
            'max_term' => 'nullable',
            'interest_rate' => 'nullable',
            'is_default' => 'nullable',
        ]);
        $creditlevel->update($validated);
        return redirect()->route('creditlevels.index')->with('success', 'Credit Level updated successfully.');
    }

    public function destroy(CreditLevel $creditlevel)
    {
        $creditlevel->delete();

        return redirect()->route('creditlevels.index')->with('success', 'Credit Level deleted successfully.');
    }
}
