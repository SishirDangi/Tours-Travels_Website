<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Package;
use Illuminate\Http\Response;

class PackageController extends Controller
{
    // Get all packages
    public function index()
{
    $packages = Package::all();

    // Include the full URL for the image
    $packages->map(function ($package) {
        if ($package->pkg_image_path) {
            $package->pkg_image_url = asset('storage/' . $package->pkg_image_path);
        }
        return $package;
    });

    return response()->json($packages, Response::HTTP_OK);
}


    // Create a new package
    public function store(Request $request)
    {
        // Validate the incoming data
        $validated = $request->validate([
            'package_name' => 'required|string|max:255',
            'package_description' => 'nullable|string',
            'package_type' => 'nullable|string|max:100',
            'package_price' => 'required|numeric',
            'pkg_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Validate image
            'status_id' => 'nullable|exists:statuses,id',
        ]);

        // Check if an image is uploaded
        if ($request->hasFile('pkg_image')) {
            $image = $request->file('pkg_image');
            $imagePath = $image->store('images/packages', 'public'); // Store the image in the 'public/images/packages' folder
        } else {
            $imagePath = null;
        }

        // Create the package with the image path
        $package = Package::create([
            'package_name' => $validated['package_name'],
            'package_description' => $validated['package_description'],
            'package_type' => $validated['package_type'],
            'package_price' => $validated['package_price'],
            'pkg_image_path' => $imagePath, // Save image path
            'status_id' => $validated['status_id'],
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
            'package_name' => 'sometimes|string|max:255',
            'package_description' => 'sometimes|nullable|string',
            'package_type' => 'sometimes|nullable|string|max:100',
            'package_price' => 'sometimes|required|numeric',
            'pkg_image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status_id' => 'sometimes|nullable|exists:statuses,id',
        ]);

        // Handle image upload for updates
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

        $package->delete();
        return response()->json(['message' => 'Package deleted successfully'], Response::HTTP_OK);
    }
}
