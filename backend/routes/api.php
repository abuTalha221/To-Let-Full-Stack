<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CreditController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PropertyController;

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminPropertyController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-otp', [AuthController::class, 'verifyEmailOtp']);
Route::post('/resend-otp', [AuthController::class, 'resendOtp']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/admin/login', [AdminAuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| USER ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::post('/user/change-password', [UserController::class, 'changePassword']);

    Route::post('/buy-credits', [CreditController::class, 'buy']);
    Route::get('/credits', [CreditController::class, 'credits']);

    Route::post('/initiate-ssl-payment', [PaymentController::class, 'initiatePayment']);

    Route::post('/order-property', [OrderController::class, 'store']);
    Route::get('/my-orders', [OrderController::class, 'myOrders']);
    Route::get('/my-orders/{id}', [OrderController::class, 'show']);

    // Properties (User)
    Route::post('/properties', [PropertyController::class, 'store']);
    Route::get('/my-properties', [PropertyController::class, 'myProperties']);
    Route::get('/properties/{id}', [PropertyController::class, 'show']);
    Route::patch('/properties/{id}/toggle-status', [PropertyController::class, 'toggleStatus']);
    Route::put('/properties/{id}', [PropertyController::class, 'update']);
});

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES (🔥 SEPARATE GUARD)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:admin')->prefix('admin')->group(function () {

    Route::post('/logout', [AdminAuthController::class, 'logout']);
    Route::get('/me', [AdminAuthController::class, 'me']);
    Route::get('/dashboard', [AdminDashboardController::class, 'index']);

    // Orders
    Route::get('/orders', [AdminOrderController::class, 'index']);
    Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
    Route::patch('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);


    Route::get('/properties', [AdminPropertyController::class, 'index']);
    Route::get('/properties/{id}', [AdminPropertyController::class, 'show']);
    Route::patch('/properties/{id}/status', [AdminPropertyController::class, 'updateStatus']);
    Route::delete('/properties/{id}', [AdminPropertyController::class, 'destroy']);


});
