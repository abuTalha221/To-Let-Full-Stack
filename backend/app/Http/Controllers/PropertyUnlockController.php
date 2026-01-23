<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyUnlock;
use Illuminate\Http\Request;

class PropertyUnlockController extends Controller
{
    public function status($id, Request $request)
    {
        $user = $request->user();

        // ensure property exists
        $property = Property::find($id);
        if (!$property) {
            return response()->json([
                'message' => 'Property not found',
            ], 404);
        }

        // If not authenticated, return defaults (frontend will ignore)
        if (!$user) {
            return response()->json([
                'is_owner' => false,
                'is_unlocked' => false,
                'credits' => null,
            ]);
        }

        $isOwner = $property->user_id === $user->id;

        $isUnlocked = $isOwner || PropertyUnlock::where([
            'user_id' => $user->id,
            'property_id' => $property->id,
        ])->exists();

        return response()->json([
            'is_owner' => $isOwner,
            'is_unlocked' => $isUnlocked,
            'credits' => $user->credits ?? 0,
        ]);
    }

    public function index(Request $request)
    {
        $user = $request->user();

        // return unlocked properties for current user
        $properties = $user->unlockedProperties()
            ->with('images')
            ->latest('property_unlocks.created_at')
            ->get();

        return response()->json([
            'properties' => $properties,
        ]);
    }

    public function unlock($id, Request $request)
    {
        $user = $request->user();

        // ensure property exists
        $property = Property::find($id);
        if (!$property) {
            return response()->json([
                'message' => 'Property not found',
            ], 404);
        }

        if ($property->user_id === $user->id) {
            return response()->json([
                'message' => 'You already own this property',
                'unlocked' => true,
            ]);
        }

        //  Already unlocked
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

        //  Not enough credits
        if ($user->credits < 10) {
            return response()->json([
                'message' => 'Not enough credits',
            ], 403);
        }

        // Use transaction to deduct credits and create unlock atomically
        \DB::beginTransaction();
        try {
            // refresh user to avoid race conditions
            $user->refresh();

            if ($user->credits < 10) {
                \DB::rollBack();
                return response()->json([
                    'message' => 'Not enough credits',
                ], 403);
            }
            // 10 credits decrement here, i can change it later
            $user->decrement('credits', 10);

            // Unlock property
            PropertyUnlock::create([
                'user_id' => $user->id,
                'property_id' => $property->id,
            ]);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'message' => 'Failed to unlock property',
            ], 500);
        }

        return response()->json([
            'message' => 'Property unlocked successfully',
            'unlocked' => true,
        ]);
    }
}
