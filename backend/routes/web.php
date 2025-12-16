<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/payment/redirect/{id}', [PaymentController::class, 'redirectToGateway'])->name('payment.redirect');

Route::match(['get','post'], '/payment/success', [PaymentController::class, 'success'])->name('payment.success');
Route::match(['get','post'], '/payment/fail',    [PaymentController::class, 'fail'])->name('payment.fail');
Route::match(['get','post'], '/payment/cancel',  [PaymentController::class, 'cancel'])->name('payment.cancel');

Route::post('/payment/ipn', [PaymentController::class, 'ipn'])->name('payment.ipn');
