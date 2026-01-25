<?php

namespace Database\Seeders;

use App\Models\PenaltyRule;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PenaltyRuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PenaltyRule::query()->update(['is_active' => false]);

        PenaltyRule::create([
            'rate_type' => 'percentage', // percentage | fixed
            'rate' => 1.0,               // 1% per day
            'grace_days' => 3,           // 3 days grace
            'is_active' => true,
        ]);

        // Optional future rules (inactive)
        PenaltyRule::create([
            'rate_type' => 'flat',
            'rate' => 1000,              // 1000 MMK per day
            'grace_days' => 0,
            'is_active' => false,
        ]);
    }
}
