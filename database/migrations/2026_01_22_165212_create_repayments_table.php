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
        Schema::create('repayments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('loan_schedule_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->foreignId('customer_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('branch_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('collected_by')
                ->constrained('users');
            $table->decimal('amount', 14, 2);
            $table->enum('payment_method', [
                'cash',
                'bank',
                'mobile'
            ])->default('cash');
            $table->date('payment_date');
            $table->decimal('principal_paid', 14, 2)->nullable();
            $table->decimal('interest_paid', 14, 2)->nullable();
            $table->decimal('penalty_paid', 14, 2)->default(0);
            $table->enum('status', [
                'posted',
                'reversed'
            ])->default('posted');
            $table->text('remark')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('repayments');
    }
};
