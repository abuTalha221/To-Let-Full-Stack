<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CreditController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PublicPropertyController;
use App\Http\Controllers\PropertyUnlockController;

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminPropertyController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminPaymentController;

/*
|--------------------------------------------------------------------------
| PUBLIC API ROUTES
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-otp', [AuthController::class, 'verifyEmailOtp']);
Route::post('/resend-otp', [AuthController::class, 'resendOtp']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/admin/login', [AdminAuthController::class, 'login']);

Route::get('/public-properties', [PublicPropertyController::class, 'index']);
Route::get('/public-properties/{id}', [PublicPropertyController::class, 'show']);

// Test mail route
Route::get('/test-mail', function() {
    try {
        $otp = '123456';
        \Illuminate\Support\Facades\Mail::to('test@example.com')->send(new \App\Mail\EmailOtpMail($otp));
        return response()->json(['status' => true, 'message' => 'Mail sent! Check Mailtrap inbox.']);
    } catch (\Exception $e) {
        return response()->json(['status' => false, 'error' => $e->getMessage()], 500);
    }
});

/*
|--------------------------------------------------------------------------
| SSLCommerz CALLBACK ROUTES (PUBLIC, NO AUTH, NO CSRF)
|--------------------------------------------------------------------------
*/

Route::post('/payment/success', [PaymentController::class, 'success']);
Route::post('/payment/fail', [PaymentController::class, 'fail']);
Route::post('/payment/cancel', [PaymentController::class, 'cancel']);

/*
|--------------------------------------------------------------------------
| AUTHENTICATED API ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::post('/user/change-password', [UserController::class, 'changePassword']);

    Route::post('/buy-credits', [CreditController::class, 'buy']);
    Route::get('/credits', [CreditController::class, 'credits']);

    // ✅ PAYMENT ROUTES
    Route::post('/initiate-ssl-payment', [PaymentController::class, 'initiatePayment']);
    Route::post('/initiate-order-payment', [PaymentController::class, 'initiateOrderPayment']);

    Route::get('/transactions/{id}', [PaymentController::class, 'transactionStatus']);

    Route::post('/order-property', [OrderController::class, 'store']);
    Route::get('/my-orders', [OrderController::class, 'myOrders']);
    Route::get('/my-orders/{id}', [OrderController::class, 'show']);

    Route::post('/properties', [PropertyController::class, 'store']);
    Route::get('/my-properties', [PropertyController::class, 'myProperties']);
    Route::get('/properties/{id}', [PropertyController::class, 'show']);
    Route::put('/properties/{id}', [PropertyController::class, 'update']);
    Route::patch('/properties/{id}/toggle-status', [PropertyController::class, 'toggleStatus']);

    Route::get('/properties/{id}/unlock-status', [PropertyUnlockController::class, 'status']);
    Route::post('/properties/{id}/unlock', [PropertyUnlockController::class, 'unlock']);

    Route::get('/user/unlocked', [PropertyUnlockController::class, 'index']);
});

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware('auth:admin')->prefix('admin')->group(function () {

    Route::post('/logout', [AdminAuthController::class, 'logout']);
    Route::get('/me', [AdminAuthController::class, 'me']);
    Route::get('/dashboard', [AdminDashboardController::class, 'index']);

    Route::get('/users', [AdminUserController::class, 'index']);
    Route::get('/users/{id}', [AdminUserController::class, 'show']);
    Route::patch('/users/{id}/block', [AdminUserController::class, 'block']);
    Route::patch('/users/{id}/unblock', [AdminUserController::class, 'unblock']);

    Route::get('/orders', [AdminOrderController::class, 'index']);
    Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
    Route::patch('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);

    Route::get('/properties', [AdminPropertyController::class, 'index']);
    Route::get('/properties/{id}', [AdminPropertyController::class, 'show']);
    Route::patch('/properties/{id}/status', [AdminPropertyController::class, 'updateStatus']);
    Route::delete('/properties/{id}', [AdminPropertyController::class, 'destroy']);

    Route::get('/payments', [AdminPaymentController::class, 'index']);
    Route::get('/payments/{id}', [AdminPaymentController::class, 'show']);
    Route::get('/payments-stats/gateway', [AdminPaymentController::class, 'gatewayStats']);
});
