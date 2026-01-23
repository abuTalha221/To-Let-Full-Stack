<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;


class PropertyController extends Controller
{
    
      // Storing Properties details here
    
    public function store(Request $request)
    {
        $user = auth()->user();

        if ($user->credits < 20) {
            return response()->json([
                'status' => false,
                'message' => 'Not enough credits',
            ], 403);
        }

        $validated = $request->validate([
            'monthId' => 'required|integer',
            'primaryCategory' => 'required|integer',
            'propertyTypeId' => 'required|string',

            'bedroom' => 'required|integer|min:0',
            'bathroom' => 'required|integer|min:0',
            'balcony' => 'nullable|integer|min:0',
            'floor' => 'nullable|integer|min:0',
            'gender' => 'nullable|integer|in:1,2,3',
            'size' => 'nullable|integer|min:0',

            'area' => 'required|string|max:255',
            'subarea' => 'nullable|string|max:255',
            'sector_no' => 'nullable|string|max:50',
            'road_no' => 'nullable|string|max:50',
            'house_no' => 'nullable|string|max:50',

            'contact' => 'required|string|max:500',

            'price' => 'required|integer|min:0',
            'priceType' => 'required|in:Monthly,Weekly,Daily',

            'images' => 'nullable|array|max:10',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        DB::beginTransaction();

        try {
            $property = Property::create([
                'user_id' => $user->id,
                'month_id' => $validated['monthId'],
                'primary_category' => $validated['primaryCategory'],
                'property_type' => $validated['propertyTypeId'],

                'bedroom' => $validated['bedroom'],
                'bathroom' => $validated['bathroom'],
                'balcony' => $validated['balcony'] ?? null,
                'floor' => $validated['floor'] ?? null,
                'gender' => $validated['gender'] ?? null,
                'size' => $validated['size'] ?? null,

                'division' => 'Dhaka',
                'district' => 'Dhaka',
                'area' => $validated['area'],
                'subarea' => $validated['subarea'] ?? null,
                'sector_no' => $validated['sector_no'] ?? null,
                'road_no' => $validated['road_no'] ?? null,
                'house_no' => $validated['house_no'] ?? null,

                'contact' => $validated['contact'],

                'price' => $validated['price'],
                'price_type' => $validated['priceType'],

                'status' => 'inactive',
                'admin_status' => 'pending',

                'electricity' => $request->boolean('electricity'),
                'water' => $request->boolean('water'),
                'security' => $request->boolean('security'),
                'gas' => $request->boolean('gas'),
                'lift' => $request->boolean('lift'),
            ]);

            // Storing Images as a Path also create image path and then the path is stored in the database

            if ($request->hasFile('images')) {
                $inc = 1;
                foreach ($request->file('images') as $image) {

                    $userId = auth()->id();
                    $extension = $image->getClientOriginalExtension();
                    $timestamp = now()->format('Y-m-d_H-i-s');

                    $filename = "user_{$userId}_PropertyImage_{$inc}_{$timestamp}.{$extension}";

                    $path = $image->storeAs('properties', $filename, 'public');

                    $property->images()->create([
                        'image_path' => $path,
                    ]);
                    $inc++;
                }
            }
            
            // Deduct 20 credits from user
            $user->decrement('credits', 20);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Property created successfully',
                'property' => $property->load('images'),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Something went wrong',
            ], 500);
        }
    }

    // Edit Property Details here, first validation then update

