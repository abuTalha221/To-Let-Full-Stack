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
            'cost' => 'required|integer',
            'contact_phone' => 'required|string',
        ]);

        $order = Order::create([
            'user_id' => auth()->id(), // null if guest
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
            'cost' => $request->cost,

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
        $order = Order::where('id', $id)
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
}
