<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;

Route::get('/', function () {
    return view('welcome');
});

// ONLY user browser redirect (optional)
Route::get(
    '/payment/redirect/{id}',
    [PaymentController::class, 'redirectToGateway']
)->name('payment.redirect');
