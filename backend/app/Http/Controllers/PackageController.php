<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Package;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use App\Models\PackageDetail;

class PackageController extends Controller
{
    // Get all packages
    public function index()
    {
        $packages = Package::all();

        $packages->map(function ($package) {
            // Handle image URL
            if ($package->pkg_image_path) {
                $package->pkg_image_url = asset('storage/' . $package->pkg_image_path);
            }
            // Handle tour category field
            if ($package->tour_category) {
                $package->tour_category_name = $package->tour_category;  // For clarity, if needed
            }
            return $package;
        });

        return response()->json($packages, Response::HTTP_OK);
    }

    // Create a new package
    public function store(Request $request)
    {
        $validated = $request->validate([
            'package_name' => 'required|string|max:255',
            'package_description' => 'nullable|string',
            'package_type' => 'required|string|max:100',
            'package_price' => 'required|numeric',
            'duration' => 'nullable|string|max:50',
            'pkg_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status_id' => 'required|exists:statuses,id',
            'tour_category' => 'nullable|string|max:255',  // Validate tour category
            'discount' => 'nullable|numeric|min:0|max:100',  // Validate discount
        ]);

        $imagePath = null;
        if ($request->hasFile('pkg_image')) {
            $image = $request->file('pkg_image');
            $imagePath = $image->store('images/packages', 'public');
        }

        $package = Package::create([
            'package_name' => $validated['package_name'],
            'package_description' => $validated['package_description'] ?? null,
            'package_type' => $validated['package_type'],
            'package_price' => $validated['package_price'],
            'duration' => $validated['duration'] ?? null,
            'pkg_image_path' => $imagePath,
            'status_id' => $validated['status_id'],
            'tour_category' => $validated['tour_category'] ?? null,  // Store tour category
            'discount' => $validated['discount'] ?? null,  // Store discount
        ]);

        return response()->json($package, Response::HTTP_CREATED);
    }

    // Show a single package
    public function show($id)
    {
        $package = Package::find($id);
        if (!$package) {
            return response()->json(['message' => 'Package not found'], Response::HTTP_NOT_FOUND);
        }

        // Handle image URL
        if ($package->pkg_image_path) {
            $package->pkg_image_url = asset('storage/' . $package->pkg_image_path);
        }

        // Handle tour category
        if ($package->tour_category) {
            $package->tour_category_name = $package->tour_category;
        }

        return response()->json($package, Response::HTTP_OK);
    }

    // Update an existing package
    public function update(Request $request, $id)
    {
        $package = Package::find($id);
        if (!$package) {
            return response()->json(['message' => 'Package not found'], Response::HTTP_NOT_FOUND);
        }

        $validated = $request->validate([
            'package_name' => 'required|string|max:255',
            'package_description' => 'nullable|string',
            'package_type' => 'required|string|max:100',
            'package_price' => 'required|numeric',
            'duration' => 'nullable|string|max:50',
            'pkg_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status_id' => 'required|exists:statuses,id',
            'tour_category' => 'nullable|string|max:255',  // Validate tour category
            'discount' => 'nullable|numeric|min:0|max:100',  // Validate discount
        ]);

        // Handle image upload if provided
        if ($request->hasFile('pkg_image')) {
            $image = $request->file('pkg_image');
            $imagePath = $image->store('images/packages', 'public');
            $validated['pkg_image_path'] = $imagePath;
        }

        // Update package
        $package->update($validated);

        return response()->json($package, Response::HTTP_OK);
    }

    // Delete a package
    public function destroy($id)
    {
        $package = Package::find($id);
        if (!$package) {
            return response()->json(['message' => 'Package not found'], Response::HTTP_NOT_FOUND);
        }

        if ($package->pkg_image_path) {
            Storage::disk('public')->delete($package->pkg_image_path);
        }

        $package->delete();

        return response()->json(['message' => 'Package deleted successfully'], Response::HTTP_OK);
    }

    // Get the package detail for a specific package
    public function getDetails($id)
    {
        try {
            $detail = PackageDetail::with('package')->where('package_id', $id)->first();

            if (!$detail) {
                return response()->json(['message' => 'Package details not found.'], 404);
            }

            // Add image URL to package if exists
            if ($detail->package && $detail->package->pkg_image_path) {
                $detail->package->pkg_image_url = asset('storage/' . $detail->package->pkg_image_path);
            }

            return response()->json($detail, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching package details.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function count()
    {
        $count = Package::count();
        return response()->json(['count' => $count]);
    }

}
