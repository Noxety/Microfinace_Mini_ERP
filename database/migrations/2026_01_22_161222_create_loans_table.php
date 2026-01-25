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
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('branch_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('credit_level_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->string('loan_no')->unique();
            $table->decimal('principal_amount', 14, 2);
            $table->decimal('interest_rate', 5, 2); // % per period
            $table->integer('term');                // total installments
            $table->enum('repayment_type', [
                'daily',
                'weekly',
                'monthly'
            ]);
            $table->decimal('total_interest', 14, 2)->default(0);
            $table->decimal('total_payable', 14, 2)->default(0);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->date('disbursed_at')->nullable();
            $table->enum('status', [
                'pending',
                'approved',
                'active',
                'completed',
                'overdue',
                'cancelled',
                'disbursed',
            ])->default('pending');
            $table->foreignId('created_by')
                ->constrained('users');

            $table->foreignId('approved_by')
                ->nullable()
                ->constrained('users');

            $table->text('remark')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};
