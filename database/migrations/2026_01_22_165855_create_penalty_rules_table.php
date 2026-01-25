<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('penalty_rules', function (Blueprint $table) {
            $table->id();

            $table->foreignId('credit_level_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->enum('rate_type', [
                'flat',          // fixed amount
                'percentage',    // % of installment
                'daily_interest' // % per overdue day
            ]);

            $table->decimal('rate', 8, 2); 
            $table->unsignedInteger('grace_days')->default(0);

            $table->boolean('is_active')->default(true);

            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penalty_rules');
    }
};
