<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\Property;
use App\Models\Transaction;

class AdminDashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => true,

            // 🔢 COUNTS
            'stats' => [
                'total_users' => User::count(),
                'total_orders' => Order::count(),
                'total_properties' => Property::count(),
                'total_payments' => Transaction::count(),
            ],

            // 👤 RECENT USERS
            'recent_users' => User::latest()
                ->take(5)
                ->get(['id', 'name', 'created_at']),

            // 🛒 RECENT ORDERS
            'recent_orders' => Order::latest()
                ->take(5)
                ->get(['id', 'area', 'district', 'status']),
        ]);
    }
}