    public function update(Request $request, $id)
    {
        $property = Property::with('images')
            ->where('id', $id)
            ->where('user_id', auth()->id())
            ->first();

        if (!$property) {
            return response()->json([
                'message' => 'Property not found'
            ], 404);
        }

        if ($property->admin_status === 'rejected') {
            return response()->json([
                'message' => 'Rejected property cannot be edited'
            ], 403);
        }

        /* ================= VALIDATION ================= */
        $validated = $request->validate([
            'monthId' => 'required|integer',
            'primaryCategory' => 'required|integer',
            'propertyTypeId' => 'required|string',

            'bedroom' => 'required|integer|min:0',
            'bathroom' => 'required|integer|min:0',
            'balcony' => 'nullable|integer|min:0',
            'floor' => 'nullable|integer|min:0',
            'gender' => 'nullable|integer|in:1,2,3',
            'size' => 'nullable|integer|min:0',

            'area' => 'required|string|max:255',
            'subarea' => 'nullable|string|max:255',
            'sector_no' => 'nullable|string|max:50',
            'road_no' => 'nullable|string|max:50',
            'house_no' => 'nullable|string|max:50',

            'contact' => 'required|string|max:500',

            'price' => 'required|integer|min:0',
            'priceType' => 'required|in:Monthly,Weekly,Daily',

            
            'electricity' => 'nullable|boolean',
            'water'       => 'nullable|boolean',
            'security'    => 'nullable|boolean',
            'gas'         => 'nullable|boolean',
            'lift'        => 'nullable|boolean',

            
            // 'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',

            'remove_images' => 'nullable|array',
            'remove_images.*' => 'integer',
        ]);

        DB::beginTransaction();

        try {
            /* ================= UPDATE PROPERTY ================= */
            $property->update([
                'month_id' => $validated['monthId'],
                'primary_category' => $validated['primaryCategory'],
                'property_type' => $validated['propertyTypeId'],

                'bedroom' => $validated['bedroom'],
                'bathroom' => $validated['bathroom'],
                'balcony' => $validated['balcony'] ?? null,
                'floor' => $validated['floor'] ?? null,
                'gender' => $validated['gender'] ?? null,
                'size' => $validated['size'] ?? null,

                'area' => $validated['area'],
                'subarea' => $validated['subarea'] ?? null,
                'sector_no' => $validated['sector_no'] ?? null,
                'road_no' => $validated['road_no'] ?? null,
                'house_no' => $validated['house_no'] ?? null,

                'contact' => $validated['contact'],
                'price' => $validated['price'],
                'price_type' => $validated['priceType'],

                
                'electricity' => $request->boolean('electricity'),
                'water'       => $request->boolean('water'),
                'security'    => $request->boolean('security'),
                'gas'         => $request->boolean('gas'),
                'lift'        => $request->boolean('lift'),
            ]);

            /* ================= REMOVE IMAGES ================= */
            if ($request->filled('remove_images')) {
                foreach ($request->remove_images as $imageId) {
                    $image = $property->images->where('id', $imageId)->first();

                    if ($image) {
                        Storage::disk('public')->delete($image->image_path);
                        $image->delete();
                    }
                }
            }

            /* ================= ADD NEW IMAGES ================= */
            if ($request->hasFile('images')) {
                $inc = 1;
                foreach ($request->file('images') as $image) {

                    $userId = auth()->id();
                    $extension = $image->getClientOriginalExtension();
                    $timestamp = now()->format('Y-m-d_H-i-s');

                    $filename = "user_{$userId}_PropertyImage_{$inc}_{$timestamp}.{$extension}";

                    $path = $image->storeAs('properties', $filename, 'public');

                    $property->images()->create([
                        'image_path' => $path,
                    ]);
                    $inc++;
                }
            }


            /* ================= RESET ADMIN STATUS ================= */
            if ($property->admin_status === 'accepted') {
                $property->update([
                    'admin_status' => 'pending',
                    'status' => 'inactive',
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Property updated successfully',
                'property' => $property->load('images'),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Show property details here

    public function show($id)
    {
        $property = Property::with('images')
            ->where('id', $id)
            ->where('user_id', auth()->id())
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



   
    public function myProperties()
    {
        $properties = Property::with('images')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return response()->json([
            'properties' => $properties,
        ]);
    }

  // Toggle Property Status here
    public function toggleStatus($id)
    {
        $property = Property::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        if ($property->admin_status !== 'accepted') {
            return response()->json([
                'message' => 'Property not approved by admin yet',
            ], 403);
        }

        $property->status =
            $property->status === 'active' ? 'inactive' : 'active';

        $property->save();

        return response()->json([
            'property_status' => $property->status,
        ]);
    }
}
