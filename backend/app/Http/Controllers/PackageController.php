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
            if ($package->pkg_image_path) {
                $package->pkg_image_url = asset('storage/' . $package->pkg_image_path);
            }
            if ($package->tour_category) {
                $package->tour_category_name = $package->tour_category;
            }
            return $package;
        });

        return response()->json($packages, Response::HTTP_OK);
    }

    // Store a new package
    public function store(Request $request)
    {
        $validated = $this->validatePackage($request);

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
            'tour_category' => $validated['tour_category'] ?? null,
            'discount' => $validated['discount'] ?? null,
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

        if ($package->pkg_image_path) {
            $package->pkg_image_url = asset('storage/' . $package->pkg_image_path);
        }

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

        $validated = $this->validatePackage($request);

        if ($request->hasFile('pkg_image')) {
            $image = $request->file('pkg_image');
            $imagePath = $image->store('images/packages', 'public');
            $validated['pkg_image_path'] = $imagePath;
        }

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

    // Get package detail
    public function getDetails($id)
    {
        try {
            $detail = PackageDetail::with('package')->where('package_id', $id)->first();

            if (!$detail) {
                return response()->json(['message' => 'Package details not found.'], 404);
            }

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

    // Count total packages
    public function count()
    {
        $count = Package::count();
        return response()->json(['count' => $count]);
    }

    // 🔒 Shared Validation Method with Custom Messages
    private function validatePackage(Request $request)
    {
        return $request->validate([
            'package_name' => 'required|string|max:255',
            'package_description' => 'nullable|string',
            'package_type' => 'required|string|max:100',
            'package_price' => 'required|numeric|min:0',
            'duration' => 'nullable|string|max:50',
            'pkg_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status_id' => 'required|exists:statuses,id',
            'tour_category' => 'nullable|string|max:255',
            'discount' => 'nullable|numeric|min:0|max:100',
        ], [
            'package_name.required' => 'Package name is required.',
            'package_name.string' => 'Package name must be a string.',
            'package_name.max' => 'Package name cannot exceed 255 characters.',

            'package_description.string' => 'Package description must be a valid string.',

            'package_type.required' => 'Package type is required.',
            'package_type.string' => 'Package type must be a string.',
            'package_type.max' => 'Package type cannot exceed 100 characters.',

            'package_price.required' => 'Package price is required.',
            'package_price.numeric' => 'Package price must be a number.',
            'package_price.min' => 'Package price cannot be negative.',

            'duration.string' => 'Duration must be a string.',
            'duration.max' => 'Duration cannot exceed 50 characters.',

            'pkg_image.image' => 'The uploaded file must be an image.',
            'pkg_image.mimes' => 'Image must be in JPEG, PNG, or JPG format.',
            'pkg_image.max' => 'Image size must not exceed 2MB.',

            'status_id.required' => 'Status is required.',
            'status_id.exists' => 'The selected status is invalid.',

            'tour_category.string' => 'Tour category must be a string.',
            'tour_category.max' => 'Tour category cannot exceed 255 characters.',

            'discount.numeric' => 'Discount must be a number.',
            'discount.min' => 'Discount must be at least 0%.',
            'discount.max' => 'Discount cannot exceed 100%.',
        ]);
    }

    public function getRandomPackages()
    {
        $packages = \App\Models\Package::inRandomOrder()
            ->select('id', 'package_name')
            ->take(6)
            ->get();

        return response()->json($packages);
    }


}
