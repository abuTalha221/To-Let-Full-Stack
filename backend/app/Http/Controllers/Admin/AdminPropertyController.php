<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminPropertyController extends Controller
{
    /* =====================================================
       1️⃣ GET ALL PROPERTIES (ADMIN)
    ===================================================== */
    public function index()
    {
        $properties = Property::with('images')
            ->latest()
            ->get();

        return response()->json([
            'properties' => $properties
        ]);
    }

    /* =====================================================
       2️⃣ SHOW SINGLE PROPERTY (ADMIN DETAILS PAGE)
    ===================================================== */
    public function show($id)
    {
        $property = Property::with('images')->find($id);

        if (!$property) {
            return response()->json([
                'message' => 'Property not found'
            ], 404);
        }

        return response()->json([
            'property' => $property
        ]);
    }

    /* =====================================================
       3️⃣ UPDATE ADMIN STATUS
       (pending / accepted / rejected)
    ===================================================== */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'admin_status' => 'required|in:pending,accepted,rejected'
        ]);

        $property = Property::find($id);

        if (!$property) {
            return response()->json([
                'message' => 'Property not found'
            ], 404);
        }

        /* 🔥 ADMIN STATUS */
        $property->admin_status = $request->admin_status;

        /* 🔥 AUTO HANDLE PROPERTY STATUS */
        if ($request->admin_status === 'accepted') {
            // ✅ AUTO ACTIVATE WHEN APPROVED
            $property->status = 'active';
        } else {
            // ❌ pending or rejected → inactive
            $property->status = 'inactive';
        }

        $property->save();

        return response()->json([
            'message' => 'Property status updated successfully',
            'property' => $property
        ]);
    }

    /* =====================================================
       4️⃣ DELETE PROPERTY (ADMIN)
    ===================================================== */
    public function destroy($id)
    {
        $property = Property::with('images')->find($id);

        if (!$property) {
            return response()->json([
                'message' => 'Property not found'
            ], 404);
        }

        /* 🔥 DELETE IMAGES FROM STORAGE */
        foreach ($property->images as $image) {
            if ($image->image_path) {
                Storage::disk('public')->delete($image->image_path);
            }
        }

        /* 🔥 DELETE PROPERTY */
        $property->delete();

        return response()->json([
            'message' => 'Property deleted successfully'
        ]);
    }
}
