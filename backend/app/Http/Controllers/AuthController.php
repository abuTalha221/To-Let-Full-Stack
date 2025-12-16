<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class AuthController extends Controller
{
    const OTP_EXPIRY = 600;       // 10 minutes
    const RESEND_COOLDOWN = 60;   // 60 seconds

    // =============================
    // 🔹 REGISTER (SEND OTP)
    // =============================
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:6|confirmed',
        ]);

        // Check existing user
        $user = User::where('email', $validated['email'])->first();

        // Already verified → must login
        if ($user && $user->email_verified_at) {
            return response()->json([
                'status' => false,
                'message' => 'Email already registered. Please login.',
            ], 409);
        }

        $otp = (string) rand(100000, 999999);

        // If exists but not verified → resend OTP
        if ($user) {
            $user->update([
                'email_otp' => $otp,
                'email_otp_expires_at' => Carbon::now()->addSeconds(self::OTP_EXPIRY),
                'updated_at' => now(),
            ]);
        } else {
            // Create new user
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'email_otp' => $otp,
                'email_otp_expires_at' => Carbon::now()->addSeconds(self::OTP_EXPIRY),
            ]);
        }

        // Send OTP email
        Mail::send('emails.otp', compact('otp', 'user'), function ($message) use ($user) {
            $message->to($user->email)
                    ->subject('Verify Your Email - To Let');
        });

        return response()->json([
            'status' => true,
            'message' => 'OTP sent to your email',
            'user_id' => $user->id,
            'email' => $user->email,
        ], 201);
    }

    // =============================
    // 🔹 VERIFY EMAIL OTP
    // =============================
    public function verifyEmailOtp(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'otp' => 'required|digits:6',
        ]);

        $user = User::findOrFail($request->user_id);

        if ($user->email_otp !== $request->otp) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid OTP',
            ], 400);
        }

        if (Carbon::now()->gt($user->email_otp_expires_at)) {
            return response()->json([
                'status' => false,
                'message' => 'OTP expired',
            ], 400);
        }

        // Verify email
        $user->update([
            'email_verified_at' => now(),
            'email_otp' => null,
            'email_otp_expires_at' => null,
        ]);

        // Send success email
        Mail::send('emails.registration-success', compact('user'), function ($message) use ($user) {
            $message->to($user->email)
                    ->subject('Welcome to To Let 🎉');
        });

        // Login token
        $token = $user->createToken('tolet_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Email verified successfully',
            'user' => $user,
            'token' => $token,
        ]);
    }

    // =============================
    // 🔁 RESEND OTP (PROPERLY FIXED)
    // =============================
    public function resendOtp(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = User::findOrFail($request->user_id);

        if ($user->email_verified_at) {
            return response()->json([
                'status' => false,
                'message' => 'Email already verified',
            ], 400);
        }

        // ⏳ Cooldown check (NOT OTP expiry)
        if ($user->updated_at->addSeconds(self::RESEND_COOLDOWN)->gt(now())) {
            return response()->json([
                'status' => false,
                'message' => 'Please wait before requesting a new OTP',
            ], 429);
        }

        $otp = (string) rand(100000, 999999);

        $user->update([
            'email_otp' => $otp,
            'email_otp_expires_at' => Carbon::now()->addSeconds(self::OTP_EXPIRY),
            'updated_at' => now(),
        ]);

        Mail::send('emails.otp', compact('otp', 'user'), function ($message) use ($user) {
            $message->to($user->email)
                    ->subject('Resend OTP - To Let');
        });

        return response()->json([
            'status' => true,
            'message' => 'OTP resent successfully',
        ]);
    }

    // =============================
    // 🔹 LOGIN
    // =============================
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Email not registered',
            ], 404);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Incorrect password',
            ], 401);
        }

        if (!$user->email_verified_at) {
            return response()->json([
                'status' => false,
                'message' => 'Please verify your email first',
            ], 403);
        }

        $token = $user->createToken('tolet_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user,
        ]);
    }

    // =============================
    // 🔹 LOGOUT
    // =============================
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    // =============================
    // 🔹 AUTH USER
    // =============================
    public function user(Request $request)
    {
        return response()->json([
            'status' => true,
            'user' => $request->user(),
        ]);
    }
}
