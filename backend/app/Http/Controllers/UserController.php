<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{

    // Get Logged-in User Profile
    public function profile(Request $request)
    {
        return response()->json([
            'status' => true,
            'user' => $request->user(),
        ]);
    }

    //  Change Password
    public function changePassword(Request $request)
    {
        $request->validate([
            'new_password' => ['required', 'string', 'confirmed', Password::min(6)->mixedCase()->numbers()->symbols()],
        ], [
            'new_password.required' => 'Password is required',
            'new_password.string' => 'Password must be a string',
            'new_password.confirmed' => 'Password confirmation does not match',
            'new_password' => 'Password must be at least 6 characters long and contain uppercase, lowercase, numbers, and symbols',
        ]);

        $user = $request->user();
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'status' => true,
            'message' => 'Password updated successfully!',
        ]);
    }
}
