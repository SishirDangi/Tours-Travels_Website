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
        return response()->json(Package::all(), Response::HTTP_OK);
    }

    // Create a new package
    public function store(Request $request)
    {
        $request->validate([
            'package_name' => 'required|string|max:255',
            'package_description' => 'nullable|string',
            'package_type' => 'nullable|string|max:100',
            'package_price' => 'required|numeric',
            'pkg_image_path' => 'nullable|string',
            'status_id' => 'nullable|exists:statuses,id',
        ]);

        $package = Package::create($request->all());
        return response()->json($package, Response::HTTP_CREATED);
    }

    // Get a specific package
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

        $request->validate([
            'package_name' => 'sometimes|string|max:255',
            'package_description' => 'sometimes|nullable|string',
            'package_type' => 'sometimes|nullable|string|max:100',
            'package_price' => 'sometimes|required|numeric',
            'pkg_image_path' => 'sometimes|nullable|string',
            'status_id' => 'sometimes|nullable|exists:statuses,id',
        ]);

        $package->update($request->all());
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
