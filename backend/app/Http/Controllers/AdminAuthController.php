<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        // Validate
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Find admin
        $admin = User::where('email', $request->email)
            ->where('is_admin', true)
            ->first();

        if (!$admin) {
            return response()->json([
                'status' => false,
                'message' => 'Admin not found',
            ], 404);
        }

        if (!Hash::check($request->password, $admin->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Incorrect password',
            ], 401);
        }

        // Create token
        $token = $admin->createToken('admin_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Admin login successful',
            'token' => $token,
            'admin' => $admin,
        ]);
    }
}
