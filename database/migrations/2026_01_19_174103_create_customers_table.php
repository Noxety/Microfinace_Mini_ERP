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
            $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('credit_level_id')->nullable()->after('branch_id')->constrained();
            $table->decimal('credit_limit', 12, 2)->default(0)->after('monthly_income');
            $table->decimal('current_loan_balance', 12, 2)->default(0)->after('credit_limit');
            $table->enum('risk_grade', ['A', 'B', 'C', 'D'])->default('C')->after('current_loan_balance');
            $table->date('limit_expired_at')->nullable()->after('risk_grade');
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
