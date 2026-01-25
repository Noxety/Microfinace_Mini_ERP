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
        Schema::create('loan_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->integer('installment_no');
            $table->date('due_date');
            $table->decimal('principal_due', 14, 2);
            $table->decimal('interest_due', 14, 2);
            $table->decimal('total_due', 14, 2);
            $table->decimal('paid_amount', 14, 2)->default(0);
            $table->date('paid_date')->nullable();
            $table->enum('status', [
                'pending',
                'paid',
                'partial',
                'overdue'
            ])->default('pending');
            $table->decimal('penalty_amount', 12, 2)->default(0);
            $table->integer('overdue_days')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_schedules');
    }
};
