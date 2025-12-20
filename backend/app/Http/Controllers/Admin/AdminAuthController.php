<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
    // =============================
    // 🔐 ADMIN LOGIN
    // =============================
    public function login(Request $request)
    {
        // 1️⃣ Validate input
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // 2️⃣ Find admin by email
        $admin = Admin::where('email', $request->email)->first();

        if (!$admin) {
            return response()->json([
                'status' => false,
                'message' => 'Admin email not found',
            ], 404);
        }

        // 3️⃣ Check password
        if (!Hash::check($request->password, $admin->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Incorrect password',
            ], 401);
        }

        // 4️⃣ Create Sanctum token
        $token = $admin->createToken('admin_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Admin login successful',
            'token' => $token,
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
            ],
        ], 200);
    }

    // =============================
    // 🚪 ADMIN LOGOUT
    // =============================
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => true,
            'message' => 'Admin logged out successfully',
        ]);
    }

    // =============================
    // 👤 CURRENT ADMIN
    // =============================
    public function me(Request $request)
    {
        return response()->json([
            'status' => true,
            'admin' => $request->user(),
        ]);
    }
}
