<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Store new order
     */
    public function store(Request $request)
    {
        $request->validate([
            'division' => 'required|string',
            'district' => 'required|string',
            'area' => 'required|string',
            'category' => 'required|string',
            'room' => 'required|integer',
            'move_in_month' => 'required|integer',
            'budget' => 'required|integer',
            'package_code' => 'required|string',
            'contact_phone' => 'required|string',
        ]);

        // Enforce cost based on package_code (server-side authoritative)
        $cost = $this->packageCost($request->package_code);

        $order = Order::create([
            'user_id' => auth()->id(), 
            'division' => $request->division,
            'district' => $request->district,
            'area' => $request->area,
            'subarea' => $request->subarea,

            'category' => $request->category,
            'room' => $request->room,
            'move_in_month' => $request->move_in_month,
            'budget' => $request->budget,
            'details' => $request->details,

            'package_code' => $request->package_code,
            'cost' => $cost,

            'contact_name' => $request->contact_name,
            'contact_phone' => $request->contact_phone,
            'contact_email' => $request->contact_email,

            'payment_status' => 'unpaid',
            'payment_method' => null,
            'transaction_id' => null,

            'status' => 'pending',
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Order submitted successfully',
            'order' => [
                'id' => $order->id,
                'amount' => $order->cost,
                'payment_status' => $order->payment_status,
            ],
        ], 201);
    }

    /**
     * Get logged-in user's orders
     */
    public function myOrders(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'status' => true,
            'orders' => $orders,
        ]);
    }

    /**
     * View single order
     */
    public function show($id)
    {
        // Return order with related transactions so invoice can show payment history
        $order = Order::with('transactions')
            ->where('id', $id)
            ->where('user_id', auth()->id())
            ->first();

        if (!$order) {
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'order' => $order
        ]);
    }

    /**
     * Map package code to server-side cost. Default: 1000 BDT
     */
    private function packageCost($packageCode)
    {
        // For now the platform uses a fixed package price of 1000 BDT for all packages.
        // This method centralizes pricing in case it needs to change later.
        $default = 1000;

        $prices = [
            'basic' => 1000,
            'standard' => 1000,
            'premium' => 1000,
        ];

        return $prices[$packageCode] ?? $default;
    }
}
