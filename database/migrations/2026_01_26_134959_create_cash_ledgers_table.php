<?php

use Illuminate\Database\Eloquent\SoftDeletes;
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
        Schema::create('cash_ledgers', function (Blueprint $table) {
            $table->id();

            $table->foreignId('branch_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->enum('type', ['inflow', 'outflow']);

            $table->decimal('amount', 14, 2);

            $table->foreignId('loan_transaction_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->string('description')->nullable();

            $table->date('transaction_date');

            $table->foreignId('created_by')
                ->constrained('users');

            $table->timestamps();
            $table->softDeletes();
            $table->index(['branch_id', 'transaction_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cash_ledgers');
    }
};
