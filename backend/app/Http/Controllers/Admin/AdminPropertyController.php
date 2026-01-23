<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminPropertyController extends Controller
{
    // Get all properties for admin

    public function index()
    {
        $properties = Property::with('images')
            ->latest()
            ->get();

        return response()->json([
            'properties' => $properties
        ]);
    }

    // Show single property for admin details page

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

    // Update property admin status
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

        // Update admin status
        $property->admin_status = $request->admin_status;

        // Auto handle property status
        if ($request->admin_status === 'accepted') {
            // AUTO ACTIVATE WHEN APPROVED
            $property->status = 'active';
        } else {
            // pending or rejected → inactive
            $property->status = 'inactive';
        }

        $property->save();

        return response()->json([
            'message' => 'Property status updated successfully',
            'property' => $property
        ]);
    }

    // Delete property
    public function destroy($id)
    {
        $property = Property::with('images')->find($id);

        if (!$property) {
            return response()->json([
                'message' => 'Property not found'
            ], 404);
        }

        // Delete images from storage
        foreach ($property->images as $image) {
            if ($image->image_path) {
                Storage::disk('public')->delete($image->image_path);
            }
        }

        // Delete property
        $property->delete();

        return response()->json([
            'message' => 'Property deleted successfully'
        ]);
    }
}
