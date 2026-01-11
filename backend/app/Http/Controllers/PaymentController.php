<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PaymentController extends Controller
{
    public function initiatePayment(Request $request)
    {
        // ✅ 1. Validate frontend data
        $request->validate([
            'package_name' => 'required|string',
            'credits' => 'required|integer',
            'amount' => 'required|numeric|min:1',
        ]);

        // ✅ 2. Check credentials first (VERY IMPORTANT)
        if (!env('SSLCOMMERZ_STORE_ID') || !env('SSLCOMMERZ_STORE_PASSWORD')) {
            return response()->json([
                'status' => false,
                'message' => 'SSLCommerz credentials missing in .env',
            ], 500);
        }

        // ✅ 3. Frontend URL for redirects
        $frontendUrl = 'http://localhost:5173';

        // ✅ 4. Prepare post data with CORRECT callback URLs
        $post_data = [
            'store_id'     => env('SSLCOMMERZ_STORE_ID'),
            'store_passwd' => env('SSLCOMMERZ_STORE_PASSWORD'),
            'total_amount' => (float) $request->amount,
            'currency'     => 'BDT',
            'tran_id'      => 'TXN_' . time(),

            // ✅ CRITICAL: Routes in api.php have /api prefix
            'success_url' => 'http://127.0.0.1:8000/api/payment/success',
            'fail_url'    => 'http://127.0.0.1:8000/api/payment/fail',
            'cancel_url'  => 'http://127.0.0.1:8000/api/payment/cancel',

            // ✅ REQUIRED even for digital products
            'shipping_method' => 'NO',

            // customer
            'cus_name'    => 'Test User',
            'cus_email'   => 'test@test.com',
            'cus_phone'   => '01700000000',
            'cus_add1'    => 'Dhaka',
            'cus_city'    => 'Dhaka',
            'cus_country' => 'Bangladesh',

            // product
            'product_name'     => $request->package_name,
            'product_category' => 'Credits',
            'product_profile'  => 'non-physical',
        ];

        // ✅ 5. Sandbox or Live URL
        $api_url = env('SSLCOMMERZ_SANDBOX', true)
            ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
            : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';

        // ✅ 6. Call SSLCommerz (sandbox fix applied)
        try {
            $response = Http::withoutVerifying()
                ->timeout(20)
                ->asForm()
                ->post($api_url, $post_data);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'SSLCommerz connection failed',
                'error' => $e->getMessage(),
            ], 500);
        }

        // ✅ 7. Handle failure
        if ($response->failed()) {
            return response()->json([
                'status' => false,
                'message' => 'SSLCommerz request failed',
                'response' => $response->body(),
            ], 500);
        }

        // ✅ 8. Return FULL SSL response to frontend
        return response()->json($response->json());
    }

    // ✅ SUCCESS: Backend receives callback, then redirects to frontend
    public function success(Request $request)
    {
        // TODO: Save transaction data here before redirecting
        // $transactionId = $request->tran_id;
        // $amount = $request->amount;
        // Save to database...

        return redirect('http://localhost:5173/payment-success');
    }

    // ❌ FAIL: Backend receives callback, then redirects to frontend
    public function fail(Request $request)
    {
        // TODO: Log failed transaction
        
        return redirect('http://localhost:5173/payment-failed');
    }

    // ❌ CANCEL: Backend receives callback, then redirects to frontend
    public function cancel(Request $request)
    {
        // TODO: Log cancelled transaction
        
        return redirect('http://localhost:5173/payment-cancel');
    }
}