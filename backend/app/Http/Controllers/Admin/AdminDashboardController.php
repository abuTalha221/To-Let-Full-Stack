<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;

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
