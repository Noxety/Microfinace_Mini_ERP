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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->integer('branch_id')->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('credit_level_id')->nullable();
            $table->decimal('credit_limit', 12, 2)->default(0);
            $table->decimal('current_loan_balance', 12, 2)->default(0);
            $table->enum('risk_grade', ['A', 'B', 'C', 'D'])->default('C');
            $table->date('limit_expired_at')->nullable();
            $table->string('customer_no')->unique();
            $table->string('name');
            $table->string('nrc')->nullable();
            $table->string('phone')->nullable();
            $table->date('dob')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->string('occupation')->nullable();
            $table->decimal('monthly_income', 12, 2)->nullable();
            $table->enum('status', ['pending', 'active', 'blacklisted', 'closed'])->default('pending');
            $table->text('remark')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
