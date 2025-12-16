<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CreditController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\AdminAuthController;

/*
|--------------------------------------------------------------------------
| 🌐 Public Routes (NO LOGIN REQUIRED)
|--------------------------------------------------------------------------
*/

// 🔹 Register (creates user + sends OTP)
Route::post('/register', [AuthController::class, 'register']);

// 🔹 Verify Email OTP
Route::post('/verify-otp', [AuthController::class, 'verifyEmailOtp']);

// 🔁 Resend OTP (protected against abuse)
Route::post('/resend-otp', [AuthController::class, 'resendOtp']);

// 🔹 Login (ONLY if email is verified)
Route::post('/login', [AuthController::class, 'login']);

// Admin Login
Route::post('/admin/login', [AdminAuthController::class, 'login']);


/*
|--------------------------------------------------------------------------
| 🔒 Protected Routes (LOGIN REQUIRED)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // 🔐 Auth
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // 👤 User Profile
    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::post('/user/change-password', [UserController::class, 'changePassword']);

    // 💳 Credits
    Route::post('/buy-credits', [CreditController::class, 'buy']);
    Route::get('/credits', [CreditController::class, 'credits']);

    // 💰 Payments
    Route::post('/initiate-ssl-payment', [PaymentController::class, 'initiatePayment'])
        ->name('payment.initiate');
});
