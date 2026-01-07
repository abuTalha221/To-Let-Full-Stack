<?php

namespace App\Http\Controllers;

use App\Models\Property;

class PublicPropertyController extends Controller
{
    /* ======================================
       GET ALL PUBLIC PROPERTIES
    ====================================== */
    public function index()
    {
        $properties = Property::with('images')
            ->where('admin_status', 'accepted')
            ->where('status', 'active')
            ->latest()
            ->get();

        return response()->json([
            'properties' => $properties
        ]);
    }

    /* ======================================
       GET SINGLE PUBLIC PROPERTY
    ====================================== */
    public function show($id)
    {
        $property = Property::with('images')
            ->where('id', $id)
            ->where('admin_status', 'accepted')
            ->where('status', 'active')
            ->first();

        if (!$property) {
            return response()->json([
                'message' => 'Property not found'
            ], 404);
        }

        return response()->json([
            'property' => $property
        ]);
    }
}
