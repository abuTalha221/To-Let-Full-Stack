<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Transaction;
use App\Models\User;

class PaymentController extends Controller
{
    /**
     * Get the frontend URL for redirects
     */
    private function getFrontendUrl()
    {
        return env('FRONTEND_URL', 'http://localhost:5173');
    }

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

        // ✅ 3. Generate transaction ID
        $transactionId = 'TXN_' . time();

        // ✅ 4. Get authenticated user
        $user = auth()->user();
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not authenticated',
            ], 401);
        }

        // ✅ 5. Save transaction record to database BEFORE redirecting
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'package_name' => $request->package_name,
            'credits' => $request->credits,
            'amount' => $request->amount,
            'payment_gateway' => 'sslcommerz',
            'transaction_id' => $transactionId,
            'status' => 'pending',
        ]);

        // ✅ 6. Prepare post data with CORRECT callback URLs
        $post_data = [
            'store_id'     => env('SSLCOMMERZ_STORE_ID'),
            'store_passwd' => env('SSLCOMMERZ_STORE_PASSWORD'),
            'total_amount' => (float) $request->amount,
            'currency'     => 'BDT',
            'tran_id'      => $transactionId,

            // ✅ CRITICAL: Routes in api.php have /api prefix
            'success_url' => 'http://127.0.0.1:8000/api/payment/success',
            'fail_url'    => 'http://127.0.0.1:8000/api/payment/fail',
            'cancel_url'  => 'http://127.0.0.1:8000/api/payment/cancel',

            // ✅ REQUIRED even for digital products
            'shipping_method' => 'NO',

            // customer
            'cus_name'    => $user->name ?? 'User',
            'cus_email'   => $user->email,
            'cus_phone'   => '01700000000',
            'cus_add1'    => 'Dhaka',
            'cus_city'    => 'Dhaka',
            'cus_country' => 'Bangladesh',

            // product
            'product_name'     => $request->package_name,
            'product_category' => 'Credits',
            'product_profile'  => 'non-physical',
        ];

        // ✅ 7. Sandbox or Live URL
        $api_url = env('SSLCOMMERZ_SANDBOX', true)
            ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
            : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';

        // ✅ 8. Call SSLCommerz (sandbox fix applied)
        try {
            $response = Http::withoutVerifying()
                ->timeout(20)
                ->asForm()
                ->post($api_url, $post_data);
        } catch (\Exception $e) {
            // Mark transaction as failed if SSLCommerz connection fails
            $transaction->update(['status' => 'failed']);
            return response()->json([
                'status' => false,
                'message' => 'SSLCommerz connection failed',
                'error' => $e->getMessage(),
            ], 500);
        }

        // ✅ 9. Handle failure
        if ($response->failed()) {
            $transaction->update(['status' => 'failed']);
            return response()->json([
                'status' => false,
                'message' => 'SSLCommerz request failed',
                'response' => $response->body(),
            ], 500);
        }

        // ✅ 10. Return FULL SSL response to frontend and include server transaction id
        $resp = $response->json();
        $resp['transaction_id'] = $transactionId;
        $resp['server_transaction_id'] = $transactionId;
        return response()->json($resp);
    }

    // ✅ INITIATE ORDER PAYMENT
    public function initiateOrderPayment(Request $request)
    {
        // ✅ 1. Validate frontend data
        $request->validate([
            'order_id' => 'required|integer',
        ]);

        // ✅ 2. Check credentials
        if (!env('SSLCOMMERZ_STORE_ID') || !env('SSLCOMMERZ_STORE_PASSWORD')) {
            return response()->json([
                'status' => false,
                'message' => 'SSLCommerz credentials missing in .env',
            ], 500);
        }

        // ✅ 3. Get authenticated user
        $user = auth()->user();
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not authenticated',
            ], 401);
        }

        // ✅ 4. Find the order
        $order = \App\Models\Order::where('id', $request->order_id)
            ->where('user_id', $user->id)
            ->first();

        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Order not found',
            ], 404);
        }

        if ($order->payment_status === 'paid') {
            return response()->json([
                'status' => false,
                'message' => 'Order is already paid',
            ], 400);
        }

        // ✅ 5. Generate transaction ID
        $transactionId = 'ORD_' . $order->id . '_' . time();

        // ✅ 6. Save transaction record
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'package_name' => 'Order #' . $order->id,
            'credits' => 0,
            'amount' => $order->cost,
            'payment_gateway' => 'sslcommerz',
            'transaction_id' => $transactionId,
            'status' => 'pending',
            'order_id' => $order->id,
        ]);

        // ✅ 7. Prepare post data
        $post_data = [
            'store_id'     => env('SSLCOMMERZ_STORE_ID'),
            'store_passwd' => env('SSLCOMMERZ_STORE_PASSWORD'),
            'total_amount' => (float) $order->cost,
            'currency'     => 'BDT',
            'tran_id'      => $transactionId,

            'success_url' => 'http://127.0.0.1:8000/api/payment/success',
            'fail_url'    => 'http://127.0.0.1:8000/api/payment/fail',
            'cancel_url'  => 'http://127.0.0.1:8000/api/payment/cancel',

            'shipping_method' => 'NO',

            'cus_name'    => $user->name ?? 'User',
            'cus_email'   => $user->email,
            'cus_phone'   => '01700000000',
            'cus_add1'    => 'Dhaka',
            'cus_city'    => 'Dhaka',
            'cus_country' => 'Bangladesh',

            'product_name'     => 'Order #' . $order->id,
            'product_category' => 'Order Payment',
            'product_profile'  => 'non-physical',
        ];

        // ✅ 8. Sandbox or Live URL
        $api_url = env('SSLCOMMERZ_SANDBOX', true)
            ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
            : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';

        // ✅ 9. Call SSLCommerz
        try {
            $response = Http::withoutVerifying()
                ->timeout(20)
                ->asForm()
                ->post($api_url, $post_data);
        } catch (\Exception $e) {
            $transaction->update(['status' => 'failed']);
            return response()->json([
                'status' => false,
                'message' => 'SSLCommerz connection failed',
                'error' => $e->getMessage(),
            ], 500);
        }

        // ✅ 10. Handle failure
        if ($response->failed()) {
            $transaction->update(['status' => 'failed']);
            return response()->json([
                'status' => false,
                'message' => 'SSLCommerz request failed',
                'response' => $response->body(),
            ], 500);
        }

        // ✅ 11. Return SSL response and include our server transaction_id for client-side polling
        $resp = $response->json();
        $resp['transaction_id'] = $transactionId;
        $resp['server_transaction_id'] = $transactionId;
        return response()->json($resp);
    }

    // ✅ SUCCESS: Backend receives callback, then redirects to frontend
    public function success(Request $request)
    {
        try {
            // ✅ Get transaction ID from SSLCommerz callback
            $transactionId = $request->tran_id;
            
            \Log::info('Payment success callback received:', [
                'tran_id' => $transactionId,
                'status' => $request->status,
            ]);

            // ✅ Find transaction record
            $transaction = Transaction::where('transaction_id', $transactionId)->first();
            
            if (!$transaction) {
                \Log::warning('Transaction not found for tran_id: ' . $transactionId);
                return redirect($this->getFrontendUrl() . '/user/credits?payment_status=failed&message=Transaction%20not%20found');
            }

            // ✅ Mark transaction as success
            $transaction->update([
                'status' => 'success',
                'raw_response' => $request->all(),
            ]);

            // ✅ Add credits to user (for credit purchases)
            if ($transaction->credits > 0) {
                $user = $transaction->user;
                if ($user) {
                    $user->increment('credits', $transaction->credits);
                    \Log::info('Credits added to user', [
                        'user_id' => $user->id,
                        'credits' => $transaction->credits,
                    ]);
                }
                // Redirect to credits page
                $redirectUrl = $this->getFrontendUrl() . '/user/credits?payment_status=success&message=Credits%20added%20successfully';
            } else {
                // For order payments, update order status
                if ($transaction->order_id) {
                    $order = \App\Models\Order::find($transaction->order_id);
                    if ($order) {
                        $order->update(['payment_status' => 'paid']);
                        \Log::info('Order marked as paid', [
                            'order_id' => $order->id,
                        ]);
                    }
                }
                // Redirect to my orders page
                $redirectUrl = $this->getFrontendUrl() . '/user/orders?payment_status=success&message=Order%20paid%20successfully';
            }

            \Log::info('Payment completed successfully for transaction: ' . $transactionId);

            // ✅ Redirect to appropriate page
            return redirect($redirectUrl);

        } catch (\Exception $e) {
            \Log::error('Payment success error: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return redirect($this->getFrontendUrl() . '/user/credits?payment_status=failed&message=Error%20processing%20payment');
        }
    }

    // ❌ FAIL: Backend receives callback, then redirects to frontend
    public function fail(Request $request)
    {
        try {
            $transactionId = $request->tran_id ?? null;
            
            if ($transactionId) {
                $transaction = Transaction::where('transaction_id', $transactionId)->first();
                if ($transaction) {
                    $transaction->update([
                        'status' => 'failed',
                        'raw_response' => $request->all(),
                    ]);
                }
            }
            
            \Log::warning('Payment failed: ' . json_encode($request->all()));
        } catch (\Exception $e) {
            \Log::error('Payment fail error: ' . $e->getMessage());
        }
        
        return redirect($this->getFrontendUrl() . '/user/credits?payment_status=failed&message=Payment%20failed');
    }

    // ❌ CANCEL: Backend receives callback, then redirects to frontend
    public function cancel(Request $request)
    {
        $transactionId = $request->tran_id ?? null;
        
        if ($transactionId) {
            $transaction = Transaction::where('transaction_id', $transactionId)->first();
            if ($transaction) {
                $transaction->update([
                    'status' => 'cancelled',
                    'raw_response' => $request->all(),
                ]);
            }
        }
        
        return redirect($this->getFrontendUrl() . '/user/credits?payment_status=cancelled&message=Payment%20cancelled');
    }
}