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
        Schema::create('loan_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('customer_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('branch_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('loan_schedule_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->foreignId('repayment_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->string('trx_no')->unique();
            $table->enum('trx_type', [
                'disbursement',
                'repayment',
                'interest',
                'penalty',
                'adjustment',
                'reversal'
            ]);

            $table->enum('direction', ['debit', 'credit']);
            $table->decimal('amount', 14, 2);
            $table->decimal('balance', 14, 2);
            $table->date('trx_date');
            $table->text('remark')->nullable();
            $table->foreignId('created_by')
                ->constrained('users');
            $table->softDeletes();
            $table->timestamps();
            $table->index(['loan_id', 'trx_date']);
            $table->index(['customer_id', 'trx_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_transactions');
    }
};
