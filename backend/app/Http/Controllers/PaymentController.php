<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    protected $store_id;
    protected $store_passwd;
    protected $is_sandbox;

    public function __construct()
    {
        $config = config('services.sslcommerz', []);

        $this->store_id = $config['store_id'] ?? env('SSL_COMMERZ_STORE_ID', env('SSLCOMMERZ_STORE_ID'));
        $this->store_passwd = $config['store_password'] ?? env('SSL_COMMERZ_STORE_PASSWORD', env('SSLCOMMERZ_STORE_PASSWORD'));

        $sandboxFromConfig = $config['sandbox'] ?? null;
        $sandboxFromEnv = env('SSL_COMMERZ_SANDBOX', env('SSLCOMMERZ_SANDBOX', true));
        $this->is_sandbox = filter_var($sandboxFromConfig ?? $sandboxFromEnv, FILTER_VALIDATE_BOOLEAN);

        Log::info('PaymentController initialized', [
            'store_id_found' => !empty($this->store_id),
            'is_sandbox' => $this->is_sandbox,
        ]);
    }

    public function initiatePayment(Request $request)
    {
        $request->validate([
            'package_name' => 'required|string',
            'credits' => 'required|integer|min:1',
            'amount' => 'required|numeric|min:0.01',
            'cus_phone' => 'nullable|string',
        ]);

        $user = $request->user();
        $packageName = $request->package_name;
        $credits = (int) $request->credits;
        $amount = (float) $request->amount;

        $tran_id = 'tolet_' . Str::random(8) . '_' . time();

        // create transaction record (pending) - include transaction_id immediately
        $transaction = Transaction::create([
            'user_id' => $user->id ?? null,
            'package_name' => $packageName,
            'credits' => $credits,
            'amount' => $amount,
            'status' => 'pending',
            'payment_gateway' => 'sslcommerz',
            'transaction_id' => $tran_id,
        ]);

        $cusPhone = $request->input('cus_phone') ?? ($user->phone ?? null);
        if (empty($cusPhone)) {
            $cusPhone = '01700000000';
        }

        $post_data = [
            'store_id'        => $this->store_id,
            'store_passwd'    => $this->store_passwd,
            'total_amount'    => round($amount, 2),
            'currency'        => 'BDT',
            'tran_id'         => $tran_id,

            'success_url' => rtrim(config('app.url'), '/') . '/payment/success',
            'fail_url'    => rtrim(config('app.url'), '/') . '/payment/fail',
            'cancel_url'  => rtrim(config('app.url'), '/') . '/payment/cancel',
            'emi_option'  => 0,

            'cus_name'     => $user->name ?? $request->input('cus_name', 'Guest'),
            'cus_email'    => $user->email ?? $request->input('cus_email', 'guest@example.com'),
            'cus_add1'     => $request->input('cus_add1', ''),
            'cus_city'     => $request->input('cus_city', ''),
            'cus_country'  => $request->input('cus_country', 'Bangladesh'),
            'cus_phone'    => $cusPhone,

            'shipping_method' => 'NO',
            'ship_name'       => $user->name ?? $request->input('ship_name', ''),
            'ship_add1'       => $request->input('ship_add1', ''),
            'ship_city'       => $request->input('ship_city', ''),
            'ship_country'    => $request->input('ship_country', 'Bangladesh'),

            'product_name'     => $packageName,
            'product_category' => $request->input('product_category', 'Credits'),
            'product_profile'  => $request->input('product_profile', 'non-physical'),

            'value_a'      => $transaction->id,
        ];

        $api_url = $this->is_sandbox
            ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
            : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';

        Log::info('SSLCommerz initiate payload', [
            'api_url' => $api_url,
            'post_data_preview' => [
                'store_id_present' => !empty($post_data['store_id']),
                'total_amount' => $post_data['total_amount'],
                'tran_id' => $post_data['tran_id'],
                'cus_phone' => $post_data['cus_phone'],
            ],
        ]);

        try {
            if ($this->is_sandbox) {
                $response = Http::withoutVerifying()->timeout(15)->asForm()->post($api_url, $post_data);
            } else {
                $response = Http::timeout(15)->asForm()->post($api_url, $post_data);
            }
        } catch (\Throwable $e) {
            Log::error('SSLCommerz HTTP error', ['exception' => $e->getMessage()]);
            $transaction->update(['status' => 'failed', 'raw_response' => $e->getMessage()]);
            return response()->json([
                'status' => false,
                'message' => 'Failed to connect to payment gateway',
                'detail' => $e->getMessage(),
            ], 500);
        }

        if ($response->failed()) {
            $transaction->update([
                'status' => 'failed',
                'raw_response' => $response->body(),
            ]);

            Log::error('SSLCommerz initiate failed', [
                'response' => $response->body(),
                'transaction_id' => $tran_id,
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Failed to connect to payment gateway',
                'detail' => $response->body(),
            ], 500);
        }

        $data = $response->json();

        $transaction->update([
            'raw_response' => $data,
        ]);

        if (!empty($data['GatewayPageURL'])) {
            // primary: tell frontend to go directly to gateway URL
            return response()->json([
                'status' => true,
                'GatewayPageURL' => $data['GatewayPageURL'],
                'gateway_redirect' => rtrim(config('app.url'), '/') . '/payment/redirect/' . $transaction->id,
                'transaction_id' => $transaction->id,
            ]);
        }

        $transaction->update(['status' => 'failed']);

        return response()->json([
            'status' => false,
            'message' => $data,
        ], 500);
    }

    public function redirectToGateway(Request $request, $id)
    {
        $transaction = Transaction::find($id);
        if (! $transaction) {
            abort(404, 'Transaction not found');
        }

        if ($request->user() && $transaction->user_id && $request->user()->id !== $transaction->user_id) {
            abort(403, 'Forbidden');
        }

        $raw = $transaction->raw_response ?? [];
        $gatewayUrl = null;
        if (is_array($raw) && !empty($raw['GatewayPageURL'])) {
            $gatewayUrl = $raw['GatewayPageURL'];
        } elseif (is_string($raw)) {
            $decoded = json_decode($raw, true);
            if (is_array($decoded) && !empty($decoded['GatewayPageURL'])) {
                $gatewayUrl = $decoded['GatewayPageURL'];
            }
        }

        if (! $gatewayUrl) {
            return view('payment.no-gateway', ['transaction' => $transaction]);
        }

        return view('payment.redirect', ['gateway' => $gatewayUrl, 'transaction' => $transaction]);
    }

    public function success(Request $request)
    {
        // TEMP DEBUG: log everything so we can inspect incoming callback (remove later)
        Log::info('DEBUG: ssl success callback received', [
            'method' => $request->method(),
            'path' => $request->path(),
            'full_url' => $request->fullUrl(),
            'headers' => $request->headers->all(),
            'cookies' => $request->cookies->all(),
            'body' => $request->all(),
            'raw' => $request->getContent(),
        ]);

        $val_id = $request->input('val_id');
        $tran_id = $request->input('tran_id');
        $internalId = $request->input('value_a') ?? null;

        // if no val_id, we still log and redirect to failure (validator cannot run)
        if (! $val_id) {
            Log::warning('SSLCommerz success callback missing val_id', [
                'tran_id' => $tran_id,
                'value_a' => $internalId,
                'payload' => $request->all(),
            ]);
            return redirect()->to(env('FRONTEND_URL') . '/payment-failed?reason=no_val_id');
        }

        $verify = $this->verifyTransaction($val_id);

        if (! $verify['ok']) {
            return redirect()->to(env('FRONTEND_URL') . '/payment-failed?reason=' . urlencode($verify['message']));
        }

        $transaction = null;
        if ($internalId) {
            $transaction = Transaction::find($internalId);
        }
        if (! $transaction && $tran_id) {
            $transaction = Transaction::where('transaction_id', $tran_id)->first();
        }

        if (! $transaction) {
            return redirect()->to(env('FRONTEND_URL') . '/payment-failed?reason=transaction_not_found');
        }

        $validated = $verify['data'] ?? [];
        $paidAmount = isset($validated['amount']) ? floatval($validated['amount']) : (isset($validated['total_amount']) ? floatval($validated['total_amount']) : null);
        $paidCurrency = $validated['currency'] ?? ($validated['currency_type'] ?? 'BDT');

        if ($paidAmount !== null) {
            $expected = floatval($transaction->amount);
            if (abs($paidAmount - $expected) > 0.01 || strtoupper($paidCurrency) !== strtoupper($transaction->currency ?? 'BDT')) {
                Log::warning('Payment validation mismatch', [
                    'transaction_id' => $transaction->id,
                    'expected_amount' => $expected,
                    'paid_amount' => $paidAmount,
                    'expected_currency' => $transaction->currency ?? 'BDT',
                    'paid_currency' => $paidCurrency,
                    'validation' => $validated,
                ]);

                $transaction->update(['status' => 'failed', 'raw_response' => $validated]);

                return redirect()->to(env('FRONTEND_URL') . '/payment-failed?reason=' . urlencode('payment_amount_mismatch'));
            }
        }

        $transaction->update([
            'status' => 'success',
            'raw_response' => $validated,
            'transaction_id' => $tran_id,
        ]);

        $user = $transaction->user;
        if ($user) {
            $user->credits = ($user->credits ?? 0) + $transaction->credits;
            $user->save();
        }

        return redirect()->to(env('FRONTEND_URL') . '/payment-success?credits=' . $transaction->credits);
    }

    public function fail(Request $request)
    {
        $tran_id = $request->input('tran_id');
        $internalId = $request->input('value_a');

        if ($internalId) {
            $t = Transaction::find($internalId);
            if ($t) $t->update(['status' => 'failed', 'raw_response' => $request->all()]);
        }

        if ($tran_id && empty($internalId)) {
            $t = Transaction::where('transaction_id', $tran_id)->first();
            if ($t) $t->update(['status' => 'failed', 'raw_response' => $request->all()]);
        }

        return redirect()->to(env('FRONTEND_URL') . '/payment-failed');
    }

    public function cancel(Request $request)
    {
        return $this->fail($request);
    }

    public function ipn(Request $request)
    {
        $val_id = $request->input('val_id');
        $verify = $this->verifyTransaction($val_id);
        return response('IPN processed', 200);
    }

    protected function verifyTransaction($val_id)
    {
        if (!$val_id) {
            return ['ok' => false, 'message' => 'No val_id supplied', 'data' => null];
        }

        $validator_url = $this->is_sandbox
            ? 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php'
            : 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';

        try {
            $response = Http::timeout(15)->get($validator_url, [
                'val_id' => $val_id,
                'store_id' => $this->store_id,
                'store_passwd' => $this->store_passwd,
                'v' => 1,
                'format' => 'json',
            ]);
        } catch (\Throwable $e) {
            Log::error('SSLCommerz validation HTTP error', ['exception' => $e->getMessage()]);
            return ['ok' => false, 'message' => 'Validation API failed', 'data' => null];
        }

        if ($response->failed()) {
            Log::error('SSLCommerz validation failed', ['body' => $response->body()]);
            return ['ok' => false, 'message' => 'Validation API failed', 'data' => null];
        }

        $data = $response->json();

        if (isset($data['status']) && in_array(strtoupper($data['status']), ['VALID', 'VALIDATED', 'SUCCESS'])) {
            return ['ok' => true, 'message' => 'Validated', 'data' => $data];
        }

        return ['ok' => false, 'message' => ($data['status'] ?? 'not_valid'), 'data' => $data];
    }
}
