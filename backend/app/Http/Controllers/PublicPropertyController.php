<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;

class PublicPropertyController extends Controller
{
    /* ======================================
       GET ALL PUBLIC PROPERTIES
    ====================================== */
    public function index(Request $request)
    {
        $query = Property::with('images')
            ->where('admin_status', 'accepted')
            ->where('status', 'active');

        if ($request->filled('id')) {
            $query->where('id', (int) $request->input('id'));
        }

        if ($request->filled('property_id')) {
            $query->where('id', (int) $request->input('property_id'));
        }

        if ($request->filled('area')) {
            $area = $request->input('area');
            $query->where('area', 'LIKE', "%{$area}%");
        }

        if ($request->filled('subarea')) {
            $subarea = $request->input('subarea');
            $query->where('subarea', 'LIKE', "%{$subarea}%");
        }

        if ($request->filled('category')) {
            $categoryId = $this->resolveCategoryId($request->input('category'));
            if ($categoryId) {
                $query->where('primary_category', $categoryId);
            }
        }

        if ($request->filled('q')) {
            $keyword = $request->input('q');
            $query->where(function ($q) use ($keyword) {
                $q->where('area', 'LIKE', "%{$keyword}%")
                    ->orWhere('subarea', 'LIKE', "%{$keyword}%")
                    ->orWhere('district', 'LIKE', "%{$keyword}%")
                    ->orWhere('property_type', 'LIKE', "%{$keyword}%")
                    ->orWhere('id', (int) $keyword);
            });
        }

        $properties = $query->latest()->get();

        return response()->json([
            'properties' => $properties
        ]);
    }

    private function resolveCategoryId($value): ?int
    {
        if (is_numeric($value)) {
            return (int) $value;
        }

        $map = [
            'family' => 1,
            'bachelor' => 2,
            'office' => 3,
            'sublet' => 4,
            'hostel' => 5,
        ];

        $key = strtolower(trim((string) $value));

        return $map[$key] ?? null;
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
