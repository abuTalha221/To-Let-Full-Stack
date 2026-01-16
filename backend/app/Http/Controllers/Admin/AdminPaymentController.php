<?php

namespace App\Http\Controllers\Admin;

use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AdminPaymentController extends Controller
{
    /**
     * Get all transactions/payments
     */
    public function index(Request $request)
    {
        $search = $request->query('search', '');
        $status = $request->query('status', 'all');
        $gateway = $request->query('gateway', 'all');

        $query = Transaction::with('user');

        // Search by transaction ID or user name
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('transaction_id', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%")
                               ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by status
        if ($status !== 'all') {
            $query->where('status', $status);
        }

        // Filter by payment gateway
        if ($gateway !== 'all') {
            $query->where('payment_gateway', $gateway);
        }

        $transactions = $query->orderBy('created_at', 'desc')->get();

        // Calculate statistics
        $stats = [
            'total_transactions' => Transaction::count(),
            'total_amount' => Transaction::sum('amount'),
            'total_credits_sold' => Transaction::sum('credits'),
            'successful_transactions' => Transaction::where('status', 'success')->count(),
            'pending_transactions' => Transaction::where('status', 'pending')->count(),
            'failed_transactions' => Transaction::where('status', 'failed')->count(),
        ];

        return response()->json([
            'success' => true,
            'transactions' => $transactions,
            'stats' => $stats,
        ]);
    }

    /**
     * Get single transaction details
     */
    public function show($id)
    {
        $transaction = Transaction::with('user')->findOrFail($id);

        return response()->json([
            'success' => true,
            'transaction' => $transaction,
        ]);
    }

    /**
     * Get payment gateway statistics
     */
    public function gatewayStats()
    {
        $stats = Transaction::selectRaw('payment_gateway, COUNT(*) as count, SUM(amount) as total_amount, SUM(credits) as total_credits')
            ->groupBy('payment_gateway')
            ->get();

        return response()->json([
            'success' => true,
            'gateway_stats' => $stats,
        ]);
    }

}
