<?php

use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\AssignmentSubmissionController;
use App\Http\Controllers\Auth\SocialLoginController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CashDashboardController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CreditLevelController;
use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\LocationController;
use App\Http\Middleware\AdminOnly;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/offline', function () {
    return view('offline');
});

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');
Route::get('auth/google', [SocialLoginController::class, 'redirectToGoogle'])->name('google.login');
Route::get('auth/google/callback', [SocialLoginController::class, 'handleGoogleCallback']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware(['auth'])->get('/api/rooms/{roomId}/messages', [ChatController::class, 'messages'])->name('chat.messages');
    Route::get('/rooms/{roomId}', [ChatController::class, 'show'])
        ->name('rooms.show');
    Route::post('/chat/send', [ChatController::class, 'send'])->name('chat.send');
    Route::get('dashboard',  [CashDashboardController::class , 'dashboard'])->name('dashboard');
    Route::middleware([AdminOnly::class])->group(function () {
        Route::get('cash-dashboard', [CashDashboardController::class, 'index'])->name('cash.dashboard');
        Route::post('loans/approve', [LoanController::class, 'approve'])->name('loans.approve');
        Route::post('loans/disburse', [LoanController::class, 'disburse'])->name('loans.disburse');
        Route::post('loans/preview', [LoanController::class, 'preview'])->name('loans.preview');
        Route::get('loans/{loan}/approve', [LoanController::class, 'approve'])->name('loans.approve');
        Route::post('loans/{loan}/disburse', [LoanController::class, 'disburse'])->name('loans.disburse');
        Route::post('repayments/{loanSchedule}', [LoanController::class, 'repayments'])->name('loans.repayments');
        Route::resource('users', UserController::class);
        Route::resource('roles', RoleController::class);
        Route::resource('permissions', PermissionController::class);
        Route::resource('departments', DepartmentController::class);
        Route::resource('branches', BranchController::class);
        Route::resource('creditlevels', CreditLevelController::class);
        Route::resource('loans', LoanController::class);

        Route::resource('locations', LocationController::class);
        Route::resource('currencies', CurrencyController::class);
        Route::resource('customers', CustomerController::class);

        Route::get('admin/dashboard', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('admin.dashboard');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
