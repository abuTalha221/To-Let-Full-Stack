<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyUnlock;
use Illuminate\Http\Request;

class PropertyUnlockController extends Controller
{
    public function unlock(Property $property, Request $request)
    {
        $user = $request->user();

        // ❌ Owner doesn't need unlock
        if ($property->user_id === $user->id) {
            return response()->json([
                'message' => 'You already own this property',
                'unlocked' => true,
            ]);
        }

        // ✅ Already unlocked
        $alreadyUnlocked = PropertyUnlock::where([
            'user_id' => $user->id,
            'property_id' => $property->id,
        ])->exists();

        if ($alreadyUnlocked) {
            return response()->json([
                'message' => 'Already unlocked',
                'unlocked' => true,
            ]);
        }

        // ❌ Not enough credits
        if ($user->credits < 10) {
            return response()->json([
                'message' => 'Not enough credits',
            ], 403);
        }

        // 🔥 Deduct credits
        $user->decrement('credits', 10);

        // 🔓 Unlock property
        PropertyUnlock::create([
            'user_id' => $user->id,
            'property_id' => $property->id,
        ]);

        return response()->json([
            'message' => 'Property unlocked successfully',
            'unlocked' => true,
        ]);
    }
}
