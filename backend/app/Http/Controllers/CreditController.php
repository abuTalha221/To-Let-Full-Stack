<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class CreditController extends Controller
{
    // Buy credits API (Dummy for now)
    public function buy(Request $request)
    {
        $request->validate([
            'credits' => 'required|integer|min:1',
        ]);

        $user = $request->user();
        $user->credits += $request->credits;
        $user->save();

        return response()->json([
            'message' => 'Credits added successfully',
            'total_credits' => $user->credits
        ]);
    }

    // Fetch current credits
    public function credits(Request $request)
    {
        return response()->json([
            'credits' => $request->user()->credits
        ]);
    }
}
